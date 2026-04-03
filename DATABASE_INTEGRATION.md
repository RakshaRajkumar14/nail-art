# Database Integration Guide for Raksha

This project uses Supabase/Postgres, and the current database source of truth is [database/schema.sql](database/schema.sql).

## Goal

Get the local app connected to a real Supabase database without guessing the schema, and make the API layer match the tables that already exist in the repo.

## 1. Create the Supabase project

1. Create a new Supabase project.
2. Open `Project Settings -> API`.
3. Copy these values:
   - `Project URL`
   - `anon public key`
   - `service_role key`
4. Add them to `.env.local`.

Recommended local variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ADMIN_SECRET=your_admin_password
ADMIN_EMAIL=admin@example.com

NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

The repo already includes a starter example in `.env.example`.

## 2. Apply the SQL schema

1. Open Supabase `SQL Editor`.
2. Paste the full contents of `database/schema.sql`.
3. Run the script.
4. Confirm these tables exist:
   - `services`
   - `bookings`

The schema also seeds some sample services.

## 3. Current schema in this repo

### `services`

Expected columns from `database/schema.sql`:

- `id`
- `title`
- `description`
- `duration`
- `price`
- `image_url`
- `category`
- `created_at`
- `updated_at`

### `bookings`

Expected columns from `database/schema.sql`:

- `id`
- `customer_name`
- `phone`
- `email`
- `selected_services`
- `date`
- `time`
- `status`
- `notes`
- `total_price`
- `created_at`
- `updated_at`

## 4. Important code mismatch notes

The current codebase is not fully aligned with the SQL schema yet. Raksha should use these notes before wiring production behavior.

### API files using camelCase fields

These files currently use camelCase field names when the schema uses snake_case:

- `pages/api/services.ts`
- `pages/api/services/[id].ts`
- `pages/api/bookings.ts`
- `pages/api/bookings/[id].ts`

Examples:

- `imageUrl` should map to `image_url`
- `createdAt` should map to `created_at`
- `updatedAt` should map to `updated_at`
- `customerName` should map to `customer_name`
- `customerEmail` should map to `email`
- `customerPhone` should map to `phone`
- `serviceIds` does not match the schema directly
- `timeSlot` should map to `time`
- `totalPrice` should map to `total_price`

### Booking payload mismatch

The schema expects `selected_services JSONB`, but the current booking API uses `serviceIds: string[]`.

Raksha should decide one of these paths:

1. Keep the schema as the source of truth and transform incoming booking payloads into `selected_services`.
2. Change the schema only if the product requirements clearly support a different structure.

Recommended approach: keep the schema and add a mapping layer in the API.

### Missing `workingHours` table

`pages/api/available-times.ts` queries a `workingHours` table, but that table is not defined in `database/schema.sql`.

Raksha should either:

1. Add a migration for `working_hours`, or
2. Keep the current fallback logic and remove the DB dependency until the table design is finalized.

### Sitemap mismatch

`pages/api/sitemap.ts` assumes service fields that do not exist in the current schema:

- `name`
- `active`

The schema currently has `title` and no `active` column.

### Admin secret mismatch

Frontend and backend admin auth are not fully aligned:

- frontend admin form uses `NEXT_PUBLIC_ADMIN_SECRET`
- backend checks `ADMIN_SECRET`

Raksha should standardize this before relying on admin flows.

## 5. Minimal integration checklist

Raksha can use this checklist to get the DB wired safely:

1. Add valid Supabase keys to `.env.local`.
2. Run `database/schema.sql` in Supabase.
3. Confirm `lib/supabase.ts` connects with the new env values.
4. Update service API handlers to use snake_case DB columns.
5. Update booking API handlers to map request payloads into schema fields.
6. Decide whether to add `working_hours` or rely on fallback time-slot generation.
7. Re-test:
   - fetch services
   - create service
   - create booking
   - admin booking list
   - availability endpoint

## 6. Suggested mapping examples

### Service insert mapping

Current app payload:

```ts
{
  title,
  description,
  price,
  duration,
  category,
  imageUrl
}
```

Database row should become:

```ts
{
  title,
  description,
  price,
  duration,
  category,
  image_url: imageUrl,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}
```

### Booking insert mapping

Current app payload:

```ts
{
  customerName,
  customerEmail,
  customerPhone,
  serviceIds,
  date,
  timeSlot,
  totalPrice,
  notes
}
```

Database row should be normalized into:

```ts
{
  customer_name: customerName,
  email: customerEmail,
  phone: customerPhone,
  selected_services: serviceIds,
  date,
  time: timeSlot,
  total_price: totalPrice,
  notes,
  status: 'pending',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}
```

If richer booking details are needed, `selected_services` should store service objects rather than only IDs.

## 7. Local verification

After integration:

```bash
npm install
npm run dev
```

Then verify:

- home page loads on `http://localhost:3000`
- services API returns data from Supabase
- booking creation writes to `bookings`
- admin views can read data with the configured secret

## 8. Recommendation

Treat `database/schema.sql` as the canonical schema and adapt the API layer to it first. That is the lowest-risk path for Raksha and keeps the repo easier to reason about.
