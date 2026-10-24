/**
 * @file import_facilities_pipeline.js
 * CLI runner for QueueLess AI legitimate dataset ingestion pipeline.
 * Run with: node scripts/import_facilities_pipeline.js
 */

import { runImportPipeline } from '../src/lib/importPipeline.js';
import { MOCK_FACILITIES } from '../src/data/mockData.js';

// Sample demonstration batch of verified public registries from Open Government Data (data.gov.in)
const sampleOfficialDataset = {
  provenance: {
    sourceName: 'National Health Portal / MoHFW Public Health Registry',
    sourceUrl: 'https://www.nhp.gov.in',
    governingBody: 'Ministry of Health and Family Welfare, Government of India',
    license: 'Government Open Data License - India (GODL)',
    licenseUrl: 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf',
    retrievedAt: '2026-10-24T00:00:00Z'
  },
  records: [
    {
      name: 'Bowring and Lady Curzon Hospital',
      category: 'Government Hospitals',
      categoryId: 'govt_hospitals',
      subcategory: 'Autonomous Teaching Hospital',
      stateCode: 'KA',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      city: 'Bengaluru',
      pincode: '560001',
      address: 'Lady Curzon Road, Tasker Town, Shivaji Nagar, Bengaluru, Karnataka 560001',
      operatingHours: '24/7 (OPD: 08:30 AM - 01:00 PM)',
      phone: '+91 (080) 2559-1362',
      rating: 4.4,
      description: 'Major historic public hospital under Karnataka Department of Medical Education.',
      services: [
        {
          name: 'General OPD & Diagnostic Lab',
          averageServiceMinutes: 15,
          requirements: 'OPD registration slip, Photo ID'
        }
      ]
    },
    {
      name: 'Regional Transport Office — Pune (MH-12)',
      category: 'Regional Transport Offices (RTO)',
      categoryId: 'rtos',
      subcategory: 'Regional Transport Office',
      stateCode: 'MH',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Pune',
      pincode: '411001',
      address: 'Near Sangam Bridge, Raja Bahadur Mills Road, Pune, Maharashtra 411001',
      operatingHours: '10:00 AM - 05:30 PM (Mon - Fri)',
      phone: '+91 (020) 2605-8090',
      rating: 4.1,
      description: 'Central licensing and motor vehicles department facility for Pune district.',
      services: [
        {
          name: 'Driving Licence Skill Evaluation & Renewal',
          averageServiceMinutes: 20,
          requirements: 'Application form, Medical Certificate 1A, Proof of Age'
        }
      ]
    },
    // Intentionally duplicate entry to test deduplication
    {
      name: 'Apex Super Specialty Hospital (Anna Salai)',
      category: 'Government Hospitals',
      stateCode: 'TN',
      district: 'Chennai',
      pincode: '600002',
      address: '42 Healthway Boulevard, Anna Salai, Chennai, Tamil Nadu 600002'
    }
  ]
};

console.log('====================================================');
console.log('QUEUELESS AI — OFFICIAL PUBLIC DATASET IMPORT RUNNER');
console.log('====================================================\n');

const result = runImportPipeline(sampleOfficialDataset, MOCK_FACILITIES);

if (!result.success) {
  console.error('❌ Ingestion Failed! Provenance Errors:');
  result.provenanceErrors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}

console.log('✔ Provenance Verified:');
console.log(`  - Source: ${result.summary.source}`);
console.log(`  - License: ${result.summary.license}`);
console.log(`  - Timestamp: ${result.summary.retrievedAt}\n`);

console.log('✔ Pipeline Processing Summary:');
console.log(`  - Total Submitted: ${result.summary.totalSubmitted}`);
console.log(`  - Valid & Normalized: ${result.summary.validCount}`);
console.log(`  - Duplicates Detected & Skipped: ${result.summary.duplicateCount}`);
console.log(`  - Invalid Records Rejected: ${result.summary.rejectedCount}\n`);

console.log('✔ Valid Sample Facility Output:');
result.validRecords.forEach((fac, idx) => {
  console.log(`  [${idx + 1}] ${fac.name} (${fac.city}, ${fac.stateCode})`);
  console.log(`      Status: ${fac.onboardingStatus} | Booking Enabled: ${fac.isBookingEnabled} | Live Queues: ${fac.activeQueues}`);
  console.log(`      Provenance: ${fac.sourceName} | License: ${fac.sourceLicense}\n`);
});

console.log('✔ Import Pipeline Execution Completed Successfully.');
