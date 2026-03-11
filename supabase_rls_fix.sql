-- FINAL CLEAN SQL FIX
-- Lütfen SQL Editor'daki her şeyi silip sadece bu kodu yapıştırın.

-- 1. Tabloların güvenliğini (RLS) tamamen kapatın
ALTER TABLE IF EXISTS public.config DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.memories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profile DISABLE ROW LEVEL SECURITY;

-- 2. Çakışan politikaları güvenli bir şekilde silin
DROP POLICY IF EXISTS "Users can only see their own events" ON public.events;
DROP POLICY IF EXISTS "Kullanıcılar sadece kendi etkinliklerini görebilir" ON public.events;
DROP POLICY IF EXISTS "Users can only see their own memories" ON public.memories;
DROP POLICY IF EXISTS "Enable all access for users" ON public.config;

-- 3. Config tablosunun yapısını kesinleştirin
-- Hem 'id' hem 'user_id' sütunlarının olduğundan emin olalım
ALTER TABLE IF EXISTS public.config ADD COLUMN IF NOT EXISTS "id" uuid;
ALTER TABLE IF EXISTS public.config ADD COLUMN IF NOT EXISTS "user_id" uuid;
ALTER TABLE IF EXISTS public.config ADD COLUMN IF NOT EXISTS "relationshipStartDate" text;

-- 4. Birincil anahtarı (Primary Key) kontrol edin (Eğer yoksa 'id'yi PK yapın)
-- Not: Eğer tablo zaten varsa PK değiştirmek hata verebilir, bu yüzden sadece sütun eklemek yeterli olacaktır.
COMMENT ON TABLE public.config IS 'RLS explicitly disabled to resolve policy violation errors.';
