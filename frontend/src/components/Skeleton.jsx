/** Animated loading skeleton blocks used while live data fetches are in-flight. */
import React from 'react';

const pulse = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '200% 100%',
  animation: 'tp-skeleton-pulse 1.6s ease-in-out infinite',
  borderRadius: '6px',
};

export default function Skeleton({ width = '100%', height = '16px', style = {} }) {
  return (
    <>
      <style>{`
        @keyframes tp-skeleton-pulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ ...pulse, width, height, ...style }} />
    </>
  );
}

/** A full-card placeholder with multiple skeleton rows */
export function SkeletonCard({ rows = 3 }) {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Skeleton height="14px" width="40%" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="12px" width={`${100 - i * 10}%`} />
      ))}
    </div>
  );
}

/** Three metric cells placeholder */
export function SkeletonMetrics({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px 16px' }}>
          <Skeleton height="10px" width="60%" style={{ marginBottom: '8px' }} />
          <Skeleton height="22px" width="50%" />
        </div>
      ))}
    </div>
  );
}
