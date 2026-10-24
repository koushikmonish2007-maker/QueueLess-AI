/**
 * @file importPipeline.js
 * QueueLess AI — Team GEN4X (INTELLATHON 2K26)
 * Legitimate Public/Official Dataset Import Pipeline
 * 
 * Enforces:
 * 1. Source provenance (registry URL, governing body, retrieved date, license).
 * 2. Mandatory open/public licensing verification (GODL, Public Domain).
 * 3. Deduplication engine (normalized name + state + district + pincode hashing).
 * 4. Zero fake partnerships: imported records are strictly tagged as 'listed'
 *    with 'is_booking_enabled = false' and zero synthetic queues.
 */

import { INDIAN_STATES_UTS, EXPANDED_FACILITY_CATEGORIES } from '../data/mockData.js';

// Approved legitimate official licensing registries for India
export const APPROVED_DATA_LICENSES = [
  'Government Open Data License - India (GODL)',
  'Open Government Data License - India',
  'Public Domain',
  'Official Public Domain Directory',
  'Public Sector Financial Registry',
  'Accreditation Public Registry',
  'State Open Data Repository'
];

/**
 * Standardize and sanitize text
 */
export function normalizeString(str) {
  if (!str) return '';
  return str.toString().trim().replace(/\s+/g, ' ');
}

/**
 * Generate deduplication hash key
 */
export function computeFacilityFingerprint(facility) {
  const state = normalizeString(facility.stateCode || facility.state).toUpperCase();
  const district = normalizeString(facility.district).toLowerCase();
  const name = normalizeString(facility.name).toLowerCase().replace(/[^a-z0-9]/g, '');
  const pincode = normalizeString(facility.pincode).replace(/\D/g, '');
  return `${state}:${district}:${name}:${pincode}`;
}

/**
 * 1. Validate dataset provenance and licensing
 */
