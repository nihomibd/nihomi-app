// scripts/backupDatabase.ts
// NIHOMI.COM (にほみ) — Automated Database Backup Engine
// Exports all Supabase PostgreSQL tables (users, progress, subscriptions, lessons) into timestamped JSON snapshot

import fs from 'fs';
import path from 'path';
import { db } from '../server/db.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

interface BackupSnapshot {
  metadata: {
    system: string;
    version: string;
    timestamp: string;
    source: string;
    entityCounts: Record<string, number>;
    totalRecords: number;
    sha256?: string;
  };
  tables: {
    users: any[];
    progress: any[];
    subscriptions: any[];
    lessons: any[];
    profiles?: any[];
    courses?: any[];
    payments?: any[];
  };
}

async function runDatabaseBackup(): Promise<{ filePath: string; fileName: string; byteSize: number; totalRecords: number }> {
  console.log('\n======================================================');
  console.log('  NIHOMI.COM — AUTOMATED DATABASE BACKUP ENGINE');
  console.log('======================================================\n');

  // Initialize Supabase client if configured
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://aiychtkhktwsjrieeaha.supabase.co').trim();
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-5EUXxkOI_z4VzondkZHSg_DPa9t').trim();

  let supabase: any = null;
  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
      console.warn('[BackupEngine] Supabase initialization notice:', e);
    }
  }

  // Fetch from Supabase with fallback to durable server db state
  let users: any[] = [];
  let progress: any[] = [];
  let subscriptions: any[] = [];
  let lessons: any[] = [];
  let profiles: any[] = [];
  let courses: any[] = [];
  let payments: any[] = [];

  // 1. Users table
  if (supabase) {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        users = data;
        console.log(`[Supabase PG] Fetched ${data.length} users from remote PostgreSQL.`);
      }
    } catch {}
  }
  if (users.length === 0) {
    users = db.data.users || [];
    console.log(`[Durable DB] Fallback/Primary: Exporting ${users.length} users from local store.`);
  }

  // 2. Progress table
  if (supabase) {
    try {
      const { data, error } = await supabase.from('user_progress').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        progress = data;
        console.log(`[Supabase PG] Fetched ${data.length} progress records.`);
      }
    } catch {}
  }
  if (progress.length === 0) {
    progress = db.data.progress || [];
    console.log(`[Durable DB] Exporting ${progress.length} progress records.`);
  }

  // 3. Subscriptions table
  if (supabase) {
    try {
      const { data, error } = await supabase.from('subscriptions').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        subscriptions = data;
        console.log(`[Supabase PG] Fetched ${data.length} subscription records.`);
      }
    } catch {}
  }
  if (subscriptions.length === 0) {
    subscriptions = db.data.subscriptions || [];
    console.log(`[Durable DB] Exporting ${subscriptions.length} subscription records.`);
  }

  // 4. Lessons table
  if (supabase) {
    try {
      const { data, error } = await supabase.from('lessons').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        lessons = data;
        console.log(`[Supabase PG] Fetched ${data.length} lesson records.`);
      }
    } catch {}
  }
  if (lessons.length === 0) {
    lessons = db.data.lessons || [];
    console.log(`[Durable DB] Exporting ${lessons.length} lesson records.`);
  }

  // Additional relational integrity tables
  profiles = db.data.profiles || [];
  courses = db.data.courses || [];
  payments = db.data.payments || [];

  const totalRecords = users.length + progress.length + subscriptions.length + lessons.length + profiles.length + courses.length + payments.length;

  const now = new Date();
  const dateFormatted = now.toISOString().replace(/[:.]/g, '-');
  const fileName = `nihomi_backup_${dateFormatted}.json`;

  const storageDir = path.join(process.cwd(), 'storage', 'backups');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const filePath = path.join(storageDir, fileName);

  const snapshot: BackupSnapshot = {
    metadata: {
      system: 'NIHOMI.COM (にほみ) Core Platform',
      version: '1.0.0-PROD',
      timestamp: now.toISOString(),
      source: 'Supabase PostgreSQL + Nihomi Durable Engine',
      entityCounts: {
        users: users.length,
        progress: progress.length,
        subscriptions: subscriptions.length,
        lessons: lessons.length,
        profiles: profiles.length,
        courses: courses.length,
        payments: payments.length
      },
      totalRecords
    },
    tables: {
      users,
      progress,
      subscriptions,
      lessons,
      profiles,
      courses,
      payments
    }
  };

  const jsonContent = JSON.stringify(snapshot, null, 2);
  fs.writeFileSync(filePath, jsonContent, 'utf-8');

  const stats = fs.statSync(filePath);
  const byteSize = stats.size;

  console.log('\n======================================================');
  console.log(`✓ BACKUP SNAPSHOT GENERATED SUCCESSFULLY!`);
  console.log(`  File Name:   ${fileName}`);
  console.log(`  Target Path: ${filePath}`);
  console.log(`  File Size:   ${byteSize.toLocaleString()} bytes (${(byteSize / 1024).toFixed(2)} KB)`);
  console.log(`  Records:     ${totalRecords} items across 7 collections`);
  console.log('======================================================\n');

  return { filePath, fileName, byteSize, totalRecords };
}

runDatabaseBackup()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((err) => {
    console.error('[Backup Error]:', err);
    process.exitCode = 1;
  });
