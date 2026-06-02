1. Users & Authentication
SQL
CREATE TYPE user_role AS ENUM ('parent', 'school_admin', 'platform_admin', 'agent');
CREATE TYPE oauth_provider AS ENUM ('google', 'apple');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL, 
    role user_role NOT NULL,
    oauth_provider oauth_provider NULL,
    oauth_id VARCHAR(255) NULL,
    full_name VARCHAR(255) NULL, 
    phone VARCHAR(20) NULL,
    county VARCHAR(100) NULL,
    town VARCHAR(100) NULL,
    avatar_url VARCHAR(512) NULL,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
2. Schools & Profiles (Staff Absorbed)
SQL
CREATE TYPE school_type AS ENUM ('ecd', 'primary', 'secondary', 'tvet', 'university');
CREATE TYPE gender_type AS ENUM ('mixed', 'boys', 'girls');
CREATE TYPE boarding_type AS ENUM ('day', 'boarding', 'both');
CREATE TYPE curriculum_type AS ENUM ('CBC', 'IGCSE', 'A-Level', 'TVET');

CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    county VARCHAR(100) NOT NULL,
    town VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    type school_type NOT NULL,
    gender gender_type NOT NULL,
    boarding_options boarding_type NOT NULL,
    curricula curriculum_type[] NOT NULL, 
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    profile_stale_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE school_profiles (
    school_id UUID PRIMARY KEY REFERENCES schools(id) ON DELETE CASCADE,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    moe_accredited BOOLEAN DEFAULT false,
    founded_year SMALLINT NOT NULL,
    head_teacher VARCHAR(255) NOT NULL,
    religion VARCHAR(100) NULL,
    motto VARCHAR(255) NULL,
    description TEXT NULL,
    teacher_student_ratio VARCHAR(10) NULL, 
    percent_qualified_teachers DECIMAL(5,2) NULL,
    facilities JSONB DEFAULT '[]'::jsonb, 
    kcpe_scores JSONB DEFAULT '[]'::jsonb, 
    kcse_scores JSONB DEFAULT '[]'::jsonb, 
    media JSONB DEFAULT '[]'::jsonb, -- [{url, type, category, caption, sort_order}]
    -- Absorbed school_staff table
    staff JSONB DEFAULT '[]'::jsonb, -- [{user_id, role (owner/admin/staff), created_at}]
    updated_at TIMESTAMPTZ DEFAULT now()
);
3. Finance & Logistics
SQL
CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_level VARCHAR(50) NOT NULL, 
    academic_year SMALLINT NOT NULL,
    term_tuition INTEGER NOT NULL, 
    boarding_fee INTEGER NULL,
    meal_fee INTEGER NULL,
    activity_fee INTEGER NULL,
    admission_fee INTEGER NOT NULL DEFAULT 0,
    uniform_estimate INTEGER NULL,
    payment_methods JSONB DEFAULT '["mpesa", "bank"]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transport_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    route_name VARCHAR(255) NOT NULL, 
    pickup_areas JSONB NOT NULL, 
    monthly_cost_kes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);
4. Direct Communication
SQL
CREATE TABLE message_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NULL,
    is_enquiry BOOLEAN DEFAULT false, 
    initial_enquiry_metadata JSONB NULL, 
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (school_id, parent_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE visit_type AS ENUM ('physical', 'virtual');
CREATE TYPE visit_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE visit_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    visit_type visit_type NOT NULL,
    proposed_at TIMESTAMPTZ NOT NULL,
    confirmed_at TIMESTAMPTZ NULL,
    meeting_link VARCHAR(512) NULL, 
    status visit_status NOT NULL DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
5. Unified Applications System
SQL
CREATE TABLE admission_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_level VARCHAR(50) NULL, 
    academic_year SMALLINT NOT NULL,
    fields JSONB NOT NULL, 
    is_active BOOLEAN DEFAULT true,
    opens_at TIMESTAMPTZ NULL,
    closes_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE application_type AS ENUM ('admission', 'enrolment_verification');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'reviewing', 'accepted', 'rejected', 'waitlisted');

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE, -- Kept to support verification type easily
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admission_form_id UUID NULL REFERENCES admission_forms(id) ON DELETE RESTRICT, -- Nullable for verification types
    type application_type NOT NULL DEFAULT 'admission',
    student_name VARCHAR(255) NOT NULL,
    student_dob DATE NULL, -- Nullable for verification types
    grade_applying_for VARCHAR(50) NOT NULL,
    academic_year SMALLINT NULL,
    form_data JSONB DEFAULT '{}'::jsonb, 
    -- Replaces document_vault table: [{name, type, file_url, file_size_kb, mime_type}]
    documents JSONB DEFAULT '[]'::jsonb, 
    status application_status NOT NULL DEFAULT 'draft',
    admin_notes TEXT NULL,
    rejection_reason TEXT NULL,
    reviewed_by UUID NULL REFERENCES users(id) ON SET NULL,
    submitted_at TIMESTAMPTZ NULL,
    reviewed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
6. Social, Community & Content
SQL
CREATE TABLE reviews (
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    author_type VARCHAR(20) NOT NULL, 
    rating_academics SMALLINT CHECK (rating_academics BETWEEN 1 AND 5),
    rating_safety SMALLINT CHECK (rating_safety BETWEEN 1 AND 5),
    rating_facilities SMALLINT CHECK (rating_facilities BETWEEN 1 AND 5),
    rating_teachers SMALLINT CHECK (rating_teachers BETWEEN 1 AND 5),
    rating_value SMALLINT CHECK (rating_value BETWEEN 1 AND 5),
    rating_communication SMALLINT CHECK (rating_communication BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false, -- Set true if matching 'enrolment_verification' application status is 'accepted'
    is_flagged BOOLEAN DEFAULT false,
    flag_reason VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published', 
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (school_id, author_id)
);

CREATE TABLE review_responses (
    school_id UUID,
    author_id UUID,
    responder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (school_id, author_id),
    FOREIGN KEY (school_id, author_id) REFERENCES reviews(school_id, author_id) ON DELETE CASCADE
);

CREATE TABLE qa_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_post_id UUID NULL REFERENCES qa_posts(id) ON DELETE CASCADE, 
    body TEXT NOT NULL,
    is_accepted_answer BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, 
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
7. Monetization & Utilities
SQL
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL,
    amount_kes INTEGER NOT NULL,
    payment_provider VARCHAR(50) NOT NULL, 
    provider_subscription_id VARCHAR(255) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID NULL REFERENCES subscriptions(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- ad_slots references removed from here
    amount_kes INTEGER NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_tx_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE shortlists (
    parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (parent_id, school_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body VARCHAR(512) NOT NULL,
    reference_type VARCHAR(50) NOT NULL, 
    reference_id UUID NOT NULL,          
    read_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);