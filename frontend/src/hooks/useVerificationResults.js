/**
 * useVerificationResults — reads the BobShell verification JSON report
 * produced by scripts/verify_runner.py at /api/verification/results,
 * and fills live latency measurements from a direct performance.now() probe.
 *
 * Returns: { results, liveLatency, loading, error, rerun }
 */
import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:5000';

export function useVerificationResults() {
  const [results, setResults] = useState(null);
  const [liveLatency, setLiveLatency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Probe the optimized endpoint and measure round-trip time */
  const probeLatency = useCallback(async () => {
    const t0 = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/v1/orders/summary?limit=10`, {
        signal: AbortSignal.timeout(10000),
      });
      const durationMs = Math.round(performance.now() - t0);
      let dbQueries = 1;
      let totalOrders = 0;
      let payloadBytes = 0;

      if (res.ok) {
        const text = await res.text();
        payloadBytes = new Blob([text]).size;
        try {
          const json = JSON.parse(text);
          dbQueries = json.telemetry?.database_queries_count ?? 1;
          totalOrders = json.telemetry?.total_orders ?? 0;
        } catch (_) { /* */ }
      }

      setLiveLatency({
        batchedMs: durationMs,
        httpStatus: res.status,
        dbQueries,
        totalOrders,
        payloadBytes,
        measuredAt: new Date().toISOString(),
      });
    } catch (err) {
      setLiveLatency(null);
    }
  }, []);

  /** Fetch latest verification JSON report from Flask */
  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/verification/results`, {
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResults(json);
    } catch (err) {
      // If the endpoint isn't served yet, fall back gracefully
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const rerun = useCallback(async () => {
    await Promise.all([fetchReport(), probeLatency()]);
  }, [fetchReport, probeLatency]);

  useEffect(() => {
    rerun();
  }, [rerun]);

  return { results, liveLatency, loading, error, rerun };
}
