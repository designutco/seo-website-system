import { createClient } from '@supabase/supabase-js'

/**
 * Supabase anon client — safe to use in Server Components and API routes.
 * RLS policies restrict this client to SELECT on active rows only.
 * Never use this for admin mutations; use the service-role client server-side.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
