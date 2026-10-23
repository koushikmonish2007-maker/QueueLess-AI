-- ====================================================================
-- QUEUELESS AI 2.0 — PHASE 2 HARDENED DATABASE MIGRATION
-- Team: GEN4X | INTELLATHON 2K26
-- Universal Virtual Queue Management Architecture
-- Fully Idempotent, Non-Recursive RLS, Immutable Indexes & Concurrency Safe
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM & DOMAIN TYPES (Safe idempotence)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('citizen', 'facility_admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE facility_category AS ENUM ('Hospitals', 'Government', 'Banks', 'Colleges', 'Service Centers');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE counter_status AS ENUM ('active', 'busy', 'break', 'offline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE token_status AS ENUM ('waiting', 'called', 'in_service', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE token_priority AS ENUM ('normal', 'senior', 'emergency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop legacy view if it was created in previous iterations
DROP VIEW IF EXISTS public.public_queue_display CASCADE;

-- 3. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'citizen',
    full_name TEXT NOT NULL,
    phone TEXT,
    facility_id UUID, -- Assigned facility for facility_admin
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category facility_category NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.8 CHECK (rating >= 1.0 AND rating <= 5.0),
    operating_hours TEXT NOT NULL,
    phone TEXT,
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Foreign key for profile facility_id
ALTER TABLE public.profiles 
    DROP CONSTRAINT IF EXISTS fk_profile_facility,
    ADD CONSTRAINT fk_profile_facility FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON DELETE SET NULL;

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    average_service_minutes INTEGER NOT NULL DEFAULT 15 CHECK (average_service_minutes > 0),
    requirements TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. COUNTERS TABLE
CREATE TABLE IF NOT EXISTS public.counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    staff_name TEXT,
    status counter_status NOT NULL DEFAULT 'offline',
    current_token_id UUID,
    supported_service_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ATOMIC DAILY SEQUENCE TRACKER (Concurrency-Safe Counter)
CREATE TABLE IF NOT EXISTS public.facility_daily_sequences (
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    sequence_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_sequence INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (facility_id, sequence_date)
);

-- 8. QUEUE TOKENS TABLE
-- Fixed: Uses dedicated token_date DATE column to avoid immutable index violations on timestamptz
CREATE TABLE IF NOT EXISTS public.queue_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    citizen_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    token_number TEXT NOT NULL,
    token_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visitor_name TEXT NOT NULL,
    phone TEXT,
    priority token_priority NOT NULL DEFAULT 'normal',
    status token_status NOT NULL DEFAULT 'waiting',
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    called_at TIMESTAMPTZ,
    service_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure token_date column exists if table was previously created without it
ALTER TABLE public.queue_tokens 
    ADD COLUMN IF NOT EXISTS token_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Foreign key circular reference resolution for counters
ALTER TABLE public.counters 
    DROP CONSTRAINT IF EXISTS fk_counter_current_token,
    ADD CONSTRAINT fk_counter_current_token FOREIGN KEY (current_token_id) REFERENCES public.queue_tokens(id) ON DELETE SET NULL;

-- 9. QUEUE AUDIT EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.queue_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_id UUID REFERENCES public.queue_tokens(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
    counter_id UUID REFERENCES public.counters(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token_id UUID REFERENCES public.queue_tokens(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- PERFORMANCE INDEXES & CONSTRAINTS
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_facilities_category ON public.facilities(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_facility ON public.services(facility_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_counters_facility_status ON public.counters(facility_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_facility_status ON public.queue_tokens(facility_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_citizen_status ON public.queue_tokens(citizen_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_service_status ON public.queue_tokens(service_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_created ON public.queue_tokens(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = false;

-- DUPLICATE PREVENTION CONSTRAINT:
-- Citizen can only have ONE active token per service at any given time
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_citizen_service_token
    ON public.queue_tokens(citizen_id, service_id)
    WHERE status IN ('waiting', 'called', 'in_service') AND citizen_id IS NOT NULL;

-- IMMUTABLE DATABASE-LEVEL TOKEN UNIQUENESS PER FACILITY DAILY:
-- Fixed: Uses dedicated token_date DATE column (no timestamptz cast error)
DROP INDEX IF EXISTS public.idx_unique_facility_token_daily;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_facility_token_daily
    ON public.queue_tokens (facility_id, token_date, token_number);

-- ====================================================================
-- NON-RECURSIVE SECURITY DEFINER AUTHENTICATION HELPERS
-- These functions execute as database owner, breaking RLS recursion loops
-- ====================================================================

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_auth_facility_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT facility_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_facility_admin(check_facility_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
          AND (
              role = 'super_admin' 
              OR (role = 'facility_admin' AND facility_id = check_facility_id)
          )
    );
$$;

-- ====================================================================
-- SECURITY & INTEGRITY TRIGGERS
-- ====================================================================

-- 1. Automatic Profile Creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Citizen User'),
        NEW.raw_user_meta_data->>'phone',
        'citizen' -- Default role is strictly citizen
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
    END IF;
END $$;

-- 2. Prevent role or facility_id escalation via client update
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
    IF (OLD.role IS DISTINCT FROM NEW.role OR OLD.facility_id IS DISTINCT FROM NEW.facility_id) THEN
        IF auth.role() <> 'service_role' THEN
            RAISE EXCEPTION 'Unauthorized: Modifying role or facility assignment is strictly restricted to system administrators.';
        END IF;
    END IF;
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- 3. Protect Notification Integrity: Only is_read can be updated
CREATE OR REPLACE FUNCTION public.protect_notification_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF (OLD.id IS DISTINCT FROM NEW.id OR 
        OLD.user_id IS DISTINCT FROM NEW.user_id OR 
        OLD.token_id IS DISTINCT FROM NEW.token_id OR 
        OLD.title IS DISTINCT FROM NEW.title OR 
        OLD.message IS DISTINCT FROM NEW.message OR 
        OLD.type IS DISTINCT FROM NEW.type OR 
        OLD.created_at IS DISTINCT FROM NEW.created_at) THEN
        RAISE EXCEPTION 'Unauthorized: Only the is_read status of a notification can be modified.';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_notification_content ON public.notifications;
CREATE TRIGGER trg_protect_notification_content
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.protect_notification_content();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_daily_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES (Strictly owner-only reads to protect personal details full_name & phone)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Explicitly drop legacy staff profile read policy to prevent exposure of full_name and phone
DROP POLICY IF EXISTS "Admins can view facility staff profiles" ON public.profiles;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid() AND role = 'citizen');

DROP POLICY IF EXISTS "Users can update their own profile details" ON public.profiles;
CREATE POLICY "Users can update their own profile details"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 2. FACILITIES POLICIES
-- Separate permissive SELECT policies: Public users read active facilities without executing admin helpers
DROP POLICY IF EXISTS "Public can view active facilities" ON public.facilities;
CREATE POLICY "Public can view active facilities"
    ON public.facilities FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view assigned facility" ON public.facilities;
CREATE POLICY "Admins can view assigned facility"
    ON public.facilities FOR SELECT
    TO authenticated
    USING (public.is_facility_admin(id));

DROP POLICY IF EXISTS "Super admins can insert facilities" ON public.facilities;
CREATE POLICY "Super admins can insert facilities"
    ON public.facilities FOR INSERT
    TO authenticated
    WITH CHECK (public.get_auth_role() = 'super_admin');

DROP POLICY IF EXISTS "Admins can update their assigned facility" ON public.facilities;
CREATE POLICY "Admins can update their assigned facility"
    ON public.facilities FOR UPDATE
    TO authenticated
    USING (public.is_facility_admin(id))
    WITH CHECK (public.is_facility_admin(id));

DROP POLICY IF EXISTS "Super admins can delete facilities" ON public.facilities;
CREATE POLICY "Super admins can delete facilities"
    ON public.facilities FOR DELETE
    TO authenticated
    USING (public.get_auth_role() = 'super_admin');

-- 3. SERVICES POLICIES
-- Separate permissive SELECT policies: Public users read active services without executing admin helpers
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
    ON public.services FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all services for their facility" ON public.services;
CREATE POLICY "Admins can view all services for their facility"
    ON public.services FOR SELECT
    TO authenticated
    USING (public.is_facility_admin(facility_id));

DROP POLICY IF EXISTS "Admins can insert services for their facility" ON public.services;
CREATE POLICY "Admins can insert services for their facility"
    ON public.services FOR INSERT
    TO authenticated
    WITH CHECK (public.is_facility_admin(facility_id));

DROP POLICY IF EXISTS "Admins can update services for their facility" ON public.services;
CREATE POLICY "Admins can update services for their facility"
    ON public.services FOR UPDATE
    TO authenticated
    USING (public.is_facility_admin(facility_id))
    WITH CHECK (public.is_facility_admin(facility_id));

DROP POLICY IF EXISTS "Admins can delete services for their facility" ON public.services;
CREATE POLICY "Admins can delete services for their facility"
    ON public.services FOR DELETE
    TO authenticated
    USING (public.is_facility_admin(facility_id));

-- 4. COUNTERS POLICIES
DROP POLICY IF EXISTS "Public can view counters for queue estimation" ON public.counters;
CREATE POLICY "Public can view counters for queue estimation"
    ON public.counters FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can insert counters for their facility" ON public.counters;
CREATE POLICY "Admins can insert counters for their facility"
    ON public.counters FOR INSERT
    TO authenticated
    WITH CHECK (public.is_facility_admin(facility_id));

DROP POLICY IF EXISTS "Admins can delete counters for their facility" ON public.counters;
CREATE POLICY "Admins can delete counters for their facility"
    ON public.counters FOR DELETE
    TO authenticated
    USING (public.is_facility_admin(facility_id));

-- Direct client updates to counters disabled; state transitions happen strictly via authorized atomic RPCs
DROP POLICY IF EXISTS "Admins can update counters for their facility" ON public.counters;

-- 5. FACILITY DAILY SEQUENCES (Internal tracking)
DROP POLICY IF EXISTS "Admins can view sequences" ON public.facility_daily_sequences;
CREATE POLICY "Admins can view sequences"
    ON public.facility_daily_sequences FOR SELECT
    TO authenticated
    USING (public.is_facility_admin(facility_id));

-- 6. QUEUE TOKENS POLICIES (STRICT PII PRIVACY)
-- Zero public access to queue_tokens table directly!
-- Aggregated metrics are fetched via get_public_queue_metrics RPC.
DROP POLICY IF EXISTS "Citizens can view their own tokens" ON public.queue_tokens;
CREATE POLICY "Citizens can view their own tokens"
    ON public.queue_tokens FOR SELECT
    TO authenticated
    USING (
        citizen_id = auth.uid() 
        OR public.is_facility_admin(facility_id)
    );

-- Direct client insert/update/delete disabled; handled exclusively via atomic RPC procedures
DROP POLICY IF EXISTS "Citizens can insert their own token" ON public.queue_tokens;
DROP POLICY IF EXISTS "Citizens can cancel their own pending token" ON public.queue_tokens;
DROP POLICY IF EXISTS "Facility admins can update tokens for their facility" ON public.queue_tokens;
DROP POLICY IF EXISTS "Facility admins can delete tokens for their facility" ON public.queue_tokens;

-- 7. QUEUE EVENTS POLICIES
DROP POLICY IF EXISTS "Admins can view events for their facility" ON public.queue_events;
CREATE POLICY "Admins can view events for their facility"
    ON public.queue_events FOR SELECT
    TO authenticated
    USING (public.is_facility_admin(facility_id));

-- 8. NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can only view their own notifications" ON public.notifications;
CREATE POLICY "Users can only view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can mark their own notifications as read" ON public.notifications;
CREATE POLICY "Users can mark their own notifications as read"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ====================================================================
-- SECURE ATOMIC STORED PROCEDURES (SECURITY DEFINER WITH FIXED search_path)
-- ====================================================================

-- 1. Procedure: Book Virtual Token
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
    v_category facility_category;
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

    -- 4. Validate facility exists and is active
    SELECT category INTO v_category 
    FROM public.facilities 
    WHERE id = p_facility_id AND is_active = true;
    
    IF v_category IS NULL THEN
        RAISE EXCEPTION 'FacilityNotFound: The requested facility does not exist or is currently inactive.';
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

    -- 7. Prefix determination from facility category
    v_prefix := CASE v_category
        WHEN 'Hospitals' THEN 'H'
        WHEN 'Government' THEN 'G'
        WHEN 'Banks' THEN 'B'
        WHEN 'Colleges' THEN 'U'
        WHEN 'Service Centers' THEN 'M'
        ELSE 'Q'
    END;

    -- 8. Concurrency-Safe Monotonic Daily Sequence Generation
    -- PostgreSQL row-locks facility_daily_sequences via ON CONFLICT DO UPDATE
    INSERT INTO public.facility_daily_sequences (facility_id, sequence_date, last_sequence)
    VALUES (p_facility_id, CURRENT_DATE, 1)
    ON CONFLICT (facility_id, sequence_date)
    DO UPDATE SET last_sequence = public.facility_daily_sequences.last_sequence + 1
    RETURNING last_sequence INTO v_token_count;

    v_token_number := v_prefix || '-' || LPAD(v_token_count::TEXT, 3, '0');

    -- 9. Insert queue token (token_date populated for immutable uniqueness)
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
        'Your virtual queue position has been confirmed at ' || (SELECT name FROM public.facilities WHERE id = p_facility_id),
        'token_booked'
    );

    RETURN to_jsonb(v_new_token);
END;
$$;

-- 2. Procedure: Call Next Token (Concurrency-Safe with Counter Status Lock)
CREATE OR REPLACE FUNCTION public.call_next_token(p_counter_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_counter public.counters%ROWTYPE;
    v_token public.queue_tokens%ROWTYPE;
BEGIN
    -- 1. Require authentication
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated: Must be signed in.';
    END IF;

    -- 2. Lock counter row and verify it exists
    SELECT * INTO v_counter 
    FROM public.counters 
    WHERE id = p_counter_id 
    FOR UPDATE;

    IF v_counter.id IS NULL THEN
        RAISE EXCEPTION 'CounterNotFound: Counter does not exist.';
    END IF;

    -- 3. Verify caller has admin permission for this facility
    IF NOT public.is_facility_admin(v_counter.facility_id) THEN
        RAISE EXCEPTION 'Unauthorized: Caller is not an authorized administrator for this facility.';
    END IF;

    -- 4. Check counter status: Counter must be 'active' to call next
    IF v_counter.status <> 'active' THEN
        RAISE EXCEPTION 'CounterNotAvailable: Counter is currently % (must be "active" to call next).', v_counter.status;
    END IF;

    -- 5. Select next waiting token using FOR UPDATE SKIP LOCKED
    SELECT * INTO v_token
    FROM public.queue_tokens
    WHERE facility_id = v_counter.facility_id
      AND token_date = CURRENT_DATE
      AND status = 'waiting'
      AND (
          cardinality(v_counter.supported_service_ids) = 0 
          OR service_id = ANY(v_counter.supported_service_ids)
      )
    ORDER BY 
        CASE priority 
            WHEN 'emergency' THEN 1 
            WHEN 'senior' THEN 2 
            ELSE 3 
        END ASC,
        created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF v_token.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'No waiting citizens in queue for this counter.');
    END IF;

    -- 6. Update token status
    UPDATE public.queue_tokens
    SET status = 'called',
        counter_id = p_counter_id,
        called_at = timezone('utc'::text, now())
    WHERE id = v_token.id
    RETURNING * INTO v_token;

    -- 7. Update counter status to busy
    UPDATE public.counters
    SET status = 'busy',
        current_token_id = v_token.id,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_counter_id;

    -- 8. Record audit event
    INSERT INTO public.queue_events (
        token_id,
        facility_id,
        counter_id,
        event_type,
        actor_id,
        metadata
    ) VALUES (
        v_token.id,
        v_counter.facility_id,
        p_counter_id,
        'token_called',
        v_admin_id,
        jsonb_build_object('counter_name', v_counter.name, 'token_number', v_token.token_number)
    );

    -- 9. Trigger Notification to Citizen
    IF v_token.citizen_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            token_id,
            title,
            message,
            type
        ) VALUES (
            v_token.citizen_id,
            v_token.id,
            'Token Called: #' || v_token.token_number,
            'Please proceed immediately to ' || v_counter.name || ' for service.',
            'token_called'
        );
    END IF;

    RETURN to_jsonb(v_token);
END;
$$;

-- 3. Procedure: Start Service (Strict Authorization & State Transition)
CREATE OR REPLACE FUNCTION public.start_token_service(p_token_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_token public.queue_tokens%ROWTYPE;
BEGIN
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated: Must be signed in.';
    END IF;

    SELECT * INTO v_token 
    FROM public.queue_tokens 
    WHERE id = p_token_id 
    FOR UPDATE;

    IF v_token.id IS NULL THEN
        RAISE EXCEPTION 'TokenNotFound: Token not found.';
    END IF;

    -- Verify facility admin ownership
    IF NOT public.is_facility_admin(v_token.facility_id) THEN
        RAISE EXCEPTION 'Unauthorized: Caller is not an authorized administrator for this facility.';
    END IF;

    -- Validate status transition: Only 'called' tokens can transition to 'in_service'
    IF v_token.status <> 'called' THEN
        RAISE EXCEPTION 'InvalidStateTransition: Token must be in "called" status to start service (current status: %).', v_token.status;
    END IF;

    UPDATE public.queue_tokens
    SET status = 'in_service',
        service_started_at = timezone('utc'::text, now())
    WHERE id = p_token_id
    RETURNING * INTO v_token;

    INSERT INTO public.queue_events (
        token_id,
        facility_id,
        counter_id,
        event_type,
        actor_id
    ) VALUES (
        v_token.id,
        v_token.facility_id,
        v_token.counter_id,
        'service_started',
        v_admin_id
    );

    RETURN to_jsonb(v_token);
END;
$$;

-- 4. Procedure: Complete Service (Strict Authorization & Counter Release)
CREATE OR REPLACE FUNCTION public.complete_token_service(p_token_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_token public.queue_tokens%ROWTYPE;
BEGIN
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated: Must be signed in.';
    END IF;

    SELECT * INTO v_token 
    FROM public.queue_tokens 
    WHERE id = p_token_id 
    FOR UPDATE;

    IF v_token.id IS NULL THEN
        RAISE EXCEPTION 'TokenNotFound: Token not found.';
    END IF;

    -- Verify facility admin ownership
    IF NOT public.is_facility_admin(v_token.facility_id) THEN
        RAISE EXCEPTION 'Unauthorized: Caller is not an authorized administrator for this facility.';
    END IF;

    -- Validate status transition: Only 'in_service' or 'called' can be completed
    IF v_token.status NOT IN ('in_service', 'called') THEN
        RAISE EXCEPTION 'InvalidStateTransition: Token must be in "in_service" or "called" status to complete (current status: %).', v_token.status;
    END IF;

    UPDATE public.queue_tokens
    SET status = 'completed',
        completed_at = timezone('utc'::text, now())
    WHERE id = p_token_id
    RETURNING * INTO v_token;

    -- Free the counter back to active
    IF v_token.counter_id IS NOT NULL THEN
        UPDATE public.counters
        SET status = 'active',
            current_token_id = NULL,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_token.counter_id;
    END IF;

    INSERT INTO public.queue_events (
        token_id,
        facility_id,
        counter_id,
        event_type,
        actor_id
    ) VALUES (
        v_token.id,
        v_token.facility_id,
        v_token.counter_id,
        'token_completed',
        v_admin_id
    );

    IF v_token.citizen_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            token_id,
            title,
            message,
            type
        ) VALUES (
            v_token.citizen_id,
            v_token.id,
            'Service Completed',
            'Your appointment for token #' || v_token.token_number || ' is now completed. Thank you for using QueueLess AI!',
            'status_update'
        );
    END IF;

    RETURN to_jsonb(v_token);
END;
$$;

-- 5. Procedure: Cancel Queue Token (NULL-Safe Permission & Eligible State Check)
CREATE OR REPLACE FUNCTION public.cancel_queue_token(
    p_token_id UUID, 
    p_reason TEXT DEFAULT 'Cancelled by citizen'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actor_id UUID := auth.uid();
    v_token public.queue_tokens%ROWTYPE;
BEGIN
    IF v_actor_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated: Must be signed in to cancel a token.';
    END IF;

    SELECT * INTO v_token 
    FROM public.queue_tokens 
    WHERE id = p_token_id 
    FOR UPDATE;

    IF v_token.id IS NULL THEN
        RAISE EXCEPTION 'TokenNotFound: Token not found.';
    END IF;

    -- Enforce eligible cancellation states
    IF v_token.status NOT IN ('waiting', 'called') THEN
        RAISE EXCEPTION 'InvalidState: Only waiting or called tokens can be cancelled (current status: %).', v_token.status;
    END IF;

    -- NULL-Safe Permission Check:
    -- Caller must be the citizen owner OR an authorized facility admin
    IF (v_token.citizen_id IS DISTINCT FROM v_actor_id) THEN
        IF NOT public.is_facility_admin(v_token.facility_id) THEN
            RAISE EXCEPTION 'Unauthorized: You do not have permission to cancel this token.';
        END IF;
    END IF;

    UPDATE public.queue_tokens
    SET status = 'cancelled',
        cancelled_at = timezone('utc'::text, now()),
        cancellation_reason = COALESCE(p_reason, 'Cancelled')
    WHERE id = p_token_id
    RETURNING * INTO v_token;

    -- If counter was assigned, release counter back to active
    IF v_token.counter_id IS NOT NULL THEN
        UPDATE public.counters
        SET status = 'active',
            current_token_id = NULL,
            updated_at = timezone('utc'::text, now())
        WHERE id = v_token.counter_id;
    END IF;

    INSERT INTO public.queue_events (
        token_id,
        facility_id,
        counter_id,
        event_type,
        actor_id,
        metadata
    ) VALUES (
        v_token.id,
        v_token.facility_id,
        v_token.counter_id,
        'token_cancelled',
        v_actor_id,
        jsonb_build_object('reason', p_reason)
    );

    RETURN to_jsonb(v_token);
END;
$$;

-- 6. Procedure: Update Counter Status (Admin Ownership Validated)
CREATE OR REPLACE FUNCTION public.update_counter_status(
    p_counter_id UUID, 
    p_status counter_status
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_admin_id UUID := auth.uid();
    v_counter public.counters%ROWTYPE;
BEGIN
    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated: Must be signed in.';
    END IF;

    SELECT * INTO v_counter 
    FROM public.counters 
    WHERE id = p_counter_id 
    FOR UPDATE;

    IF v_counter.id IS NULL THEN
        RAISE EXCEPTION 'CounterNotFound: Counter does not exist.';
    END IF;

    IF NOT public.is_facility_admin(v_counter.facility_id) THEN
        RAISE EXCEPTION 'Unauthorized: Caller is not an authorized administrator for this facility.';
    END IF;

    -- Prevent changing a busy counter to active/offline/break while it has a current_token_id
    IF v_counter.status = 'busy' AND v_counter.current_token_id IS NOT NULL AND p_status <> 'busy' THEN
        RAISE EXCEPTION 'CounterBusyWithToken: Cannot change status of a busy counter while a token is in service (token ID: %). Complete or cancel the token first via proper workflow.', v_counter.current_token_id;
    END IF;

    -- Prevent setting status to 'busy' manually without an assigned token
    IF p_status = 'busy' AND v_counter.current_token_id IS NULL THEN
        RAISE EXCEPTION 'InvalidStatusTransition: Counter status cannot be set to "busy" manually without an active token. Use call_next_token() instead.';
    END IF;

    UPDATE public.counters
    SET status = p_status,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_counter_id
    RETURNING * INTO v_counter;

    INSERT INTO public.queue_events (
        facility_id,
        counter_id,
        event_type,
        actor_id,
        metadata
    ) VALUES (
        v_counter.facility_id,
        p_counter_id,
        'counter_status_changed',
        v_admin_id,
        jsonb_build_object('new_status', p_status)
    );

    RETURN to_jsonb(v_counter);
END;
$$;

-- 7. Public Queue Metrics RPC (Anonymized Aggregate Telemetry Only — Zero PII)
CREATE OR REPLACE FUNCTION public.get_public_queue_metrics(
    p_facility_id UUID,
    p_service_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_waiting_count INTEGER;
    v_active_counters_count INTEGER;
    v_currently_serving TEXT[];
    v_avg_service_mins INTEGER;
BEGIN
    -- 1. Count waiting citizens for today
    SELECT COUNT(*) INTO v_waiting_count
    FROM public.queue_tokens
    WHERE facility_id = p_facility_id
      AND token_date = CURRENT_DATE
      AND status = 'waiting'
      AND (p_service_id IS NULL OR service_id = p_service_id);

    -- 2. Count active/busy counters
    SELECT COUNT(*) INTO v_active_counters_count
    FROM public.counters
    WHERE facility_id = p_facility_id
      AND status IN ('active', 'busy');

    -- 3. Currently serving token numbers (no visitor names, phones, or citizen IDs)
    SELECT ARRAY_AGG(token_number) INTO v_currently_serving
    FROM public.queue_tokens
    WHERE facility_id = p_facility_id
      AND token_date = CURRENT_DATE
      AND status IN ('called', 'in_service')
      AND (p_service_id IS NULL OR service_id = p_service_id);

    -- 4. Get service average minutes
    IF p_service_id IS NOT NULL THEN
        SELECT average_service_minutes INTO v_avg_service_mins
        FROM public.services
        WHERE id = p_service_id;
    ELSE
        SELECT COALESCE(AVG(average_service_minutes)::INTEGER, 15) INTO v_avg_service_mins
        FROM public.services
        WHERE facility_id = p_facility_id;
    END IF;

    RETURN jsonb_build_object(
        'facility_id', p_facility_id,
        'waiting_count', v_waiting_count,
        'active_counters_count', v_active_counters_count,
        'currently_serving', COALESCE(v_currently_serving, '{}'::TEXT[]),
        'average_service_minutes', COALESCE(v_avg_service_mins, 15),
        'estimated_wait_minutes', GREATEST(0, ROUND((v_waiting_count * COALESCE(v_avg_service_mins, 15))::NUMERIC / GREATEST(1, v_active_counters_count)))
    );
END;
$$;

-- ====================================================================
-- SPECIFIC FUNCTION EXECUTION PRIVILEGES (Do not revoke system functions)
-- ====================================================================

-- Explicitly revoke execute from PUBLIC on QueueLess AI functions only (specifying signatures)
REVOKE EXECUTE ON FUNCTION public.get_auth_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_auth_facility_id() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_facility_admin(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_profile_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_notification_content() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.book_queue_token(UUID, UUID, TEXT, TEXT, token_priority) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.call_next_token(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.start_token_service(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.complete_token_service(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cancel_queue_token(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_counter_status(UUID, counter_status) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_public_queue_metrics(UUID, UUID) FROM PUBLIC;

-- Minimal execution grants
GRANT EXECUTE ON FUNCTION public.get_public_queue_metrics(UUID, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_queue_token(UUID, UUID, TEXT, TEXT, token_priority) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_queue_token(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.call_next_token(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_token_service(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_token_service(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_counter_status(UUID, counter_status) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_auth_facility_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_facility_admin(UUID) TO authenticated;

-- ====================================================================
-- REALTIME PUBLICATION SETUP (Safe Idempotency)
-- ====================================================================
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'queue_tokens'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.queue_tokens;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'counters'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.counters;
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
        END IF;
    END IF;
END $$;
