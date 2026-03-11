-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR

-- 1. Ensure `profile` table has all columns
ALTER TABLE profile ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS preferences jsonb;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "ringSize" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "coffeePreference" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "favoriteColor" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "favoriteFood" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "favoritePolitician" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "supportedParty" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "favoriteYDCharacter" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "favoriteTimePeriod" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "firstDateLocation" text;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS "importantNote" text;

-- 2. Ensure `events` table has all columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS "dateISO" text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS "iconType" text;

-- 3. Ensure `memories` table has all columns
ALTER TABLE memories ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE memories ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE memories ADD COLUMN IF NOT EXISTS "dateISO" text;
ALTER TABLE memories ADD COLUMN IF NOT EXISTS image text;

-- 4. Ensure `config` table has all columns
ALTER TABLE config ADD COLUMN IF NOT EXISTS "relationshipStartDate" text;

-- Note: Using double quotes for camelCase names so Postgres preserves the casing.
