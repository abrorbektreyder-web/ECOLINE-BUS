-- Create Trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bus_type TEXT NOT NULL, -- 'Ekonom', 'Komfort', 'VIP'
    available_seats INTEGER NOT NULL,
    features TEXT[] DEFAULT '{}', -- ['Wi-Fi', 'USB', 'TV']
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id),
    user_id UUID, -- Placeholder for auth
    passenger_name TEXT NOT NULL,
    passport_id TEXT NOT NULL,
    seat_number INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL, -- 'deposit', 'withdrawal'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert dummy data for Trips
INSERT INTO public.trips (from_city, to_city, departure_time, arrival_time, price, bus_type, available_seats, features)
VALUES 
('Toshkent', 'Samarqand', now() + interval '1 day', now() + interval '1 day 4 hours', 45000.00, 'Komfort', 45, ARRAY['Wi-Fi', 'USB', 'Salqin ichimliklar']),
('Samarqand', 'Buxoro', now() + interval '2 days', now() + interval '2 days 3 hours', 35000.00, 'VIP', 30, ARRAY['Wi-Fi', 'USB', 'TV', 'Kofe']),
('Toshkent', 'Guanjou', now() + interval '5 days', now() + interval '8 days', 1200000.00, 'VIP', 28, ARRAY['Wi-Fi', 'USB', 'TV', 'Yotoq joy']);
