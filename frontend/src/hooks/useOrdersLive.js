/**
 * useOrdersLive — live Supabase orders + order_items hook.
 *
 * Behaviour:
 *  • When Supabase credentials are present: performs a single batched
 *    select("*, order_items(*)") query and subscribes to realtime INSERT/UPDATE
 *    events on the `orders` table to refresh automatically.
 *  • When credentials are absent (LOCAL_MOCK_ENGINE): calls the local Flask
 *    API at /api/v1/orders/summary and measures round-trip via performance.now().
 *
 * Returns: { orders, telemetry, loading, error, refetch }
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseLive } from '../lib/supabaseClient';
import { mockIncident } from '../data/mockData';

const API_BASE = 'http://localhost:5000';
const ORDERS_LIMIT = 100;

/** Derive per-order summary shape from raw Supabase row */
function normalizeOrder(row) {
  const items = row.order_items || [];
  const copy = { ...row };
  delete copy.order_items;
  copy.items = items;
  copy.items_count = items.length;
  return copy;
}

/** Shape a Flask /api/v1/orders/summary response into the same format */
function normalizeFlaskOrders(data) {
  return (data || []).map((o) => o);
}

export function useOrdersLive() {
  const [orders, setOrders] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const channelRef = useRef(null);

  // ─── Supabase path ───────────────────────────────────────────────────────────
  const fetchFromSupabase = useCallback(async () => {
    setLoading(true);
    setError(null);
    const t0 = performance.now();
    try {
      const { data, error: sbErr } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .limit(ORDERS_LIMIT);

      if (sbErr) throw sbErr;

      const durationMs = Math.round(performance.now() - t0);
      const normalized = (data || []).map(normalizeOrder);
      const totalItems = normalized.reduce((s, o) => s + o.items_count, 0);

      setOrders(normalized);
      setTelemetry({
        source: 'SUPABASE_LIVE',
        query_pattern: 'BATCHED_POSTGREST_RESOURCE_EMBEDDING',
        database_queries_count: 1,
        total_orders: normalized.length,
        total_items: totalItems,
        execution_time_ms: durationMs,
        has_n_plus_one_bottleneck: false,
        payload_bytes: JSON.stringify(data).length,
        fetched_at: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || 'Supabase fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Flask / mock path ───────────────────────────────────────────────────────
  const fetchFromFlask = useCallback(async () => {
    setLoading(true);
    setError(null);
    const t0 = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/v1/orders/summary?limit=${ORDERS_LIMIT}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const durationMs = Math.round(performance.now() - t0);

      const normalized = normalizeFlaskOrders(json.data);
      const telem = json.telemetry || {};
      setOrders(normalized);
      setTelemetry({
        ...telem,
        source: 'FLASK_LOCAL_API',
        execution_time_ms: durationMs,
        payload_bytes: JSON.stringify(json).length,
        fetched_at: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message || 'Flask API unreachable');
      // Graceful fallback: surface mock incident metrics
      setTelemetry({
        source: 'OFFLINE_MOCK_FALLBACK',
        query_pattern: 'UNAVAILABLE',
        database_queries_count: 0,
        total_orders: 0,
        execution_time_ms: 0,
        has_n_plus_one_bottleneck: false,
        fetched_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (isSupabaseLive) {
      fetchFromSupabase();
    } else {
      fetchFromFlask();
    }
  }, [fetchFromSupabase, fetchFromFlask]);

  // ─── Mount: initial fetch + realtime subscription ────────────────────────────
  useEffect(() => {
    refetch();

    if (isSupabaseLive) {
      // Subscribe to schema-level changes on orders and order_items
      channelRef.current = supabase
        .channel('orders-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          fetchFromSupabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
          fetchFromSupabase();
        })
        .subscribe();

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
        }
      };
    }

    // No cleanup needed for Flask polling
    return undefined;
  }, [refetch, fetchFromSupabase]);

  return { orders, telemetry, loading, error, refetch };
}
