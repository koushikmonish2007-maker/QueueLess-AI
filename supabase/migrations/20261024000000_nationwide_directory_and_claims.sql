-- ====================================================================
-- QUEUELESS AI 2.0 — PHASE 3 NATIONWIDE DIRECTORY & SECURE CLAIMS MIGRATION
-- Team: GEN4X | Nationwide Expansion Architecture
-- Hierarchical State/UT -> District -> City -> Facility Directory
-- Normalized Categories, Source Provenance, Onboarding Status & Secure Claims
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. GEOGRAPHIC REFERENCE TABLES: ALL 36 INDIAN STATES & UNION TERRITORIES
CREATE TABLE IF NOT EXISTS public.indian_states_uts (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('State', 'Union Territory')),
    zone VARCHAR(30) NOT NULL,
    capital VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed all 28 States and 8 Union Territories
INSERT INTO public.indian_states_uts (code, name, type, zone, capital) VALUES
    ('AN', 'Andaman and Nicobar Islands', 'Union Territory', 'South', 'Port Blair'),
    ('AP', 'Andhra Pradesh', 'State', 'South', 'Amaravati'),
    ('AR', 'Arunachal Pradesh', 'State', 'North-East', 'Itanagar'),
    ('AS', 'Assam', 'State', 'North-East', 'Dispur'),
    ('BR', 'Bihar', 'State', 'East', 'Patna'),
    ('CH', 'Chandigarh', 'Union Territory', 'North', 'Chandigarh'),
    ('CG', 'Chhattisgarh', 'State', 'Central', 'Raipur'),
    ('DN', 'Dadra and Nagar Haveli and Daman and Diu', 'Union Territory', 'West', 'Daman'),
    ('DL', 'Delhi', 'Union Territory', 'North', 'New Delhi'),
    ('GA', 'Goa', 'State', 'West', 'Panaji'),
    ('GJ', 'Gujarat', 'State', 'West', 'Gandhinagar'),
    ('HR', 'Haryana', 'State', 'North', 'Chandigarh'),
    ('HP', 'Himachal Pradesh', 'State', 'North', 'Shimla'),
    ('JK', 'Jammu and Kashmir', 'Union Territory', 'North', 'Srinagar / Jammu'),
    ('JH', 'Jharkhand', 'State', 'East', 'Ranchi'),
    ('KA', 'Karnataka', 'State', 'South', 'Bengaluru'),
    ('KL', 'Kerala', 'State', 'South', 'Thiruvananthapuram'),
    ('LA', 'Ladakh', 'Union Territory', 'North', 'Leh'),
    ('LD', 'Lakshadweep', 'Union Territory', 'South', 'Kavaratti'),
    ('MP', 'Madhya Pradesh', 'State', 'Central', 'Bhopal'),
    ('MH', 'Maharashtra', 'State', 'West', 'Mumbai'),
    ('MN', 'Manipur', 'State', 'North-East', 'Imphal'),
    ('ML', 'Meghalaya', 'State', 'North-East', 'Shillong'),
    ('MZ', 'Mizoram', 'State', 'North-East', 'Aizawl'),
    ('NL', 'Nagaland', 'State', 'North-East', 'Kohima'),
    ('OD', 'Odisha', 'State', 'East', 'Bhubaneswar'),
    ('PY', 'Puducherry', 'Union Territory', 'South', 'Puducherry'),
    ('PB', 'Punjab', 'State', 'North', 'Chandigarh'),
    ('RJ', 'Rajasthan', 'State', 'North', 'Jaipur'),
    ('SK', 'Sikkim', 'State', 'North-East', 'Gangtok'),
    ('TN', 'Tamil Nadu', 'State', 'South', 'Chennai'),
    ('TS', 'Telangana', 'State', 'South', 'Hyderabad'),
    ('TR', 'Tripura', 'State', 'North-East', 'Agartala'),
    ('UP', 'Uttar Pradesh', 'State', 'North', 'Lucknow'),
    ('UK', 'Uttarakhand', 'State', 'North', 'Dehradun'),
    ('WB', 'West Bengal', 'State', 'East', 'Kolkata')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    zone = EXCLUDED.zone,
    capital = EXCLUDED.capital;

