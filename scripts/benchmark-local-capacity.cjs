// scripts/benchmark-local-capacity.cjs
// NIHOMI.COM — REPRODUCIBLE BOUNDED LOCAL PERFORMANCE BENCHMARK
// Measures actual local server throughput, latency percentiles (p50, p90, p99),
// and memory usage under bounded synthetic concurrency. Never claims unverified scale.

const http = require('http');

const HOST = '127.0.0.1';
const PORT = 3000;
const PATH = '/api/health';
const TOTAL_REQUESTS = 100;
const CONCURRENCY = 10;

async function makeRequest() {
  const start = process.hrtime.bigint();
  return new Promise((resolve) => {
    const req = http.get({ host: HOST, port: PORT, path: PATH }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1e6;
        resolve({
          statusCode: res.statusCode,
          durationMs,
          success: res.statusCode === 200
        });
      });
    });
    req.on('error', (err) => {
      const end = process.hrtime.bigint();
      resolve({
        statusCode: 0,
        durationMs: Number(end - start) / 1e6,
        success: false,
        error: err.message
      });
    });
  });
}

async function runBenchmark() {
  console.log(`======================================================================`);
  console.log(`NIHOMI.COM — LOCAL PERFORMANCE BENCHMARK`);
  console.log(`Target: http://${HOST}:${PORT}${PATH}`);
  console.log(`Total Requests: ${TOTAL_REQUESTS} | Concurrency: ${CONCURRENCY}`);
  console.log(`======================================================================`);

  const results = [];
  let completed = 0;
  const overallStart = process.hrtime.bigint();

  const worker = async () => {
    while (completed < TOTAL_REQUESTS) {
      completed++;
      const res = await makeRequest();
      results.push(res);
    }
  };

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const overallEnd = process.hrtime.bigint();
  const totalDurationSec = Number(overallEnd - overallStart) / 1e9;

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const durations = results.map(r => r.durationMs).sort((a, b) => a - b);

  const p50 = durations[Math.floor(durations.length * 0.50)];
  const p90 = durations[Math.floor(durations.length * 0.90)];
  const p99 = durations[Math.floor(durations.length * 0.99)];
  const min = durations[0];
  const max = durations[durations.length - 1];
  const avg = durations.reduce((acc, d) => acc + d, 0) / durations.length;
  const rps = results.length / totalDurationSec;

  const mem = process.memoryUsage();

  console.log(`\n--- BENCHMARK RESULTS ---`);
  console.log(`Completed Requests: ${results.length}`);
  console.log(`Success Count:      ${successful.length} (${(successful.length/results.length*100).toFixed(1)}%)`);
  console.log(`Failures:           ${failed.length}`);
  console.log(`Total Time:         ${totalDurationSec.toFixed(2)}s`);
  console.log(`Throughput:         ${rps.toFixed(1)} req/sec`);
  console.log(`Latency Min:        ${min.toFixed(2)} ms`);
  console.log(`Latency Avg:        ${avg.toFixed(2)} ms`);
  console.log(`Latency P50:        ${p50.toFixed(2)} ms`);
  console.log(`Latency P90:        ${p90.toFixed(2)} ms`);
  console.log(`Latency P99:        ${p99.toFixed(2)} ms`);
  console.log(`Latency Max:        ${max.toFixed(2)} ms`);
  console.log(`Benchmark Memory:   RSS ${(mem.rss/1024/1024).toFixed(1)} MB | Heap ${(mem.heapUsed/1024/1024).toFixed(1)} MB`);
  console.log(`======================================================================`);

  const summary = {
    totalRequests: results.length,
    concurrency: CONCURRENCY,
    successRate: `${(successful.length/results.length*100).toFixed(1)}%`,
    throughputRps: Number(rps.toFixed(1)),
    latencyMs: {
      min: Number(min.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      p50: Number(p50.toFixed(2)),
      p90: Number(p90.toFixed(2)),
      p99: Number(p99.toFixed(2)),
      max: Number(max.toFixed(2))
    },
    benchmarkHostMemoryMb: Number((mem.rss/1024/1024).toFixed(1))
  };

  const fs = require('fs');
  const path = require('path');
  const outDir22_3 = path.join(__dirname, '..', 'artifacts', 'qa', 'phase22-3-release-truth');
  if (!fs.existsSync(outDir22_3)) fs.mkdirSync(outDir22_3, { recursive: true });
  const outPath22_3 = path.join(outDir22_3, 'local-benchmark.json');
  fs.writeFileSync(outPath22_3, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`Benchmark data saved to ${outPath22_3}`);
}

runBenchmark().catch(console.error);
