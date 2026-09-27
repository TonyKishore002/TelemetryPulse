import React from 'react';
import { AlertCircle, Target, GitCommit, Database, Zap } from 'lucide-react';
import { mockRootCause } from '../data/mockData';

export default function RootCauseCard() {
  return (
    <div
      className="tp-card"
      style={{
        padding: '24px',
        marginBottom: '24px',
        borderLeft: '4px solid #F87171',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        background: '#0B111D'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Target size={18} color="#F87171" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
              {mockRootCause.title}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Identified via Autonomous AST Correlation &amp; OpenTelemetry Span Analysis
            </div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="tp-badge-success" style={{ textAlign: 'right', flexDirection: 'column', alignItems: 'flex-end', padding: '6px 12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#34D399', fontFamily: 'var(--tp-font-mono)' }}>
            {mockRootCause.confidence}
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
            Confidence: {mockRootCause.confidenceScore}
          </div>
        </div>
      </div>

      {/* Grid of Key Evidence & Location */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '18px' }}>
        <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>
            Location
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--tp-font-mono)', color: '#22D3EE', marginTop: '4px' }}>
            {mockRootCause.location}
          </div>
        </div>

        <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>
            Correlated Evidence
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--tp-font-mono)', color: '#F87171', marginTop: '4px' }}>
            {mockRootCause.evidence}
          </div>
        </div>

        <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>
            Blast Radius
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--tp-font-mono)', color: '#FBBF24', marginTop: '4px' }}>
            PostgreSQL Connection Starvation (92%)
          </div>
        </div>
      </div>

      {/* Explanation text */}
      <div
        style={{
          fontSize: '12.5px',
          lineHeight: '1.625',
          color: '#CBD5E1',
          background: '#030508',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
        className="leading-relaxed"
      >
        <p style={{ marginBottom: '8px' }}><strong style={{ color: '#F8FAFC' }}>Triage Summary: </strong>{mockRootCause.summary}</p>
        <p style={{ color: '#94A3B8', margin: 0 }}><strong style={{ color: '#F8FAFC' }}>Impact Analysis: </strong>{mockRootCause.impact}</p>
      </div>
    </div>
  );
}
