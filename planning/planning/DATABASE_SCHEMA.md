# UpNext Database Schema

## Table: Users
* `id`: Unique Identifier (UUID)
* `email`: String (Unique)
* `role`: Enum (Entertainer, Patron, Club_Manager)
* `subscription_status`: Boolean (Active/Inactive)
* `stripe_customer_id`: String (For payment processing)

## Table: Entertainer_Profiles
* `user_id`: Foreign Key (Link to Users)
* `stage_name`: String
* `bio`: Text
* `current_club_id`: Foreign Key (Link to Clubs)
* `status`: Enum (Off-duty, In-building, On-stage)
* `emergency_contact`: String (For Safety Suite)

## Table: Clubs
* `id`: Unique Identifier
* `name`: String
* `address`: String
* `coordinates`: Geography (Lat/Long for GPS check-ins)

## Table: Lineups (Real-time)
* `id`: Unique Identifier
* `club_id`: Foreign Key
* `entertainer_id`: Foreign Key
* `sort_order`: Integer (Who is "UpNext")
* `estimated_start_time`: Timestamp
