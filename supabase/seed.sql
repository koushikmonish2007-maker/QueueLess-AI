-- ====================================================================
-- QUEUELESS AI 2.0 — PHASE 2 HARDENED SEED DATASET
-- Team: GEN4X | INTELLATHON 2K26
-- Compatible Seed Script for Supabase SQL Editor
-- ====================================================================

-- 1. SEED FACILITIES
INSERT INTO public.facilities (id, name, category, location, address, rating, operating_hours, phone, image_url, description)
VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Apex Super Specialty Hospital',
    'Hospitals',
    'Metro Central',
    '42 Healthway Boulevard, Metro Central',
    4.8,
    '24/7 (OPD 08:00 AM - 05:00 PM)',
    '+91 (020) 2555-0199',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    'Premier tertiary care hospital providing advanced outpatient consultations and diagnostic services.'
),
(
    '00000000-0000-0000-0000-000000000002',
    'Regional Passport & Citizen Seva Kendra',
    'Government',
    'Civic Center',
    'Block C, Administrative Complex, Civic Center',
    4.6,
    '09:00 AM - 05:00 PM (Mon - Fri)',
    '+91 (020) 2444-8800',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    'Centralized government administrative hub for passport renewals, identity documents, and affidavits.'
),
(
    '00000000-0000-0000-0000-000000000003',
    'National Commercial Bank — Financial City Branch',
    'Banks',
    'Tech Hub District',
    'Tower 4, Silicon Boulevard, Tech Hub District',
    4.7,
    '10:00 AM - 04:30 PM (Mon - Sat)',
    '+91 (020) 2666-3322',
    'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
    'Full-service financial facility handling retail banking, trade instruments, and fast teller queues.'
),
(
    '00000000-0000-0000-0000-000000000004',
    'State University — Registrar & Examination Hall',
    'Colleges',
    'North Academic Zone',
    'University Main Gate, North Academic Zone',
    4.5,
    '10:00 AM - 04:00 PM (Mon - Fri)',
    '+91 (020) 2569-1234',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    'Academic administrative services for transcript issuance, degree certificates, and hall ticket verification.'
),
(
    '00000000-0000-0000-0000-000000000005',
    'Unified Civic Municipal Service Center',
    'Service Centers',
    'South Valley',
    'Ward 9, Municipal Square, South Valley',
    4.4,
    '08:30 AM - 05:30 PM (Mon - Sat)',
    '+91 (020) 2712-9911',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    'One-stop municipal services: property tax assessment, water utility billing, and trade licenses.'
)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    location = EXCLUDED.location;

-- 2. SEED SERVICES (Apex Hospital & Other Facilities)
INSERT INTO public.services (id, facility_id, name, description, average_service_minutes, requirements)
VALUES
(
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'General OPD Consultation',
    'First-tier physician evaluation, preliminary diagnosis, and referral routing.',
    12,
    'Photo ID, previous medical prescription (if any)'
),
(
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Cardiology Clinic',
    'Specialist ECG review, hypertension check, and cardiovascular care consultations.',
    20,
    'Past ECG/blood report, doctor referral note'
),
(
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Pathology & Blood Collection',
    'Fasting blood draw, urine panel collections, and rapid routine screenings.',
    8,
    'Doctor lab requisition slip, 10-12 hours fasting notice'
),
(
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'Passport Renewal & Biometrics',
    'Biometric capture, document verification, and renewal clearance.',
    15,
    'Original old passport, Aadhaar card, utility bill'
),
(
    '00000000-0000-0000-0001-000000000005',
    '00000000-0000-0000-0000-000000000003',
    'Retail Teller & Cash Transactions',
    'Cash deposit, high-value demand drafts, and RTGS transfer requests.',
    10,
    'Account passbook, cheque slip, PAN card for transactions > 50,000'
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED COUNTERS (Apex Hospital & Passport Center)
INSERT INTO public.counters (id, facility_id, name, staff_name, status, supported_service_ids)
VALUES
(
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Counter 101 - OPD Intake',
    'Dr. Aris Mehta',
    'active',
    ARRAY['00000000-0000-0000-0001-000000000001'::uuid]
),
(
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Counter 102 - OPD Desk',
    'Dr. Neha Verma',
    'active',
    ARRAY['00000000-0000-0000-0001-000000000001'::uuid]
),
(
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Counter 201 - Cardiology Suite',
    'Dr. K. Ramanathan',
    'active',
    ARRAY['00000000-0000-0000-0001-000000000002'::uuid]
),
(
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'Desk A - Document Verification',
    'Officer S. Deshmukh',
    'active',
    ARRAY['00000000-0000-0000-0001-000000000004'::uuid]
)
ON CONFLICT (id) DO NOTHING;

-- 4. INITIALIZE FACILITY DAILY SEQUENCE COUNTERS FOR ALL DEMO FACILITIES
INSERT INTO public.facility_daily_sequences (facility_id, sequence_date, last_sequence)
VALUES
    ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 0),
    ('00000000-0000-0000-0000-000000000002', CURRENT_DATE, 0),
    ('00000000-0000-0000-0000-000000000003', CURRENT_DATE, 0),
    ('00000000-0000-0000-0000-000000000004', CURRENT_DATE, 0),
    ('00000000-0000-0000-0000-000000000005', CURRENT_DATE, 0)
ON CONFLICT (facility_id, sequence_date) DO NOTHING;
