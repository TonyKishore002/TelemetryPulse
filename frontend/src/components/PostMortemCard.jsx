import React, { useState } from 'react';
import { FileText, Copy, Check, Download, AlertCircle, ShieldAlert, BookOpen } from 'lucide-react';
import { mockPostMortem } from '../data/mockData';

export default function PostMortemCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const markdown = `# ${mockPostMortem.title}
Date: ${mockPostMortem.date}
Author: ${mockPostMortem.author}

## 1. Root Cause Analysis (RCA)
${mockPostMortem.rca}

## 2. 5 Whys Analysis
${mockPostMortem.fiveWhys.join('\n')}

## 3. Verified Benchmark Improvements
- Latency: ${mockPostMortem.benchmarks.beforeLatency} -> ${mockPostMortem.benchmarks.afterLatency}
- Database Queries: ${mockPostMortem.benchmarks.beforeQueries} -> ${mockPostMortem.benchmarks.afterQueries}
- Error Rate: ${mockPostMortem.benchmarks.beforeErrorRate} -> ${mockPostMortem.benchmarks.afterErrorRate}
- Estimated Cloud Savings: ${mockPostMortem.benchmarks.monthlySavings}

## 4. Developer Prevention Rules & CI Safeguards
${mockPostMortem.preventionRules.join('\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#818CF8" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: '#F8FAFC' }}>
              AUTOMATED INCIDENT POST-MORTEM &amp; RUNBOOK GENERATOR
            </span>
            <span className="tp-badge-cyan">AUTO-GENERATED RCA</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            Autonomous Incident Summary &bull; 5 Whys &bull; Prevention Rules staged for Confluence / Notion
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="tp-btn-secondary"
          style={{ fontSize: '11px', padding: '6px 12px' }}
        >
          {copied ? <Check size={13} color="#34D399" /> : <Copy size={13} />}
          <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY MARKDOWN'}</span>
        </button>
      </div>

      {/* Markdown Style Box */}
      <div
        style={{
          background: '#030508',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '22px',
          color: '#CBD5E1',
          fontSize: '12.5px',
          lineHeight: '1.625'
        }}
        className="leading-relaxed"
      >
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F8FAFC', marginBottom: '6px', letterSpacing: '-0.01em' }}>
            {mockPostMortem.title}
          </h3>
          <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', gap: '16px', fontFamily: 'var(--tp-font-mono)' }}>
            <span><strong>Date:</strong> {mockPostMortem.date}</span>
            <span><strong>Authors:</strong> {mockPostMortem.author}</span>
            <span><strong>Incident:</strong> {mockPostMortem.incidentId}</span>
          </div>
        </div>

        {/* Section 1: RCA */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#22D3EE', marginBottom: '6px' }}>
            1. Root Cause Analysis (RCA)
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '12.5px', margin: 0 }}>{mockPostMortem.rca}</p>
        </div>

        {/* Section 2: 5 Whys */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#FBBF24', marginBottom: '6px' }}>
            2. The 5 Whys Analysis
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {mockPostMortem.fiveWhys.map((why, idx) => (
              <div key={idx} style={{ fontSize: '12px', color: '#CBD5E1', paddingLeft: '10px', borderLeft: '2px solid rgba(245, 158, 11, 0.4)' }}>
                {why}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Developer Prevention Rules */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#34D399', marginBottom: '8px' }}>
            <BookOpen size={13} color="#34D399" />
            <span>3. Developer Prevention Rules &amp; Guardrails</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {mockPostMortem.preventionRules.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '11.5px',
                  color: '#86EFAC',
                  fontFamily: 'var(--tp-font-mono)'
                }}
              >
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
