-- ============================================================
-- ECOLINE BUS — Real Uzbekistan Trip Routes Seed Data
-- Run this in Supabase SQL Editor
-- ============================================================

-- Make sure trips table exists with correct structure
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bus_type TEXT NOT NULL,
    available_seats INTEGER NOT NULL DEFAULT 30,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Clear old dummy data
DELETE FROM public.trips;

-- ============================================================
-- Seed: Real O'zbekiston shaharlararo reyslar (7 kunlik)
-- ============================================================

-- TOSHKENT → SAMARQAND (daily, 4-5 soat)
INSERT INTO public.trips (from_city, to_city, departure_time, arrival_time, price, bus_type, available_seats, features) VALUES
('Toshkent', 'Samarqand', NOW() + INTERVAL '0 days 1 hour', NOW() + INTERVAL '0 days 5 hours', 65000, 'Komfort', 42, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Samarqand', NOW() + INTERVAL '0 days 6 hours', NOW() + INTERVAL '0 days 10 hours', 75000, 'VIP', 28, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe', 'Reclining o''rindiq']),
('Toshkent', 'Samarqand', NOW() + INTERVAL '0 days 13 hours', NOW() + INTERVAL '0 days 17 hours', 55000, 'Ekonom', 48, ARRAY['Konditsioner']),
('Toshkent', 'Samarqand', NOW() + INTERVAL '1 day 2 hours', NOW() + INTERVAL '1 day 6 hours', 65000, 'Komfort', 36, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Samarqand', NOW() + INTERVAL '1 day 8 hours', NOW() + INTERVAL '1 day 12 hours 30 mins', 80000, 'VIP', 24, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe', 'Reclining o''rindiq', 'Yotoq joyi']),
('Toshkent', 'Samarqand', NOW() + INTERVAL '2 days 3 hours', NOW() + INTERVAL '2 days 7 hours', 65000, 'Komfort', 40, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Samarqand', NOW() + INTERVAL '3 days 7 hours', NOW() + INTERVAL '3 days 11 hours', 65000, 'Komfort', 38, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- SAMARQAND → TOSHKENT (daily)
('Samarqand', 'Toshkent', NOW() + INTERVAL '0 days 5 hours', NOW() + INTERVAL '0 days 9 hours', 65000, 'Komfort', 44, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Samarqand', 'Toshkent', NOW() + INTERVAL '0 days 15 hours', NOW() + INTERVAL '0 days 19 hours', 70000, 'Komfort', 32, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Samarqand', 'Toshkent', NOW() + INTERVAL '1 day 6 hours', NOW() + INTERVAL '1 day 10 hours 30 mins', 75000, 'VIP', 20, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),
('Samarqand', 'Toshkent', NOW() + INTERVAL '2 days 4 hours', NOW() + INTERVAL '2 days 8 hours', 65000, 'Komfort', 42, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- TOSHKENT → BUXORO (6-7 soat)
('Toshkent', 'Buxoro', NOW() + INTERVAL '0 days 2 hours', NOW() + INTERVAL '0 days 9 hours', 95000, 'VIP', 26, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Kofe', 'Konditsioner']),
('Toshkent', 'Buxoro', NOW() + INTERVAL '0 days 7 hours', NOW() + INTERVAL '0 days 13 hours', 75000, 'Komfort', 38, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Buxoro', NOW() + INTERVAL '1 day 3 hours', NOW() + INTERVAL '1 day 10 hours', 95000, 'VIP', 18, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Kofe']),
('Toshkent', 'Buxoro', NOW() + INTERVAL '2 days 5 hours', NOW() + INTERVAL '2 days 12 hours', 75000, 'Komfort', 40, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Buxoro', NOW() + INTERVAL '3 days 2 hours', NOW() + INTERVAL '3 days 9 hours', 85000, 'Komfort', 34, ARRAY['Wi-Fi', 'USB', 'TV', 'Konditsioner']),

-- BUXORO → TOSHKENT
('Buxoro', 'Toshkent', NOW() + INTERVAL '0 days 4 hours', NOW() + INTERVAL '0 days 11 hours', 95000, 'VIP', 22, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Kofe']),
('Buxoro', 'Toshkent', NOW() + INTERVAL '1 day 3 hours', NOW() + INTERVAL '1 day 10 hours', 75000, 'Komfort', 40, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Buxoro', 'Toshkent', NOW() + INTERVAL '2 days 6 hours', NOW() + INTERVAL '2 days 13 hours', 75000, 'Komfort', 36, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- TOSHKENT → NAMANGAN (3-4 soat)
('Toshkent', 'Namangan', NOW() + INTERVAL '0 days 3 hours', NOW() + INTERVAL '0 days 6 hours 30 mins', 45000, 'Komfort', 48, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Namangan', NOW() + INTERVAL '0 days 10 hours', NOW() + INTERVAL '0 days 13 hours 30 mins', 50000, 'Komfort', 44, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Namangan', NOW() + INTERVAL '1 day 5 hours', NOW() + INTERVAL '1 day 8 hours 30 mins', 55000, 'VIP', 26, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),
('Toshkent', 'Namangan', NOW() + INTERVAL '2 days 4 hours', NOW() + INTERVAL '2 days 7 hours 30 mins', 45000, 'Komfort', 42, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- NAMANGAN → TOSHKENT
('Namangan', 'Toshkent', NOW() + INTERVAL '0 days 6 hours', NOW() + INTERVAL '0 days 9 hours 30 mins', 45000, 'Komfort', 46, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Namangan', 'Toshkent', NOW() + INTERVAL '1 day 4 hours', NOW() + INTERVAL '1 day 7 hours 30 mins', 55000, 'VIP', 24, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),
('Namangan', 'Toshkent', NOW() + INTERVAL '2 days 7 hours', NOW() + INTERVAL '2 days 10 hours 30 mins', 45000, 'Komfort', 40, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- TOSHKENT → ANDIJON (3-4 soat)
('Toshkent', 'Andijon', NOW() + INTERVAL '0 days 2 hours 30 mins', NOW() + INTERVAL '0 days 6 hours', 50000, 'Komfort', 44, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Andijon', NOW() + INTERVAL '0 days 9 hours', NOW() + INTERVAL '0 days 12 hours 30 mins', 55000, 'Komfort', 40, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Andijon', NOW() + INTERVAL '1 day 4 hours', NOW() + INTERVAL '1 day 8 hours', 65000, 'VIP', 22, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe', 'Reclining o''rindiq']),
('Toshkent', 'Andijon', NOW() + INTERVAL '2 days 3 hours', NOW() + INTERVAL '2 days 6 hours 30 mins', 50000, 'Komfort', 42, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- TOSHKENT → FARG'ONA (3.5 soat)
('Toshkent', 'Farg''ona', NOW() + INTERVAL '0 days 4 hours', NOW() + INTERVAL '0 days 7 hours 30 mins', 48000, 'Komfort', 46, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Farg''ona', NOW() + INTERVAL '1 day 6 hours', NOW() + INTERVAL '1 day 9 hours 30 mins', 58000, 'VIP', 24, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),
('Toshkent', 'Farg''ona', NOW() + INTERVAL '2 days 5 hours', NOW() + INTERVAL '2 days 8 hours 30 mins', 48000, 'Komfort', 44, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- TOSHKENT → QARSHI (5 soat)
('Toshkent', 'Qarshi', NOW() + INTERVAL '0 days 3 hours', NOW() + INTERVAL '0 days 8 hours', 70000, 'Komfort', 38, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Qarshi', NOW() + INTERVAL '1 day 5 hours', NOW() + INTERVAL '1 day 10 hours', 80000, 'VIP', 20, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe', 'Reclining o''rindiq']),
('Toshkent', 'Qarshi', NOW() + INTERVAL '2 days 4 hours', NOW() + INTERVAL '2 days 9 hours', 70000, 'Komfort', 36, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- SAMARQAND → BUXORO (3 soat)
('Samarqand', 'Buxoro', NOW() + INTERVAL '0 days 4 hours', NOW() + INTERVAL '0 days 7 hours', 45000, 'Komfort', 42, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Samarqand', 'Buxoro', NOW() + INTERVAL '1 day 3 hours', NOW() + INTERVAL '1 day 6 hours', 55000, 'VIP', 24, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),
('Samarqand', 'Buxoro', NOW() + INTERVAL '2 days 5 hours', NOW() + INTERVAL '2 days 8 hours', 45000, 'Komfort', 40, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),

-- BUXORO → SAMARQAND
('Buxoro', 'Samarqand', NOW() + INTERVAL '0 days 6 hours', NOW() + INTERVAL '0 days 9 hours', 45000, 'Komfort', 44, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Buxoro', 'Samarqand', NOW() + INTERVAL '1 day 5 hours', NOW() + INTERVAL '1 day 8 hours', 55000, 'VIP', 22, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),

-- TOSHKENT → URGANCH (10-11 soat, Xorazm)
('Toshkent', 'Urganch', NOW() + INTERVAL '0 days 1 hour', NOW() + INTERVAL '0 days 11 hours', 120000, 'VIP', 18, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Kofe', 'Konditsioner']),
('Toshkent', 'Urganch', NOW() + INTERVAL '1 day 2 hours', NOW() + INTERVAL '1 day 12 hours', 100000, 'Komfort', 34, ARRAY['Wi-Fi', 'USB', 'Konditsioner']),
('Toshkent', 'Urganch', NOW() + INTERVAL '3 days 1 hour', NOW() + INTERVAL '3 days 11 hours', 120000, 'VIP', 16, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Kofe']),

-- TOSHKENT → MOSKVA (65 soat, International)
('Toshkent', 'Moskva', NOW() + INTERVAL '0 days 5 hours', NOW() + INTERVAL '2 days 18 hours', 1200000, 'International VIP', 45, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Issiq ovqat', 'Biotualet', 'Konditsioner']),
('Toshkent', 'Moskva', NOW() + INTERVAL '2 days 10 hours', NOW() + INTERVAL '5 days 1 hours', 1100000, 'International Comfort', 50, ARRAY['Wi-Fi', 'USB', 'TV', 'Biotualet', 'Konditsioner']),

-- MOSKVA → TOSHKENT
('Moskva', 'Toshkent', NOW() + INTERVAL '1 day 5 hours', NOW() + INTERVAL '4 days 1 hours', 1200000, 'International VIP', 40, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Biotualet']),

-- TOSHKENT → QOZON (Kazan)
('Toshkent', 'Qozon', NOW() + INTERVAL '1 day 4 hours', NOW() + INTERVAL '3 days 4 hours', 1000000, 'International VIP', 45, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Biotualet']),

-- TOSHKENT → GUANGZHOU (Guangzhou)
('Toshkent', 'Guangzhou', NOW() + INTERVAL '0 days 12 hours', NOW() + INTERVAL '4 days 12 hours', 2500000, 'International VIP', 30, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joyi', 'Issiq ovqat', 'Biotualet']);

-- Enable RLS policy for public read
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Allow public read (no auth needed for searching trips)
DROP POLICY IF EXISTS "Allow public read trips" ON public.trips;
CREATE POLICY "Allow public read trips" ON public.trips
    FOR SELECT USING (true);
