import { createClient } from '@supabase/supabase-js';

const url = (process.env.SUPABASE_URL || 'https://tphmukxemzeuwhewblwv.supabase.co') + '/rest/v1/';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t';

async function fetchAllSchemas() {
  const res = await fetch(url, {
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Accept': 'application/openapi+json'
    }
  });
  const spec = await res.json();
  const definitions = spec.definitions || {};
  const schemaSummary: Record<string, string[]> = {};
  for (const [table, def] of Object.entries<any>(definitions)) {
    schemaSummary[table] = Object.keys(def.properties || {});
  }
  console.log(JSON.stringify(schemaSummary, null, 2));
}

fetchAllSchemas();
