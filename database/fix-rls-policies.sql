-- Fix Row Level Security Policies for Nail Art Booking System

-- ============================================
-- SERVICES TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "services_read" ON services;
DROP POLICY IF EXISTS "services_insert" ON services;
DROP POLICY IF EXISTS "services_update" ON services;
DROP POLICY IF EXISTS "services_delete" ON services;

-- Allow public read access to services
CREATE POLICY "services_read" ON services
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert services (for admin)
CREATE POLICY "services_insert" ON services
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update services (for admin)
CREATE POLICY "services_update" ON services
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete services (for admin)
CREATE POLICY "services_delete" ON services
  FOR DELETE
  USING (true);

-- ============================================
-- BOOKINGS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "bookings_read" ON bookings;
DROP POLICY IF EXISTS "bookings_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_update" ON bookings;
DROP POLICY IF EXISTS "bookings_delete" ON bookings;

-- Allow public read access to bookings
CREATE POLICY "bookings_read" ON bookings
  FOR SELECT
  USING (true);

-- Allow anyone to insert bookings (for customer booking)
CREATE POLICY "bookings_insert" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to update bookings (for admin)
CREATE POLICY "bookings_update" ON bookings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete bookings (for admin)
CREATE POLICY "bookings_delete" ON bookings
  FOR DELETE
  USING (true);

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Ensure RLS is enabled on both tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant permissions to authenticated users
GRANT ALL ON services TO authenticated;
GRANT ALL ON bookings TO authenticated;

-- Grant permissions to anonymous users (for public access)
GRANT SELECT ON services TO anon;
GRANT SELECT, INSERT ON bookings TO anon;

-- Success message
SELECT 'RLS policies updated successfully!' as message;
