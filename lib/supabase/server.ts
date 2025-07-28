import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for server-side usage with cookie support.
 * Must be awaited because cookies() is async.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use service role key if available
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  );
}
// Schema

// -- Users table: people needing rescue
// create table users (
//   id uuid primary key references auth.users(id), -- Supabase Auth user ID
//   name text not null,
//   phone_number text not null,
//   email text, -- optional, for reference
//   emergency_type text not null,
//   status text not null, -- e.g. waiting, rescued
//   last_known_location geography(Point,4326), -- lat/lon GPS coordinates
//   location_updated_at timestamp with time zone,
//   additional_info jsonb,
//   created_at timestamp with time zone default now(),
//   updated_at timestamp with time zone default now()
// );

// -- Rescuers table
// create table rescuers (
//   id uuid primary key references auth.users(id), -- Supabase Auth user ID
//   name text not null,
//   phone_number text not null,
//   email text,
//   current_location geography(Point,4326),
//   location_updated_at timestamp with time zone,
//   assigned_user_id uuid references users(id), -- current assigned user to rescue
//   status text not null, -- e.g. available, busy
//   created_at timestamp with time zone default now(),
//   updated_at timestamp with time zone default now()
// );

// -- Admins table
// create table admins (
//   id uuid primary key references auth.users(id), -- Supabase Auth user ID
//   name text not null,
//   email text not null unique,
//   phone_number text,
//   role text not null, -- e.g. superadmin, manager
//   created_at timestamp with time zone default now(),
//   updated_at timestamp with time zone default now()
// );

// -- Rescue Missions table: tracks rescuer-user assignments and mission status
// create table rescue_missions (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid not null references users(id),
//   rescuer_id uuid not null references rescuers(id),
//   status text not null, -- pending, ongoing, completed
//   started_at timestamp with time zone,
//   completed_at timestamp with time zone,
//   created_at timestamp with time zone default now(),
//   updated_at timestamp with time zone default now()
// );
