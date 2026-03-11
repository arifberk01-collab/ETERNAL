-- RUN THIS SCRIPT IN THE SUPABASE SQL EDITOR

-- 1. Update `events` table
ALTER TABLE events ADD COLUMN IF NOT EXISTS "type" text; -- 'meeting' | 'anniversary'
ALTER TABLE events ADD COLUMN IF NOT EXISTS "location" text;

-- 2. Update `memories` table
ALTER TABLE memories ADD COLUMN IF NOT EXISTS "images" text[];

-- Note: Using double quotes for camelCase or reserved keywords so Postgres preserves them properly.