-- 3. EXPANDED FACILITY CATEGORIES REFERENCE
CREATE TABLE IF NOT EXISTS public.facility_categories (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_ta VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

INSERT INTO public.facility_categories (id, name_en, name_ta, icon_name, description, sort_order) VALUES
    ('govt_hospitals', 'Government Hospitals', 'அரசு மருத்துவமனைகள்', 'HeartPulse', 'District Headquarters, Medical College Hospitals & Taluk Hospitals', 1),
    ('private_hospitals', 'Private Hospitals', 'தனியார் மருத்துவமனைகள்', 'Building2', 'Multi-specialty and Super-specialty Hospitals', 2),
    ('phcs', 'Primary Health Centres (PHC)', 'ஆரம்ப சுகாதார நிலையங்கள்', 'Stethoscope', 'Urban and Rural Primary Healthcare Centers', 3),
    ('clinics', 'Clinics & Dispensaries', 'கிளினிக்குகள் & மருந்தகங்கள்', 'Activity', 'Community Outpatient Clinics and Diagnostic Dispensaries', 4),
    ('bank_branches', 'Bank Branches', 'வங்கி கிளைகள்', 'Landmark', 'Public Sector Banks, Commercial Banks & Regional Rural Banks', 5),
    ('rtos', 'Regional Transport Offices (RTO)', 'வட்டாரப் போக்குவரத்து அலுவலகங்கள்', 'Car', 'Driver Licences, Vehicle Registration & Fitness Verification', 6),
    ('passport_centres', 'Passport Seva Kendras', 'பாஸ்போர்ட் சேவை மையங்கள்', 'FileText', 'Passport Seva Kendra (PSK) & Post Office PSK (POPSK)', 7),
    ('municipal_offices', 'Municipal Offices', 'நகராட்சி அலுவலகங்கள்', 'Building', 'Municipal Corporations, Ward Offices, Property Tax & Utilities', 8),
    ('revenue_offices', 'Revenue & Taluk Offices', 'வருவாய் & தாலுகா அலுவலகங்கள்', 'Briefcase', 'Tahsildar Offices, Sub-Registrar & Land Revenue Desks', 9),
    ('citizen_service_centres', 'Citizen Service Centres', 'மக்கள் சேவை மையங்கள்', 'HelpCircle', 'Common Service Centres (CSC), e-Seva, MeeSeva & Facilitation Hubs', 10)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_ta = EXCLUDED.name_ta,
    icon_name = EXCLUDED.icon_name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- 4. OFFICIAL DATA SOURCES & PROVENANCE REGISTRY
CREATE TABLE IF NOT EXISTS public.facility_data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    official_url TEXT NOT NULL,
    governing_body VARCHAR(255) NOT NULL,
    license VARCHAR(150) NOT NULL DEFAULT 'Government Open Data License - India (GODL)',
    license_url TEXT DEFAULT 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf',
    description TEXT,
    last_audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.facility_data_sources (source_id, name, official_url, governing_body, license) VALUES
    ('data_gov_in', 'Open Government Data (OGD) Platform India', 'https://data.gov.in', 'National Informatics Centre / MeitY', 'Government Open Data License - India (GODL)'),
    ('nhp_india', 'National Health Portal / National Health Mission', 'https://www.nhp.gov.in', 'Ministry of Health and Family Welfare', 'Government Open Data License - India (GODL)'),
    ('parivahan', 'Parivahan Sewa - RTO Directory', 'https://parivahan.gov.in', 'Ministry of Road Transport and Highways (MoRTH)', 'Official Public Domain Directory'),
    ('passport_india', 'Passport Seva Portal', 'https://www.passportindia.gov.in', 'Consular, Passport & Visa Division, MEA', 'Official Public Domain Directory'),
    ('rbi_banks', 'Reserve Bank of India Bank Directory', 'https://www.rbi.org.in', 'Reserve Bank of India', 'Public Sector Financial Registry'),
    ('tnegga', 'Tamil Nadu e-Governance Agency (TNeGA) e-Seva Directory', 'https://tnega.tn.gov.in', 'Information Technology and Digital Services Department, GoTN', 'State Open Data Repository')
ON CONFLICT (source_id) DO UPDATE SET
    name = EXCLUDED.name,
    official_url = EXCLUDED.official_url,
    governing_body = EXCLUDED.governing_body,
    license = EXCLUDED.license;

-- 5. UPGRADE FACILITIES TABLE FOR NATIONWIDE GEOGRAPHIC & ONBOARDING SUPPORT
ALTER TABLE public.facilities
    ADD COLUMN IF NOT EXISTS state_code VARCHAR(10) NOT NULL DEFAULT 'TN',
    ADD COLUMN IF NOT EXISTS state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    ADD COLUMN IF NOT EXISTS district VARCHAR(100) NOT NULL DEFAULT 'Chennai',
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS taluk VARCHAR(100),
    ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
    ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
    ADD COLUMN IF NOT EXISTS category_id VARCHAR(50) DEFAULT 'govt_hospitals',
    ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(50) NOT NULL DEFAULT 'listed',
    ADD COLUMN IF NOT EXISTS is_booking_enabled BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS source_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS source_license VARCHAR(150) DEFAULT 'Government Open Data License - India (GODL)',
    ADD COLUMN IF NOT EXISTS official_portal_url TEXT,
    ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Safely convert legacy category enum to TEXT to seamlessly support all 10 nationwide categories
DO $$ BEGIN
    ALTER TABLE public.facilities ALTER COLUMN category TYPE TEXT USING category::TEXT;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- Enforce check constraint on onboarding_status if not already present
DO $$ BEGIN
    ALTER TABLE public.facilities 
        DROP CONSTRAINT IF EXISTS chk_facility_onboarding_status;
    ALTER TABLE public.facilities
        ADD CONSTRAINT chk_facility_onboarding_status 
        CHECK (onboarding_status IN ('listed', 'verified', 'partnered', 'booking_enabled'));
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- Update pilot facility 1: Designated Sandbox & Demo Environment (Booking Enabled for Testing)
UPDATE public.facilities
SET 
    name = 'QueueLess Sandbox Pilot Clinic (Demo & Evaluation)',
    state_code = 'TN',
    state = 'Tamil Nadu',
    district = 'Chennai',
    city = 'Chennai',
    pincode = '600002',
    category_id = 'govt_hospitals',
    subcategory = 'Designated Sandbox Pilot Testbed',
    onboarding_status = 'booking_enabled',
    is_booking_enabled = true,
    source_name = 'QueueLess AI Internal Testbed & Sandbox Registry',
    source_url = NULL,
    source_license = 'MIT Open Evaluation Environment',
    official_portal_url = NULL,
    verification_notes = 'Designated internal sandbox environment for testing virtual token booking and counter operations. Not an official government institution.'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Update pilot facilities 2 to 5: Unconfirmed facilities strictly defaulted to 'listed' with booking disabled
UPDATE public.facilities
SET 
    state_code = 'TN',
    state = 'Tamil Nadu',
    district = 'Coimbatore',
    city = 'Coimbatore',
    pincode = '641012',
    category_id = 'passport_centres',
    subcategory = 'Passport Seva Kendra (PSK)',
    onboarding_status = 'listed',
    is_booking_enabled = false,
    source_name = 'Passport Seva Portal, Ministry of External Affairs',
    source_url = 'https://www.passportindia.gov.in',
    source_license = 'Official Public Domain Directory',
    official_portal_url = 'https://www.passportindia.gov.in',
    verification_notes = 'Public registry informational listing. Walk-in physical service counters only. Online booking is not activated.'
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE public.facilities
SET 
    state_code = 'TN',
    state = 'Tamil Nadu',
    district = 'Chennai',
    city = 'Chennai',
    pincode = '600001',
    category_id = 'bank_branches',
    subcategory = 'Public Sector Commercial Bank Branch',
    onboarding_status = 'listed',
    is_booking_enabled = false,
    source_name = 'Reserve Bank of India Bank Directory',
    source_url = 'https://rbi.org.in',
    source_license = 'Public Sector Financial Registry',
    official_portal_url = 'https://sbi.co.in',
    verification_notes = 'Public financial registry informational listing. Walk-in physical counter services only. Online booking is not activated.'
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE public.facilities
SET 
    state_code = 'TN',
    state = 'Tamil Nadu',
    district = 'Madurai',
    city = 'Madurai',
    pincode = '625021',
    category_id = 'citizen_service_centres',
    subcategory = 'University Administrative & Examination Directorate',
    onboarding_status = 'listed',
    is_booking_enabled = false,
    source_name = 'Tamil Nadu Higher Education Department Directory',
    source_url = 'https://tndte.gov.in',
    source_license = 'Government Open Data License - India (GODL)',
    official_portal_url = 'https://mkuniversity.ac.in',
    verification_notes = 'Public registry informational listing. Walk-in physical service counters only.'
WHERE id = '00000000-0000-0000-0000-000000000004';

UPDATE public.facilities
SET 
    state_code = 'TN',
    state = 'Tamil Nadu',
    district = 'Tiruchirappalli',
    city = 'Tiruchirappalli',
    pincode = '620001',
    category_id = 'municipal_offices',
    subcategory = 'City Corporation Citizen Civic Centre',
    onboarding_status = 'listed',
    is_booking_enabled = false,
    source_name = 'Commissioner of Municipal Administration, Tamil Nadu',
    source_url = 'https://tn.gov.in/cma',
    source_license = 'Government Open Data License - India (GODL)',
    official_portal_url = 'https://trichycorporation.gov.in',
    verification_notes = 'Public registry informational listing. Walk-in physical service counters only.'
WHERE id = '00000000-0000-0000-0000-000000000005';

-- 6. SECURE FACILITY CLAIMS SYSTEM
-- Allows hospital, bank, or government representatives to request administrative ownership
-- Direct profile role escalations via client are STRICTLY BLOCKED; approval requires super_admin
CREATE TABLE IF NOT EXISTS public.facility_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    claimant_name VARCHAR(150) NOT NULL,
    official_email VARCHAR(255) NOT NULL,
    official_phone VARCHAR(50) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    government_id_type VARCHAR(100) NOT NULL,
    id_proof_url TEXT,
    authorization_letter_url TEXT,
    additional_notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexing for claim lookups
CREATE INDEX IF NOT EXISTS idx_facility_claims_facility ON public.facility_claims(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_claims_claimant ON public.facility_claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_facility_claims_status ON public.facility_claims(status);

-- 7. PERFORMANCE INDEXES FOR NATIONWIDE SEARCH & DIRECTORY HIERARCHY
CREATE INDEX IF NOT EXISTS idx_facilities_state_district ON public.facilities(state_code, district) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_facilities_onboarding_status ON public.facilities(onboarding_status) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_facilities_booking_enabled ON public.facilities(is_booking_enabled) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_facilities_pincode ON public.facilities(pincode) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_facilities_category_id ON public.facilities(category_id) WHERE is_active = true;

-- 8. ROW LEVEL SECURITY (RLS) FOR CLAIMS & DIRECTORY
ALTER TABLE public.indian_states_uts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_claims ENABLE ROW LEVEL SECURITY;

-- Geographic and Category Reference Tables: Public Read-Only Access
DROP POLICY IF EXISTS "Public can view states and UTs" ON public.indian_states_uts;
CREATE POLICY "Public can view states and UTs"
    ON public.indian_states_uts FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can view facility categories" ON public.facility_categories;
CREATE POLICY "Public can view facility categories"
    ON public.facility_categories FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can view facility data sources" ON public.facility_data_sources;
CREATE POLICY "Public can view facility data sources"
    ON public.facility_data_sources FOR SELECT
    TO anon, authenticated
    USING (true);

-- Facility Claims Policies:
-- Claimant can view their own claims; Super admins can view all claims
DROP POLICY IF EXISTS "Users can view own facility claims" ON public.facility_claims;
CREATE POLICY "Users can view own facility claims"
    ON public.facility_claims FOR SELECT
    TO authenticated
    USING (
        claimant_id = auth.uid() 
        OR public.get_auth_role() = 'super_admin'
    );

-- Authenticated users can insert a new pending claim
DROP POLICY IF EXISTS "Users can submit a facility claim" ON public.facility_claims;
CREATE POLICY "Users can submit a facility claim"
    ON public.facility_claims FOR INSERT
    TO authenticated
    WITH CHECK (
        claimant_id = auth.uid() 
        AND status = 'pending'
    );

-- Direct client updates/deletes to claims are BLOCKED.
-- Transitions happen exclusively via secure SECURITY DEFINER RPCs.
DROP POLICY IF EXISTS "Block direct client claim updates" ON public.facility_claims;
DROP POLICY IF EXISTS "Block direct client claim deletes" ON public.facility_claims;

-- 9. STRICT ENFORCEMENT IN BOOK_QUEUE_TOKEN (Only booking_enabled facilities)
CREATE OR REPLACE FUNCTION public.book_queue_token(
    p_facility_id UUID,
    p_service_id UUID,
    p_visitor_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_priority token_priority DEFAULT 'normal'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_citizen_id UUID := auth.uid();
    v_prefix TEXT;
    v_category TEXT;
    v_onboarding_status TEXT;
    v_is_booking_enabled BOOLEAN;
    v_facility_name TEXT;
    v_token_count INTEGER;
    v_token_number TEXT;
    v_new_token public.queue_tokens%ROWTYPE;
BEGIN
    -- 1. Require authentication
    IF v_citizen_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated: You must be signed in to book a virtual queue token.';
    END IF;

    -- 2. Validate visitor name
    IF p_visitor_name IS NULL OR TRIM(p_visitor_name) = '' THEN
        RAISE EXCEPTION 'InvalidInput: Visitor name is required.';
    END IF;

    -- 3. Validate priority authorization: Emergency priority reserved for staff
    IF p_priority = 'emergency' AND NOT public.is_facility_admin(p_facility_id) THEN
        RAISE EXCEPTION 'UnauthorizedPriority: Emergency priority tickets can only be dispatched by facility staff.';
    END IF;

    -- 4. Validate facility exists, is active, AND is officially onboarding/booking-enabled
    SELECT name, category, onboarding_status, is_booking_enabled 
    INTO v_facility_name, v_category, v_onboarding_status, v_is_booking_enabled
    FROM public.facilities 
    WHERE id = p_facility_id AND is_active = true;
    
    IF v_facility_name IS NULL THEN
        RAISE EXCEPTION 'FacilityNotFound: The requested facility does not exist or is currently inactive.';
    END IF;

    -- STRICT RULE: Disallow token bookings for facilities that are merely listed or verified without active queue management
    IF NOT (v_is_booking_enabled = true AND v_onboarding_status = 'booking_enabled') THEN
        RAISE EXCEPTION 'BookingNotEnabled: Virtual queuing is only available for officially partnered facilities with verified queue management. This facility is currently an informational directory listing.';
    END IF;

    -- 5. Validate service exists, is active, AND strictly belongs to p_facility_id
    IF NOT EXISTS (
        SELECT 1 FROM public.services 
        WHERE id = p_service_id 
          AND facility_id = p_facility_id 
          AND is_active = true
    ) THEN
        RAISE EXCEPTION 'ServiceNotFound: The requested service does not exist, is inactive, or does not belong to this facility.';
    END IF;

    -- 6. Check duplicate active booking for this citizen & service
    IF EXISTS (
        SELECT 1 FROM public.queue_tokens
        WHERE citizen_id = v_citizen_id
          AND service_id = p_service_id
          AND status IN ('waiting', 'called', 'in_service')
    ) THEN
        RAISE EXCEPTION 'DuplicateBooking: You already have an active virtual token for this service.';
    END IF;

    -- 7. Prefix determination from facility category (handles enum and normalized category names)
    v_prefix := CASE 
        WHEN v_category ILIKE '%Hospital%' OR v_category ILIKE '%Health%' THEN 'H'
        WHEN v_category ILIKE '%Bank%' THEN 'B'
        WHEN v_category ILIKE '%Passport%' THEN 'P'
        WHEN v_category ILIKE '%Transport%' OR v_category ILIKE '%RTO%' THEN 'R'
        WHEN v_category ILIKE '%Municipal%' THEN 'M'
        WHEN v_category ILIKE '%Revenue%' OR v_category ILIKE '%Taluk%' THEN 'T'
        WHEN v_category ILIKE '%Service%' OR v_category ILIKE '%e-Seva%' THEN 'S'
        WHEN v_category ILIKE '%Government%' THEN 'G'
        WHEN v_category ILIKE '%College%' THEN 'U'
        ELSE 'Q'
    END;

    -- 8. Concurrency-Safe Monotonic Daily Sequence Generation
    INSERT INTO public.facility_daily_sequences (facility_id, sequence_date, last_sequence)
    VALUES (p_facility_id, CURRENT_DATE, 1)
    ON CONFLICT (facility_id, sequence_date)
    DO UPDATE SET last_sequence = public.facility_daily_sequences.last_sequence + 1
    RETURNING last_sequence INTO v_token_count;

    v_token_number := v_prefix || '-' || LPAD(v_token_count::TEXT, 3, '0');

    -- 9. Insert queue token
    INSERT INTO public.queue_tokens (
        facility_id,
        service_id,
        citizen_id,
        token_number,
        token_date,
        visitor_name,
        phone,
        priority,
        status
    ) VALUES (
        p_facility_id,
        p_service_id,
        v_citizen_id,
        v_token_number,
        CURRENT_DATE,
        TRIM(p_visitor_name),
        p_phone,
        p_priority,
        'waiting'
    ) RETURNING * INTO v_new_token;

    -- 10. Audit event
    INSERT INTO public.queue_events (
        token_id,
        facility_id,
        event_type,
        actor_id,
        metadata
    ) VALUES (
        v_new_token.id,
        p_facility_id,
        'token_created',
        v_citizen_id,
        jsonb_build_object('token_number', v_token_number, 'priority', p_priority)
    );

    -- 11. In-app notification
    INSERT INTO public.notifications (
        user_id,
        token_id,
        title,
        message,
        type
    ) VALUES (
        v_citizen_id,
        v_new_token.id,
        'Token Booked: #' || v_token_number,
        'Your virtual queue position has been confirmed at ' || v_facility_name,
        'token_booked'
    );

    RETURN to_jsonb(v_new_token);
END;
$$;

-- 10. HARMONIZE PROFILE ESCALATION PROTECTION TRIGGER
-- Ensure super_admin can approve claims without being blocked by protect_profile_role trigger
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.facility_id IS DISTINCT FROM NEW.facility_id) THEN
        IF auth.role() <> 'service_role' AND public.get_auth_role() <> 'super_admin' THEN
            RAISE EXCEPTION 'Unauthorized: Modifying role or facility assignment is strictly restricted to system administrators.';
        END IF;
    END IF;
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- 11. SECURE STORED PROCEDURES FOR CLAIM APPROVAL / REJECTION
-- ONLY super_admin can approve claims; automatically grants facility_admin role securely
CREATE OR REPLACE FUNCTION public.approve_facility_claim(
    p_claim_id UUID,
    p_admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_role user_role;
    v_claim public.facility_claims%ROWTYPE;
    v_facility_name TEXT;
BEGIN
    -- 1. Strictly verify that caller is super_admin
    v_admin_role := public.get_auth_role();
    IF v_admin_role IS DISTINCT FROM 'super_admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only super administrators can approve facility claims.';
    END IF;

    -- 2. Fetch and lock claim row
    SELECT * INTO v_claim
    FROM public.facility_claims
    WHERE id = p_claim_id
    FOR UPDATE;

    IF v_claim.id IS NULL THEN
        RAISE EXCEPTION 'ClaimNotFound: Facility claim with ID % does not exist.', p_claim_id;
    END IF;

    IF v_claim.status = 'approved' THEN
        RAISE EXCEPTION 'ClaimAlreadyProcessed: This facility claim has already been approved.';
    END IF;

    -- 3. Fetch facility details
    SELECT name INTO v_facility_name
    FROM public.facilities
    WHERE id = v_claim.facility_id;

    -- 4. Mark claim approved
    UPDATE public.facility_claims
    SET status = 'approved',
        reviewed_by = auth.uid(),
        reviewed_at = timezone('utc'::text, now()),
        review_notes = p_admin_notes,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_claim_id;

    -- 5. Securely elevate claimant's profile role to 'facility_admin' and bind facility_id
    -- Bypass protect_profile_role trigger safely as database owner in SECURITY DEFINER
    UPDATE public.profiles
    SET role = 'facility_admin',
        facility_id = v_claim.facility_id,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_claim.claimant_id;

    -- 6. Elevate facility onboarding status to 'partnered' (if it was listed or verified)
    UPDATE public.facilities
    SET onboarding_status = CASE 
            WHEN onboarding_status = 'booking_enabled' THEN 'booking_enabled' 
            ELSE 'partnered' 
        END,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_claim.facility_id;

    -- 7. Audit event
    INSERT INTO public.queue_events (
        facility_id,
        event_type,
        actor_id,
        metadata
    ) VALUES (
        v_claim.facility_id,
        'facility_claim_approved',
        auth.uid(),
        jsonb_build_object(
            'claim_id', p_claim_id,
            'claimant_id', v_claim.claimant_id,
            'claimant_email', v_claim.official_email,
            'designation', v_claim.designation
        )
    );

    -- 8. In-app notification to claimant
    INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type
    ) VALUES (
        v_claim.claimant_id,
        'Facility Claim Approved!',
        'Your administrative claim for ' || COALESCE(v_facility_name, 'the facility') || ' has been approved. You now have facility administrator privileges.',
        'status_update'
    );

    RETURN jsonb_build_object(
        'success', true,
        'claim_id', p_claim_id,
        'facility_id', v_claim.facility_id,
        'claimant_id', v_claim.claimant_id,
        'new_role', 'facility_admin'
    );
END;
$$;

-- Procedure to Reject Facility Claim
CREATE OR REPLACE FUNCTION public.reject_facility_claim(
    p_claim_id UUID,
    p_reason TEXT DEFAULT 'Verification documentation could not be authenticated.'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_role user_role;
    v_claim public.facility_claims%ROWTYPE;
    v_facility_name TEXT;
BEGIN
    -- 1. Strictly verify that caller is super_admin
    v_admin_role := public.get_auth_role();
    IF v_admin_role IS DISTINCT FROM 'super_admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only super administrators can review and reject facility claims.';
    END IF;

    -- 2. Fetch and lock claim row
    SELECT * INTO v_claim
    FROM public.facility_claims
    WHERE id = p_claim_id
    FOR UPDATE;

    IF v_claim.id IS NULL THEN
        RAISE EXCEPTION 'ClaimNotFound: Facility claim with ID % does not exist.', p_claim_id;
    END IF;

    -- 3. Fetch facility name
    SELECT name INTO v_facility_name
    FROM public.facilities
    WHERE id = v_claim.facility_id;

    -- 4. Mark claim rejected
    UPDATE public.facility_claims
    SET status = 'rejected',
        reviewed_by = auth.uid(),
        reviewed_at = timezone('utc'::text, now()),
        review_notes = p_reason,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_claim_id;

    -- 5. Audit event
    INSERT INTO public.queue_events (
        facility_id,
        event_type,
        actor_id,
        metadata
    ) VALUES (
        v_claim.facility_id,
        'facility_claim_rejected',
        auth.uid(),
        jsonb_build_object('claim_id', p_claim_id, 'reason', p_reason)
    );

    -- 6. Notification to claimant
    INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type
    ) VALUES (
        v_claim.claimant_id,
        'Facility Claim Status Update',
        'Your claim for ' || COALESCE(v_facility_name, 'the facility') || ' could not be approved at this time: ' || p_reason,
        'status_update'
    );

    RETURN jsonb_build_object(
        'success', true,
        'claim_id', p_claim_id,
        'status', 'rejected',
        'reason', p_reason
    );
END;
$$;

-- 11. GRANT PRIVILEGES
REVOKE EXECUTE ON FUNCTION public.approve_facility_claim(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_facility_claim(UUID, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.approve_facility_claim(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_facility_claim(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.book_queue_token(UUID, UUID, TEXT, TEXT, token_priority) TO authenticated;
