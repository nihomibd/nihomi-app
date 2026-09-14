import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@db.tphmukxemzeuwhewblwv.supabase.co:5432/nihomi_db?schema=public',
  },
});
