import { DrillSeedGeneratorService } from '../services/drillSeedGeneratorService.js';
import { db } from '../db.js';

async function main() {
  console.log('================================================================');
  console.log('🚀 NIHOMI.COM: TOKYO PITCH-ACCENT DRILL SEED & MIGRATION PIPELINE');
  console.log('================================================================\n');

  console.log('📦 Starting automated drill generation and database seeding...');
  const result = DrillSeedGeneratorService.seedDefaultDrills();

  console.log(`\n✅ Seeding Complete!`);
  console.log(`- Total Drills in Database: ${result.totalSeeded}`);
  console.log(`- New Drills Inserted:      ${result.inserted}`);
  console.log(`- Existing Drills Updated:   ${result.updated}\n`);

  const sampleDrills = db.getPitchDrills({ limit: 5 });
  console.log('📋 Sample Seeded Drills:');
  sampleDrills.forEach((d, idx) => {
    console.log(
      `  [${idx + 1}] ${d.kanji} (${d.readingKana}) | Pattern: ${d.patternNameJa} | Pitches: [${d.targetPitches.join(', ')}] | Bengali: ${d.meaningBn}`
    );
  });

  console.log('\n✨ Database ready for student pitch-accent training and telemetry.\n');
}

main().catch((err) => {
  console.error('❌ Failed to seed pitch drills:', err);
  process.exit(1);
});
