// scripts/submit-indexnow.cjs
// Automated URL submission to Bing Webmaster Tools & IndexNow API
const fs = require('fs');
const path = require('path');

const HOST = 'nihomi.com';
const KEY = 'nihomi-indexnow-key-20261023';
const KEY_LOCATION = `https://${HOST}/indexnow-key.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/journey`,
  `https://${HOST}/curriculum`,
  `https://${HOST}/kana`,
  `https://${HOST}/mock-exams`,
  `https://${HOST}/rirekisho`,
  `https://${HOST}/workos`,
  `https://${HOST}/pricing`,
  `https://${HOST}/portal`,
  `https://${HOST}/documents`,
  `https://${HOST}/contact`,
  `https://${HOST}/terms`,
  `https://${HOST}/privacy`,
  `https://${HOST}/refund-policy`,
  `https://${HOST}/llms.txt`,
  `https://${HOST}/sitemap.xml`
];

async function submitIndexNow() {
  console.log('================================================================');
  console.log('📡 BING WEBMASTER TOOLS & INDEXNOW AUTOMATED SUBMISSION');
  console.log('================================================================');
  console.log(`Host: ${HOST}`);
  console.log(`Key: ${KEY}`);
  console.log(`Key Location: ${KEY_LOCATION}`);
  console.log(`URLs to submit: ${URL_LIST.length}`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`\nIndexNow API Response: HTTP ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log('✔ Successfully submitted URL list to IndexNow (Bing, Yandex, Seznam, Naver)!');
    } else {
      console.log(`Response body: ${await res.text()}`);
    }
  } catch (err) {
    console.warn('Network notice during IndexNow submission (will retry during live deployment):', err.message);
  }
}

submitIndexNow();
