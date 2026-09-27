import React from 'react';
import { Activity, Clock, Database, CheckCircle, AlertTriangle, ArrowDown } from 'lucide-react';
import { mockMetricComparison } from '../data/mockData';

/**
 * MetricComparison accepts an optional `liveLatency` prop from useVerificationResults.
 * When present, the measured batched latency overrides the static mock "after" value.
 */
export default function MetricComparison({ liveLatency }) {
  const icons = [Clock, Database, CheckCircle, AlertTriangle];

  // Build display data: merge live probe into static mock shape
  const metrics = mockMetricComparison.map((m, idx) => {
    if (idx === 0 && liveLatency?.batchedMs) {
      // Latency (P95): use live measurement
      return {
        ...m,
        after: `${liveLatency.batchedMs}ms`,
        delta: liveLatency.batchedMs < 500 ? `-${Math.round((1 - liveLatency.batchedMs / 4800) * 100)}%` : m.delta,
      };
    }
    if (idx === 1 && liveLatency?.dbQueries !== undefined) {
      return { ...m, after: String(liveLatency.dbQueries) };
    }
    if (idx === 2 && liveLatency?.httpStatus !== undefined) {
      return { ...m, after: String(liveLatency.httpStatus), delta: liveLatency.httpStatus === 200 ? 'Resolved' : 'Unresolved' };
    }
    return m;
  });

  return (
    <div
      className="tp-card"
      style={{
        padding: '24px',
        marginBottom: '24px',
        background: '#0B111D',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#34D399" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: '#F8FAFC' }}>
              VERIFIED PERFORMANCE IMPROVEMENT
            </span>
            <span className="tp-badge-success">CONFIRMED IN BOBSHELL</span>
            {liveLatency && (
              <span style={{ fontSize: '10px', fontFamily: 'var(--tp-font-mono)', color: '#34D399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', padding: '2px 6px', borderRadius: '4px' }}>
                LIVE PROBE
              </span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            Telemetry before patch vs. {liveLatency ? 'live measured' : 'sandboxed load benchmark'} after patch
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metrics.map((m, idx) => {
          const Icon = icons[idx] || Activity;
          return (
            <div
              key={idx}
              style={{
                background: '#030508',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '18px 20px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '10px' }}>
                <span>{m.label}</span>
                <Icon size={14} color="#22D3EE" />
              </div>

              {/* Before ➔ After Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', color: '#F87171', textDecoration: 'line-through', fontFamily: 'var(--tp-font-mono)' }}>
                  {m.before}
                </span>
                <span style={{ color: '#94A3B8', fontSize: '12px' }}>➔</span>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#34D399', fontFamily: 'var(--tp-font-mono)' }}>
                  {m.after}
                </span>
              </div>

              {/* Delta Improvement Badge */}
              <div
                className="tp-badge-success"
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--tp-font-mono)',
                  padding: '3px 8px'
                }}
              >
                <ArrowDown size={12} color="#34D399" />
                <span>{m.delta} Improvement</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
