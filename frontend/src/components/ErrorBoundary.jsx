/**
 * ErrorBoundary — wraps any child section and surfaces a styled fallback
 * when the live network fetch fails (Flask offline, Supabase unreachable, etc.)
 */
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({ error, onRetry, children, label = 'Data stream' }) {
  if (!error) return children;

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.05)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: '8px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
    }}>
      <AlertTriangle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: '1px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#F87171', marginBottom: '4px' }}>
          {label} unavailable
        </div>
        <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--tp-font-mono)' }}>
          {error}
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
          Falling back to last known static values. Ensure the Flask server and Supabase connection are online.
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            color: '#94A3B8',
            cursor: 'pointer',
            fontFamily: 'var(--tp-font-mono)',
            flexShrink: 0,
          }}
        >
          <RefreshCw size={12} />
          Retry
        </button>
      )}
    </div>
  );
}
