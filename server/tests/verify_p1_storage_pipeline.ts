import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { cloudStorageService } from '../services/cloudStorageService.js';
import { contentEngineService } from '../services/contentEngineService.js';
import { db } from '../db.js';

async function runStoragePipelineTests() {
  console.log('===============================================================');
  console.log('📦 NIHOMI — P1-STORAGE-01 CLOUD MEDIA STORAGE PIPELINE VERIFY');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Service Initialization & Bucket Names
  // -------------------------------------------------------------
  assert(typeof cloudStorageService.uploadFile === 'function', '1. cloudStorageService instantiated properly');
  assert(cloudStorageService.sourcesBucket.includes('content-sources'), '2. Sources bucket name configured correctly');
  assert(cloudStorageService.mediaBucket.includes('curriculum-media'), '3. Media bucket name configured correctly');

  // -------------------------------------------------------------
  // TEST 2: PDF Upload & Dual-Layer Caching
  // -------------------------------------------------------------
  const dummyPdfHeader = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Minna no Nihongo Lesson 1) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF');
  const uploadResult = await cloudStorageService.uploadFile({
    filename: 'Minna_No_Nihongo_N5_Lesson01.pdf',
    buffer: dummyPdfHeader,
    mimeType: 'application/pdf',
    folder: 'sources/n5',
    isPublic: true
  });

  assert(uploadResult.success === true, '4. Upload file returned success true');
  assert(uploadResult.storageKey.startsWith('sources/n5/'), '5. Folder prefix applied to storage key');
  assert(uploadResult.fileSize === dummyPdfHeader.length, '6. Uploaded file size matches original buffer length');
  assert(fs.existsSync(uploadResult.storagePath), '7. Local cache disk file created immediately');
  assert(uploadResult.storageUrl.length > 0, '8. Storage URL generated for uploaded asset');

  // -------------------------------------------------------------
  // TEST 3: Buffer Retrieval & Data Integrity
  // -------------------------------------------------------------
  const retrievedBuffer = await cloudStorageService.getFileBuffer(uploadResult.storageKey, uploadResult.bucketName, uploadResult.storagePath);
  assert(retrievedBuffer !== null, '9. Buffer retrieved successfully from storage pipeline');
  assert(retrievedBuffer?.toString() === dummyPdfHeader.toString(), '10. Retrieved buffer content matches original binary bytes');

  // -------------------------------------------------------------
  // TEST 4: Media Asset Upload (Images & Audio)
  // -------------------------------------------------------------
  const dummyPngBuffer = Buffer.from('\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4');
  const mediaResult = await cloudStorageService.uploadFile({
    filename: 'kanji_gakkou_stroke_diagram.png',
    buffer: dummyPngBuffer,
    mimeType: 'image/png',
    folder: 'kanji/diagrams'
  });

  assert(mediaResult.success === true, '11. Image media uploaded successfully');
  assert(mediaResult.bucketName === cloudStorageService.mediaBucket, '12. Image routed to media bucket');
  assert(mediaResult.storageKey.includes('kanji/diagrams/'), '13. Media storage key maintains hierarchy');

  // -------------------------------------------------------------
  // TEST 5: Signed URL Generation
  // -------------------------------------------------------------
  const signedUrl = await cloudStorageService.getSignedUrl(uploadResult.storageKey, uploadResult.bucketName, 1800);
  assert(typeof signedUrl === 'string' && signedUrl.length > 0, '14. Signed URL generated successfully for private access');

  // -------------------------------------------------------------
  // TEST 6: Graceful Handling of Non-Existent Assets
  // -------------------------------------------------------------
  const missingBuffer = await cloudStorageService.getFileBuffer('non_existent_key_99999.pdf', 'nihomi-content-sources');
  assert(missingBuffer === null, '15. Missing asset returns null gracefully without crashing server');

  // -------------------------------------------------------------
  // TEST 7: Content Engine saveUploadedPdf Pipeline Integration
  // -------------------------------------------------------------
  const source = await contentEngineService.saveUploadedPdf(
    dummyPdfHeader,
    'Minna_N5_Kanji_Bank.pdf',
    'application/pdf',
    'N5',
    'Minna N5 Kanji Bank Chapter 1',
    'usr-admin-01',
    'admin@nihomi.com'
  );

  assert(typeof source.id === 'string' && source.id.length > 0, '16. Content source created with valid ID');
  assert(typeof source.cloudStorageKey === 'string' && source.cloudStorageKey.length > 0, '17. Content source contains cloudStorageKey');
  assert(source.storageBucket === cloudStorageService.sourcesBucket, '18. Content source points to valid storage bucket');
  assert(source.fileSize === dummyPdfHeader.length, '19. Content source record records exact byte count');

  // -------------------------------------------------------------
  // TEST 8: File Cleanup & Deletion
  // -------------------------------------------------------------
  const deleted = await cloudStorageService.deleteFile(uploadResult.storageKey, uploadResult.bucketName, uploadResult.storagePath);
  assert(deleted === true, '20. File deleted successfully from storage pipeline');
  assert(!fs.existsSync(uploadResult.storagePath), '21. Local cache disk file cleaned up upon deletion');

  console.log('\n===============================================================');
  console.log(`🎯 STORAGE AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runStoragePipelineTests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
