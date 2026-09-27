import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Database,
  AlertTriangle,
  Server,
  Bot,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  RefreshCw,
} from 'lucide-react';
import WorkstationShell from '../components/WorkstationShell';
import TraceGraph from '../components/TraceGraph';
import RootCauseCard from '../components/RootCauseCard';
import CodeEditor from '../components/CodeEditor';
import Skeleton from '../components/Skeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import LiveBadge from '../components/LiveBadge';
import { useIncidentMetrics } from '../hooks/useIncidentMetrics';
import { mockIncident, mockAiAgents } from '../data/mockData';

export default function Investigation() {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);
  const { metrics, loading, error, remeasure } = useIncidentMetrics();

  const latency = metrics?.latencyDisplay ?? '4.8s';
  const dbQueries = metrics?.dbQueries ?? 101;
  const errorRate = metrics?.errorRate ?? '18.4%';
  const httpStatus = metrics?.httpStatus ?? 504;

  return (
    <WorkstationShell
      pageTitle="INVESTIGATION"
      subtitle="02 • Trace Waterfall &amp; AST Root Cause Analysis"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* TOP NAVIGATION & HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/command-center')}
              className="tp-btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <ArrowLeft size={14} />
              <span>COMMAND CENTER</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                  INC-504-001 (GET /api/orders)
                </h1>
                <span className="tp-badge-critical">
                  504 GATEWAY TIMEOUT
                </span>
                <LiveBadge source={metrics?.source ?? 'STATIC_FALLBACK'} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--tp-text-muted)', marginTop: '2px' }}>
                Correlated with OpenTelemetry {metrics?.traceId ?? 'trace-82931'} &bull; {dbQueries} Sequential Queries Detected
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={remeasure}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '10.5px',
                color: loading ? '#475569' : '#94A3B8',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--tp-font-mono)',
              }}
            >
              <RefreshCw size={11} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Measuring...' : 'Live Probe'}
            </button>
            <button
              onClick={() => {
                if (!isApproved) {
                  setIsApproved(true);
                } else {
                  navigate('/verification');
                }
              }}
              className="tp-btn-primary"
              style={{ fontSize: '13px' }}
            >
              <span>{isApproved ? 'RUN REFACTOR & VERIFY' : 'APPROVE & PROCEED'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* METRICS BANNER */}
        <ErrorBoundary error={error} onRetry={remeasure} label="Live incident metrics">
          <div
            className="tp-card"
            style={{
              padding: '20px 24px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              background: '#0B111D',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="#F87171" />
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>Measured Latency</div>
                {loading ? <Skeleton width="60px" height="20px" style={{ marginTop: '4px' }} /> : (
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#F87171', marginTop: '2px' }}>
                    {latency}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#FBBF24" />
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>DB Queries</div>
                {loading ? <Skeleton width="40px" height="20px" style={{ marginTop: '4px' }} /> : (
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#FBBF24', marginTop: '2px' }}>
                    {dbQueries}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} color="#F87171" />
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>Error Rate</div>
                {loading ? <Skeleton width="50px" height="20px" style={{ marginTop: '4px' }} /> : (
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#F87171', marginTop: '2px' }}>
                    {errorRate}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={18} color="#F87171" />
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>HTTP Status</div>
                {loading ? <Skeleton width="50px" height="20px" style={{ marginTop: '4px' }} /> : (
                  <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: httpStatus === 200 ? '#34D399' : '#F87171', marginTop: '2px' }}>
                    {httpStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ErrorBoundary>

        {/* TRACE WATERFALL GRAPH */}
        <TraceGraph />

        {/* AI AGENTS PANEL */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} color="#818CF8" />
              <span style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }}>
                BOB AI MULTI-AGENT TRIAGE CONSORTIUM
              </span>
            </div>
            <span className="tp-badge-cyan">
              5 SPECIALIZED AGENTS ONLINE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
            {mockAiAgents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  background: '#030508',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                      {agent.name}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontFamily: 'var(--tp-font-mono)',
                        color: agent.color === '#EF4444' ? '#F87171' : agent.color === '#F59E0B' ? '#FBBF24' : agent.color === '#22C55E' ? '#34D399' : '#22D3EE',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}
                    >
                      {agent.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '10px' }}>
                    {agent.role}
                  </div>
                </div>
                <div style={{ fontSize: '11px', lineHeight: '1.6', color: '#CBD5E1', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                  {agent.findings}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROOT CAUSE CARD */}
        <RootCauseCard />

        {/* FEATURE #2: INTERACTIVE SLACK APPROVAL GATE & MONOSPACE CODE DIFF */}
        <CodeEditor
          isApproved={isApproved}
          onApprove={() => setIsApproved(true)}
          onProceed={() => navigate('/verification')}
        />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </WorkstationShell>
  );
}
