import React from 'react';
import { Database, TrendingDown, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { mockExplainAnalyze } from '../data/mockData';

export default function ExplainAnalyzeDiff() {
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
            <Database size={16} color="#22D3EE" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: '#F8FAFC' }}>
              QUERY EXECUTION PLAN DIFF TABLE (EXPLAIN ANALYZE)
            </span>
            <span className="tp-badge-cyan">POSTGRESQL 16 AST</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            PostgreSQL Query Optimizer AST &bull; Sequential table scan eliminated in favor of Primary Key Index
          </div>
        </div>
        <div className="tp-badge-success">
          <CheckCircle2 size={13} color="#34D399" />
          <span>500x COST REDUCTION VERIFIED</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', background: '#030508' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', fontFamily: 'var(--tp-font-sans)' }}>
          <thead>
            <tr style={{ background: '#090D14', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th style={{ padding: '12px 18px', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Metric
              </th>
              <th style={{ padding: '12px 18px', color: '#F87171', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Before Patch (Unbatched)
              </th>
              <th style={{ padding: '12px 18px', color: '#34D399', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                After Patch (Batched Array)
              </th>
              <th style={{ padding: '12px 18px', color: '#22D3EE', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Improvement Delta
              </th>
            </tr>
          </thead>
          <tbody>
            {mockExplainAnalyze.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: idx < mockExplainAnalyze.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                  background: row.highlight ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = row.highlight ? 'rgba(6, 182, 212, 0.05)' : 'transparent')
                }
              >
                <td style={{ padding: '12px 18px', fontWeight: 600, color: '#F8FAFC' }}>
                  {row.metric}
                </td>
                <td style={{ padding: '12px 18px', fontFamily: 'var(--tp-font-mono)', color: '#FCA5A5' }}>
                  {row.beforePatch}
                </td>
                <td style={{ padding: '12px 18px', fontFamily: 'var(--tp-font-mono)', color: '#86EFAC', fontWeight: 600 }}>
                  {row.afterPatch}
                </td>
                <td style={{ padding: '12px 18px', fontFamily: 'var(--tp-font-mono)', color: '#22D3EE', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ArrowDownRight size={14} color="#22D3EE" />
                    <span>{row.improvement}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
