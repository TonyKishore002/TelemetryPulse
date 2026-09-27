import React, { useState, useEffect } from 'react';
import { Code, Check, CheckCircle2, AlertTriangle, ShieldCheck, MessageSquare, ArrowRight, Lock, RefreshCw } from 'lucide-react';
import { mockCodeDiff } from '../data/mockData';
import { useSlackGate } from '../hooks/useSlackGate';
import ErrorBoundary from './ErrorBoundary';
import Skeleton from './Skeleton';

export default function CodeEditor({ isApproved, onApprove, onProceed }) {
  const [showSlackModal, setShowSlackModal] = useState(false);
  const { gate, loading: gateLoading, error: gateError, approve, submitPlan, refetch } = useSlackGate();

  // Sync external isApproved with gate state from server
  const serverApproved = gate?.status === 'APPROVED';
  const effectiveApproved = isApproved || serverApproved;

  // When the server transitions to APPROVED, also fire the parent callback
  useEffect(() => {
    if (serverApproved && !isApproved) {
      onApprove?.();
    }
  }, [serverApproved, isApproved, onApprove]);

  const handleApprove = async () => {
    onApprove?.();
    await approve();
  };

  return (
    <div className="tp-card" style={{ padding: '24px', marginBottom: '24px', background: '#0B111D' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={16} color="#22D3EE" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              AUTONOMOUS SYNTHESIZED REFACTOR &amp; AST PATCH
            </span>
            <span className="tp-badge-cyan">{mockCodeDiff.file}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            Batch query optimization &bull; In-memory O(N) grouping
          </div>
        </div>

        {/* Diff KPI Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="tp-badge-critical">
            {mockCodeDiff.queryReduction}
          </div>
          <div className="tp-badge-success">
            {mockCodeDiff.estimatedLatency}
          </div>
        </div>
      </div>

      {/* Code Diff Display */}
      <div
        style={{
          background: '#030508',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#090D14', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '9px 16px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)' }}>
          <div style={{ color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <span>🔴 BEFORE: Sequential N+1 Database Query Loop (orderController.js:42)</span>
          </div>
          <div style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '16px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 600 }}>
            <span>🟢 AFTER: Batched ANY($1) Array Lookup + In-Memory Map (O(N))</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxHeight: '380px', overflowY: 'auto' }} className="tp-scroll scrollbar-thin scrollbar-thumb-slate-800">
          {/* Before Column */}
          <div style={{ padding: '16px 14px', fontFamily: 'var(--tp-font-mono)', fontSize: '11px', lineHeight: '1.65', background: '#030508' }}>
            {mockCodeDiff.beforeLines.map((line, idx) => {
              const isBottleneck = line.includes('❌') || line.includes('SELECT * FROM order_items') || line.includes('for (const order');
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    background: isBottleneck ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                    color: isBottleneck ? '#F87171' : '#94A3B8',
                    borderLeft: isBottleneck ? '2px solid #F87171' : '2px solid transparent',
                    padding: '2px 6px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}
                >
                  <span style={{ width: '28px', color: '#475569', userSelect: 'none', textAlign: 'right', marginRight: '12px' }}>
                    {idx + 35}
                  </span>
                  <span>{line}</span>
                </div>
              );
            })}
          </div>

          {/* After Column */}
          <div style={{ padding: '16px 14px', fontFamily: 'var(--tp-font-mono)', fontSize: '11px', lineHeight: '1.65', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', background: '#030508' }}>
            {mockCodeDiff.afterLines.map((line, idx) => {
              const isFix = line.includes('✅') || line.includes('ANY($1)') || line.includes('itemsByOrderId') || line.includes('enrichedOrders');
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    background: isFix ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                    color: isFix ? '#34D399' : '#94A3B8',
                    borderLeft: isFix ? '2px solid #34D399' : '2px solid transparent',
                    padding: '2px 6px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}
                >
                  <span style={{ width: '28px', color: '#475569', userSelect: 'none', textAlign: 'right', marginRight: '12px' }}>
                    {idx + 35}
                  </span>
                  <span>{line}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FEATURE #2: SLACK APPROVAL GATE BANNER — wired to Flask /slack/action/approve */}
      <ErrorBoundary error={gateError} onRetry={refetch} label="Slack gate">
        <div
          style={{
            background: effectiveApproved ? 'rgba(16, 185, 129, 0.06)' : 'rgba(99, 102, 241, 0.06)',
            border: `1px solid ${effectiveApproved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            borderRadius: '8px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: effectiveApproved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {effectiveApproved ? <ShieldCheck size={22} color="#22C55E" /> : <MessageSquare size={22} color="#6366F1" />}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                FEATURE #2: HUMAN-IN-THE-LOOP SLACK APPROVAL GATE
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tp-text-muted)', marginTop: '2px' }}>
                {effectiveApproved
                  ? `✓ Refactor approved${gate?.approver ? ` by ${gate.approver}` : ''}. BobShell Sandbox verification unlocked.`
                  : 'Safety Protocol: Autonomous execution paused. Requires explicit human engineer sign-off.'}
              </div>
              {/* Live gate status from Flask */}
              {gate && (
                <div style={{ fontSize: '10.5px', fontFamily: 'var(--tp-font-mono)', color: '#475569', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Flask Gate:</span>
                  <span style={{ color: gate.status === 'APPROVED' ? '#34D399' : gate.status === 'REJECTED' ? '#F87171' : '#FBBF24' }}>
                    {gate.status}
                  </span>
                  {gate.approved_at && <span>• {new Date(gate.approved_at).toLocaleTimeString()}</span>}
                  <button
                    onClick={refetch}
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', fontFamily: 'var(--tp-font-mono)', padding: 0 }}
                  >
                    <RefreshCw size={9} /> sync
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!effectiveApproved ? (
              <>
                <button
                  onClick={() => setShowSlackModal(true)}
                  className="tp-btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  <MessageSquare size={14} color="#6366F1" />
                  <span>Review Slack Strategy Plan</span>
                </button>
                <button
                  onClick={handleApprove}
                  disabled={gateLoading}
                  className="tp-btn-success"
                  style={{ fontSize: '12px', opacity: gateLoading ? 0.6 : 1 }}
                >
                  {gateLoading ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                  <span>🟢 APPROVE REFACTOR</span>
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="tp-badge-success">
                  <CheckCircle2 size={13} color="#22C55E" />
                  <span>APPROVED VIA #SRE-ALERTS</span>
                </div>
                <button
                  onClick={onProceed}
                  className="tp-btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  <span>RUN REFACTOR &amp; VERIFY →</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>

      {/* SLACK MODAL POPUP */}
      {showSlackModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setShowSlackModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#0D131D',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#4A154B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={16} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                    Slack Refactor Proposal: #incident-504
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--tp-text-muted)' }}>
                    Posted by Bob AI Autonomous SRE Bot
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSlackModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            {/* Live gate proposal from Flask */}
            {gate?.proposed_plan && (
              <div style={{ background: '#05070B', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '6px', padding: '12px 14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#34D399', marginBottom: '6px', fontFamily: 'var(--tp-font-mono)' }}>
                  FLASK GATE PROPOSAL (LIVE)
                </div>
                <div style={{ fontSize: '11.5px', color: '#E2E8F0', lineHeight: '1.6' }}>
                  <b>{gate.proposed_plan.title}</b><br />
                  {gate.proposed_plan.description}<br />
                  Latency: <span style={{ color: '#34D399' }}>{gate.proposed_plan.projected_latency_drop}</span><br />
                  Savings: <span style={{ color: '#22D3EE' }}>{gate.proposed_plan.finops_savings}</span>
                </div>
              </div>
            )}

            {/* 3-Line Markdown Strategy Plan */}
            <div style={{ background: '#05070B', border: '1px solid var(--tp-border)', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#22D3EE', marginBottom: '8px', fontFamily: 'var(--tp-font-mono)' }}>
                ### 3-LINE PROPOSED REFACTOR PLAN:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#E2E8F0', lineHeight: '1.5' }}>
                {mockCodeDiff.slackPlan.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#22D3EE', fontFamily: 'var(--tp-font-mono)' }}>&bull;</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowSlackModal(false)}
                className="tp-btn-secondary"
                style={{ fontSize: '12px' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApprove();
                  setShowSlackModal(false);
                }}
                disabled={gateLoading}
                className="tp-btn-success"
                style={{ fontSize: '12px', opacity: gateLoading ? 0.6 : 1 }}
              >
                <Check size={14} />
                <span>🟢 APPROVE REFACTOR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
