/**
 * useIncidentMetrics — live latency measurement hook.
 *
 * Fires a real GET /api/v1/orders/summary request using performance.now()
 * to calculate actual round-trip latency, payload size, and HTTP status.
 * Generates a unique trace ID per measurement session so no two incident
 * cards share the same signature.
 *
 * Returns: { metrics, traceId, loading, error, remeasure }
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { mockIncident } from '../data/mockData';

const API_BASE = 'http://localhost:5000';

/** Generates a short unique trace ID anchored to the current session timestamp */
function newTraceId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `trace-${ts}-${rnd}`;
}

/** Human-readable elapsed string from a UTC ISO timestamp */
function elapsedSince(isoTs) {
  const diffSec = Math.floor((Date.now() - new Date(isoTs).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const m = Math.floor(diffSec / 60);
  const s = diffSec % 60;
  return `${m}m ${s}s ago`;
}

export function useIncidentMetrics() {
  const sessionTraceId = useRef(newTraceId());
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const measuredAt = useRef(new Date().toISOString());

  const measure = useCallback(async () => {
    setLoading(true);
    setError(null);
    // Fresh trace ID each manual remeasure
    sessionTraceId.current = newTraceId();
    measuredAt.current = new Date().toISOString();

    const t0 = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/v1/orders/summary?limit=100`, {
        signal: AbortSignal.timeout(12000),
      });
      const durationMs = Math.round(performance.now() - t0);

      let dbQueries = 1;
      let queryPattern = 'BATCHED_POSTGREST_RESOURCE_EMBEDDING';
      let isN1 = false;
      let payloadBytes = 0;
      let totalOrders = 0;

      if (res.ok) {
        const text = await res.text();
        payloadBytes = new Blob([text]).size;
        try {
          const json = JSON.parse(text);
          const telem = json.telemetry || {};
          dbQueries = telem.database_queries_count ?? 1;
          queryPattern = telem.query_pattern ?? queryPattern;
          isN1 = telem.has_n_plus_one_bottleneck ?? false;
          totalOrders = telem.total_orders ?? (json.data || []).length;
        } catch (_) {
          /* raw response — use defaults */
        }
      }

      setMetrics({
        traceId: sessionTraceId.current,
        latencyMs: durationMs,
        latencyDisplay: durationMs > 1000 ? `${(durationMs / 1000).toFixed(2)}s` : `${durationMs}ms`,
        httpStatus: res.status,
        dbQueries,
        queryPattern,
        isN1,
        payloadBytes,
        totalOrders,
        errorRate: res.ok ? '0.0%' : '100%',
        detectedAt: measuredAt.current,
        detectedDuration: elapsedSince(measuredAt.current),
        source: 'LIVE_MEASUREMENT',
      });
    } catch (err) {
      const durationMs = Math.round(performance.now() - t0);
      setError(err.message || 'Connection refused');
      // Fallback to static incident values so the UI is never blank
      setMetrics({
        traceId: sessionTraceId.current,
        latencyMs: null,
        latencyDisplay: mockIncident.metrics.latency,
        httpStatus: 504,
        dbQueries: mockIncident.metrics.dbQueries,
        queryPattern: 'N+1_SEQUENTIAL (FLASK OFFLINE)',
        isN1: true,
        payloadBytes: 0,
        totalOrders: 0,
        errorRate: mockIncident.metrics.errorRate,
        detectedAt: measuredAt.current,
        detectedDuration: elapsedSince(measuredAt.current),
        source: 'STATIC_FALLBACK',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    measure();
    // Refresh every 30 seconds to keep timestamps & latency measurements live
    const id = setInterval(measure, 30_000);
    return () => clearInterval(id);
  }, [measure]);

  return {
    metrics,
    traceId: sessionTraceId.current,
    loading,
    error,
    remeasure: measure,
  };
}
