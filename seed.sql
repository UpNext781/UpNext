-- UpNext Test Data Seed

-- Insert a Test Club
INSERT INTO clubs (name, address, is_partner) 
VALUES ('The Emerald Lounge', '123 Nightlife Way, Phoenix, AZ', true);

-- Insert Test Users
INSERT INTO users (email, password_hash, role) 
VALUES ('performer1@example.com', 'hashed_pass_1', 'entertainer'),
       ('performer2@example.com', 'hashed_pass_2', 'entertainer');

-- Insert Entertainer Profiles
INSERT INTO entertainer_profiles (user_id, stage_name, bio, is_premium, current_status)
VALUES (1, 'Jade', 'Professional aerialist and dancer.', false, 'in-building'),
       (2, 'Stellar', 'VIP Host and Featured Entertainer.', true, 'on-stage');

-- Insert a Starting Lineup
INSERT INTO lineups (club_id, entertainer_id, sort_order)
VALUES (1, 2, 1), -- Stellar is first
       (1, 1, 2); -- Jade is second
