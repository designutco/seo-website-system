import { getSupabase } from "./supabase";
import { headers } from "next/headers";

const FALLBACK_PHONE = "60108889849";
const FALLBACK_WA_TEXT = "Hi, I am interested in your electric wheelchair.";

interface PhoneRow {
  phone_number: string;
  whatsapp_text: string;
  percentage: number;
  label: string | null;
}

export interface PhoneResult {
  phone: string;
  whatsappText: string;
  source: "database" | "fallback";
}

/**
 * Weighted random pick based on percentage column.
 * If percentages don't sum to 100, they're treated as relative weights.
 */
function pickWeighted(rows: PhoneRow[]): PhoneRow | undefined {
  if (rows.length === 0) return undefined;
  if (rows.length === 1) return rows[0];

  const totalWeight = rows.reduce((sum, r) => sum + (r.percentage || 1), 0);
  let random = Math.random() * totalWeight;

  for (const row of rows) {
    random -= row.percentage || 1;
    if (random <= 0) return row;
  }

  return rows[0];
}

/**
 * Resolve the current domain from the HTTP host header.
 */
async function getHostDomain(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("host") || h.get("x-forwarded-host") || "";
    // Strip port if present
    return host.replace(/:\d+$/, "");
  } catch {
    return "";
  }
}

/**
 * Fetch phone number + WhatsApp text for the current domain from Supabase.
 * Queries by the domain (Vercel deployment URL or custom domain).
 */
export async function getPhoneNumber(): Promise<PhoneResult> {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback" };
    }

    const domain = await getHostDomain();

    const { data, error } = await supabase
      .from("phone_numbers")
      .select("phone_number, whatsapp_text, percentage, label")
      .eq("website", domain)
      .eq("is_active", true);

    if (error) {
      console.error("[getPhoneNumber] Supabase error:", error.message);
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback" };
    }

    if (!data || data.length === 0) {
      return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback" };
    }

    const rows = data as PhoneRow[];
    const picked = pickWeighted(rows);

    if (picked) {
      return {
        phone: picked.phone_number,
        whatsappText: picked.whatsapp_text || FALLBACK_WA_TEXT,
        source: "database",
      };
    }

    return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback" };
  } catch (err) {
    console.error("[getPhoneNumber] Unexpected error:", err);
    return { phone: FALLBACK_PHONE, whatsappText: FALLBACK_WA_TEXT, source: "fallback" };
  }
}

export function waLink(phone: string, message?: string): string {
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export async function getWhatsAppLink(): Promise<string> {
  const { phone, whatsappText } = await getPhoneNumber();
  return waLink(phone, whatsappText);
}
