/**
 * LiveBadge — small indicator showing data source (SUPABASE_LIVE, FLASK_LOCAL_API, OFFLINE).
 * Used alongside live metric displays to communicate data provenance.
 */
import React from 'react';

const SOURCE_CONFIG = {
  SUPABASE_LIVE: { label: 'SUPABASE LIVE', color: '#34D399', bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.3)' },
  FLASK_LOCAL_API: { label: 'FLASK API LIVE', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.3)' },
  OFFLINE_MOCK_FALLBACK: { label: 'OFFLINE MOCK', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
  STATIC_FALLBACK: { label: 'STATIC FALLBACK', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' },
  LIVE_MEASUREMENT: { label: 'LIVE MEASUREMENT', color: '#34D399', bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.3)' },
};

export default function LiveBadge({ source, style = {} }) {
  const cfg = SOURCE_CONFIG[source] || SOURCE_CONFIG.STATIC_FALLBACK;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '10px',
      fontFamily: 'var(--tp-font-mono)',
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      padding: '2px 7px',
      borderRadius: '4px',
      ...style,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}
