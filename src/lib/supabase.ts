const supabaseUrl =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_docs_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.docs_SUPABASE_SERVICE_ROLE_KEY ??
  process.env.docs_SUPABASE_SECRET_KEY;

function getSupabaseRestUrl(table: string) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase configuration. Set SUPABASE_URL/NEXT_PUBLIC_docs_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/docs_SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  const baseUrl = supabaseUrl.replace(/\/$/, '');
  return `${baseUrl}/rest/v1/${table}`;
}

export async function insertSupabaseRow(table: string, row: Record<string, unknown>) {
  const response = await fetch(getSupabaseRestUrl(table), {
    method: 'POST',
    headers: {
      apikey: supabaseServiceRoleKey!,
      Authorization: `Bearer ${supabaseServiceRoleKey!}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }
}
