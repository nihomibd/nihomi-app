const fs = require('fs');
require('dotenv').config();
const { Client } = require('pg');

async function inspect() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('No DATABASE_URL found in .env');
    return;
  }
  
  // Extract project ref without exposing credentials
  const match = dbUrl.match(/postgres\.([a-zA-Z0-9]+):/);
  console.log('Inspecting Supabase project ref:', match ? match[1] : 'unknown');

  const client = new Client({
    connectionString: dbUrl,
    connectionTimeoutMillis: 7000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('DATABASE CONNECTION SUCCESSFUL');

    // 1. Get all public tables and rowsecurity
    const tableRes = await client.query(`
      SELECT 
        c.relname AS tablename,
        c.relrowsecurity AS rowsecurity,
        c.relforcerowsecurity AS forcerowsecurity
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
      ORDER BY c.relname;
    `);

    console.log('\n--- PUBLIC TABLES & RLS STATUS ---');
    console.table(tableRes.rows);

    const unprotected = tableRes.rows.filter(r => !r.rowsecurity);
    console.log('\n--- CRITICAL: TABLES WITH RLS DISABLED (rls_disabled_in_public) ---');
    if (unprotected.length === 0) {
      console.log('None! All public tables have RLS enabled.');
    } else {
      for (const t of unprotected) {
        try {
          const r = await client.query(`SELECT count(*) FROM public."${t.tablename}"`);
          t.rowCount = parseInt(r.rows[0].count, 10);
        } catch (e) {
          t.rowCount = 'err';
        }
      }
      console.table(unprotected);
    }

    // 2. Check existing policies
    const policyRes = await client.query(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `);
    console.log('\n--- POLICIES COUNT ---', policyRes.rows.length);

    // 3. Check table grants for anon, authenticated, PUBLIC
    const grantsRes = await client.query(`
      SELECT 
        table_name,
        grantee,
        privilege_type
      FROM information_schema.role_table_grants
      WHERE table_schema = 'public' 
        AND grantee IN ('anon', 'authenticated', 'PUBLIC')
      ORDER BY table_name, grantee, privilege_type;
    `);
    console.log('\n--- GRANTS TO anon / authenticated / PUBLIC ---');
    console.log('Total grants found:', grantsRes.rows.length);

    // 4. Check function generate_nihomi_account_id
    const funcRes = await client.query(`
      SELECT 
        p.proname,
        p.prosecdef,
        pg_get_function_identity_arguments(p.oid) as args
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname = 'generate_nihomi_account_id';
    `);
    console.log('\n--- FUNCTION generate_nihomi_account_id ---');
    console.table(funcRes.rows);

    await client.end();
  } catch (err) {
    console.error('DATABASE INSPECTION FAILED / TIMED OUT:', err.message);
  }
}

inspect();
