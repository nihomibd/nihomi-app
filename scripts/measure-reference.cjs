const sharp = require('sharp');
const fs = require('fs');

async function analyzeReference() {
  const img = sharp('storage/evidence/reference-1024x1536.png');
  const { width, height } = await img.metadata();
  console.log(`Image size: ${width}x${height}`);

  // We know the sections in order from top to bottom:
  // Section A: Header
  // Section B: Hero
  // Section C: Try a real lesson
  // Section D: Your Japanese journey
  // Section E: More than language
  // Section F: Real students, real progress
  // Section G: Simple pricing
  // Section H: Sunset CTA banner

  // Let's create slice crops of the 8 sections directly from the normalized 1024x1536 reference!
  // Approximate Y ranges:
  // Header: y: 0 to ~55 (height ~55)
  // Hero: y: 55 to ~440 (height ~385)
  // Try Lesson: y: 440 to ~675 (height ~235)
  // Journey: y: 675 to ~895 (height ~220)
  // More than Language: y: 895 to ~1095 (height ~200)
  // Testimonials: y: 1095 to ~1255 (height ~160)
  // Pricing: y: 1255 to ~1420 (height ~165)
  // Sunset Banner: y: 1420 to 1536 (height ~116)
  
  // Total = 55 + 385 + 235 + 220 + 200 + 160 + 165 + 116 = 1536 px!
  console.log('Approximate section budget on 1024x1536 canvas:');
  console.log('Header: ~55px');
  console.log('Hero: ~385px');
  console.log('Try Lesson: ~235px');
  console.log('Journey: ~220px');
  console.log('More than language: ~200px');
  console.log('Testimonials: ~160px');
  console.log('Pricing: ~165px');
  console.log('Sunset banner: ~116px');
}

analyzeReference();
