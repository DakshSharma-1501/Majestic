-- Turf Booking System Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'owner')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- TURFS TABLE
-- ============================================
CREATE TABLE turfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for turfs
ALTER TABLE turfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view turfs"
  ON turfs FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert own turfs"
  ON turfs FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Owners can update own turfs"
  ON turfs FOR UPDATE
  USING (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Owners can delete own turfs"
  ON turfs FOR DELETE
  USING (
    auth.uid() = owner_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner')
  );

-- ============================================
-- SPORTS TABLE
-- ============================================
CREATE TABLE sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_per_slot DECIMAL(10, 2) NOT NULL,
  max_players INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for sports
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sports"
  ON sports FOR SELECT
  USING (true);

CREATE POLICY "Turf owners can insert sports"
  ON sports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM turfs 
      WHERE id = turf_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Turf owners can update sports"
  ON sports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM turfs 
      WHERE id = turf_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Turf owners can delete sports"
  ON sports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM turfs 
      WHERE id = turf_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- SLOTS TABLE
-- ============================================
CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- RLS Policies for slots
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view slots"
  ON slots FOR SELECT
  USING (true);

CREATE POLICY "Turf owners can insert slots"
  ON slots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sports s
      JOIN turfs t ON s.turf_id = t.id
      WHERE s.id = sport_id AND t.owner_id = auth.uid()
    )
  );

CREATE POLICY "Turf owners can update slots"
  ON slots FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sports s
      JOIN turfs t ON s.turf_id = t.id
      WHERE s.id = sport_id AND t.owner_id = auth.uid()
    )
  );

CREATE POLICY "Turf owners can delete slots"
  ON slots FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sports s
      JOIN turfs t ON s.turf_id = t.id
      WHERE s.id = sport_id AND t.owner_id = auth.uid()
    )
  );

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  players_count INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  booking_code TEXT UNIQUE,
  qr_code_data TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Turf owners can view bookings for their turfs"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM turfs 
      WHERE id = turf_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Customers can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'customer')
  );

CREATE POLICY "Turf owners can update bookings for their turfs"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM turfs 
      WHERE id = turf_id AND owner_id = auth.uid()
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_turfs_owner_id ON turfs(owner_id);
CREATE INDEX idx_sports_turf_id ON sports(turf_id);
CREATE INDEX idx_slots_sport_id ON slots(sport_id);
CREATE INDEX idx_slots_start_time ON slots(start_time);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_turf_id ON bookings(turf_id);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_code ON bookings(booking_code);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_turfs_updated_at
  BEFORE UPDATE ON turfs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sports_updated_at
  BEFORE UPDATE ON sports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slots_updated_at
  BEFORE UPDATE ON slots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO GENERATE BOOKING CODE
-- ============================================
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM bookings WHERE booking_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER TO AUTO-GENERATE BOOKING CODE
-- ============================================
CREATE OR REPLACE FUNCTION set_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND NEW.booking_code IS NULL THEN
    NEW.booking_code := generate_booking_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_code
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_code();

-- ============================================
-- FUNCTION TO UPDATE SLOT AVAILABILITY
-- ============================================
CREATE OR REPLACE FUNCTION update_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' THEN
    UPDATE slots SET is_available = false WHERE id = NEW.slot_id;
  ELSIF OLD.status = 'accepted' AND NEW.status = 'rejected' THEN
    UPDATE slots SET is_available = true WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_slot_availability
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_slot_availability();

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