export function validateProvenanceMetadata(metadata) {
  const errors = [];

  if (!metadata) {
    return { isValid: false, errors: ['Provenance metadata is missing.'] };
  }

  if (!metadata.sourceName || metadata.sourceName.trim().length < 3) {
    errors.push('Source name is required (e.g., National Health Portal, MoRTH Parivahan).');
  }

  if (!metadata.sourceUrl || !metadata.sourceUrl.startsWith('http')) {
    errors.push('Valid official source URL is required.');
  }

  if (!metadata.governingBody) {
    errors.push('Governing administrative body must be specified.');
  }

  if (!metadata.license || !APPROVED_DATA_LICENSES.some(lic => metadata.license.toLowerCase().includes(lic.toLowerCase()))) {
    errors.push(`Dataset license must be an approved public open license. Specified: "${metadata.license}". Supported: ${APPROVED_DATA_LICENSES.join(', ')}`);
  }

  if (!metadata.retrievedAt || isNaN(Date.parse(metadata.retrievedAt))) {
    errors.push('Valid ISO date timestamp of dataset retrieval is required.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 2. Validate and normalize a single facility record
 */
export function validateFacilityRecord(record, provenance, existingFingerprints = new Set()) {
  const errors = [];

  const name = normalizeString(record.name);
  if (!name || name.length < 3) {
    errors.push('Facility name is invalid or too short.');
  }

  // Validate state
  const stateCode = (record.stateCode || record.state_code || '').trim().toUpperCase();
  const matchedState = INDIAN_STATES_UTS.find(s => s.code === stateCode || s.name.toLowerCase() === (record.state || '').trim().toLowerCase());
  
  if (!matchedState) {
    errors.push(`Unknown or unsupported Indian State/UT: "${record.stateCode || record.state}".`);
  }

  const district = normalizeString(record.district);
  if (!district) {
    errors.push('District is required.');
  }

  const address = normalizeString(record.address || record.location);
  if (!address || address.length < 5) {
    errors.push('Full physical address is required.');
  }

  // Clean and validate Indian PIN code (6 digits)
  const pincode = normalizeString(record.pincode).replace(/\D/g, '');
  if (!pincode || pincode.length !== 6) {
    errors.push(`Invalid Indian PIN code: "${record.pincode}". Must be exactly 6 digits.`);
  }

  // Map Category
  const categoryId = record.categoryId || record.category_id || 'govt_hospitals';
  const categoryMatch = EXPANDED_FACILITY_CATEGORIES.find(c => c.id === categoryId || c.key.toLowerCase() === (record.category || '').toLowerCase());
  const finalCategory = categoryMatch ? categoryMatch.key : 'Government Hospitals';
  const finalCategoryId = categoryMatch ? categoryMatch.id : 'govt_hospitals';

  // Compute duplicate key
  const fingerprint = computeFacilityFingerprint({
    stateCode: matchedState?.code || stateCode,
    district,
    name,
    pincode
  });

  const isDuplicate = existingFingerprints.has(fingerprint);

  if (isDuplicate) {
    errors.push('Duplicate record detected: A facility with matching name, district, and PIN code already exists.');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      fingerprint
    };
  }

  // Build clean normalized facility entity
  // CRITICAL: Honest metadata — onboarding_status is STRICTLY 'listed', is_booking_enabled is STRICTLY false
  const normalizedFacility = {
    id: record.id || `fac-${matchedState.code.toLowerCase()}-${pincode}-${Math.random().toString(36).substring(2, 8)}`,
    name,
    category: finalCategory,
    categoryId: finalCategoryId,
    subcategory: normalizeString(record.subcategory) || 'Public Service Facility',
    stateCode: matchedState.code,
    state: matchedState.name,
    district,
    city: normalizeString(record.city || district),
    pincode,
    location: `${district}, ${matchedState.name}`,
    address,
    rating: Number(record.rating) || 4.2,
    operatingHours: normalizeString(record.operatingHours || record.operating_hours) || '09:30 AM - 05:00 PM (Mon - Fri)',
    phone: normalizeString(record.phone) || 'Contact on-site desk',
    imageUrl: record.imageUrl || record.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: normalizeString(record.description) || `Public service facility in ${district}, ${matchedState.name}.`,
    
    // HONEST STATUS ENFORCEMENT:
    onboardingStatus: 'listed',
    isBookingEnabled: false,
    activeQueues: 0, // Zero fake live queues!

    // Source provenance
    sourceName: provenance.sourceName,
    sourceUrl: provenance.sourceUrl,
    sourceLicense: provenance.license,
    officialPortalUrl: record.officialPortalUrl || record.official_portal_url || provenance.sourceUrl,
    lastSyncedAt: new Date().toISOString(),

    // Services
    services: Array.isArray(record.services) && record.services.length > 0 ? record.services.map((s, idx) => ({
      id: s.id || `srv-imp-${idx + 1}`,
      name: normalizeString(s.name || 'General Inquiry & Assistance'),
      averageServiceMinutes: Number(s.averageServiceMinutes) || 15,
      description: normalizeString(s.description || 'Standard public desk service.'),
      requirements: normalizeString(s.requirements || 'Government issued Photo ID proof')
    })) : [
      {
        id: 'srv-imp-default',
        name: 'Public Walk-in Desk & Inquiry',
        averageServiceMinutes: 15,
        description: 'On-site counter assistance.',
        requirements: 'Government issued Photo ID proof'
      }
    ],
    counters: [] // Empty counters for listed facilities
  };

  return {
    isValid: true,
    facility: normalizedFacility,
    fingerprint
  };
}

/**
 * 3. Process complete dataset import batch
 */
export function runImportPipeline(dataset, existingFacilities = []) {
  const existingFingerprints = new Set(existingFacilities.map(f => computeFacilityFingerprint(f)));
  
  // 1. Verify provenance
  const provenanceCheck = validateProvenanceMetadata(dataset.provenance);
  if (!provenanceCheck.isValid) {
    return {
      success: false,
      provenanceErrors: provenanceCheck.errors,
      validRecords: [],
      rejectedRecords: []
    };
  }

  const validRecords = [];
  const rejectedRecords = [];
  const duplicateRecords = [];

  const rawList = Array.isArray(dataset.records) ? dataset.records : [];

  for (const raw of rawList) {
    const res = validateFacilityRecord(raw, dataset.provenance, existingFingerprints);
    if (res.isValid && res.facility) {
      existingFingerprints.add(res.fingerprint);
      validRecords.push(res.facility);
    } else {
      if (res.errors.some(e => e.includes('Duplicate'))) {
        duplicateRecords.push({ record: raw, errors: res.errors });
      } else {
        rejectedRecords.push({ record: raw, errors: res.errors });
      }
    }
  }

  return {
    success: true,
    summary: {
      source: dataset.provenance.sourceName,
      license: dataset.provenance.license,
      retrievedAt: dataset.provenance.retrievedAt,
      totalSubmitted: rawList.length,
      validCount: validRecords.length,
      duplicateCount: duplicateRecords.length,
      rejectedCount: rejectedRecords.length
    },
    validRecords,
    duplicateRecords,
    rejectedRecords
  };
}
