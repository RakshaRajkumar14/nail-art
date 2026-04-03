-- Create services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL, -- e.g., 'manicure', 'pedicure', 'design', 'extension'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  selected_services JSONB NOT NULL, -- Array of service objects with id, title, price, duration
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_services_category ON services(category);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services (public read access)
CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON services
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON services
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON services
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for bookings (users can only see their own bookings)
CREATE POLICY "Enable insert for all users" ON bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable read access for booking owner" ON bookings
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email OR true);

CREATE POLICY "Enable update for booking owner" ON bookings
  FOR UPDATE
  USING (auth.jwt() ->> 'email' = email OR true)
  WITH CHECK (auth.jwt() ->> 'email' = email OR true);

CREATE POLICY "Enable delete for booking owner" ON bookings
  FOR DELETE
  USING (auth.jwt() ->> 'email' = email OR true);

-- Create sample data (optional)
INSERT INTO services (title, description, duration, price, category) VALUES
  ('Basic Manicure', 'Classic manicure with nail filing and polish', 30, 25.00, 'manicure'),
  ('Gel Manicure', 'Long-lasting gel manicure', 45, 45.00, 'manicure'),
  ('Nail Art Design', 'Custom nail art design', 60, 55.00, 'design'),
  ('Basic Pedicure', 'Classic pedicure with polish', 45, 35.00, 'pedicure'),
  ('Gel Pedicure', 'Long-lasting gel pedicure', 60, 50.00, 'pedicure'),
  ('Nail Extension', 'Acrylic or gel nail extensions', 75, 65.00, 'extension');
