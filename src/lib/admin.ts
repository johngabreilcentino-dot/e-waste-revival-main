import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["johngabreilcentino@gmail.com"];

export function isConfiguredAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function loadIsAdmin(user: User | null) {
  if (!user) return false;
  if (isConfiguredAdminEmail(user.email)) return true;

  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .maybeSingle();

  return Boolean(data);
}
