-- UpNext Database Schema Initialization

-- 1. Users Table (Core Identity)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'entertainer', -- entertainer, patron, manager
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Entertainer Profiles (The "Enhanced" Data)
CREATE TABLE IF NOT EXISTS entertainer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stage_name VARCHAR(100) NOT NULL,
    bio TEXT,
    emergency_contact VARCHAR(255),
    is_premium BOOLEAN DEFAULT FALSE,
    current_status VARCHAR(50) DEFAULT 'off-duty' -- off-duty, in-building, on-stage
);

-- 3. Clubs Table
CREATE TABLE IF NOT EXISTS clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    is_partner BOOLEAN DEFAULT FALSE
);

-- 4. Lineups (The Real-Time Feed)
CREATE TABLE IF NOT EXISTS lineups (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id),
    entertainer_id INTEGER REFERENCES entertainer_profiles(id),
    sort_order INTEGER,
    estimated_start TIMESTAMP
);
