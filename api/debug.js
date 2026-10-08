export default async function handler(req, res) {
  const result = {
    envCheck: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      hasGeminiApiKey: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd()
    },
    indexImport: null,
    importError: null
  };

  try {
    const mod = await import('./index.js');
    result.indexImport = {
      keys: Object.keys(mod),
      hasDefault: typeof mod.default === 'function'
    };
  } catch (err) {
    result.importError = {
      message: err.message,
      stack: err.stack,
      code: err.code
    };
  }

  res.status(200).json(result);
}
