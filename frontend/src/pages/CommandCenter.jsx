import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Layers,
  CheckCircle,
  Clock,
  Database,
  Radio,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react';
import WorkstationShell from '../components/WorkstationShell';
import TelemetryFlow from '../components/TelemetryFlow';
import SignalGraph from '../components/SignalGraph';
import Skeleton, { SkeletonMetrics } from '../components/Skeleton';
import ErrorBoundary from '../components/ErrorBoundary';
import LiveBadge from '../components/LiveBadge';
import { useIncidentMetrics } from '../hooks/useIncidentMetrics';
import { useOrdersLive } from '../hooks/useOrdersLive';
import { mockIncident } from '../data/mockData';

export default function CommandCenter() {
  const navigate = useNavigate();
  const { metrics, loading: mLoading, error: mError, remeasure } = useIncidentMetrics();
  const { orders, telemetry: ordersTelem, loading: oLoading, error: oError, refetch } = useOrdersLive();

  // Derive display values: live when available, static fallback otherwise
  const latencyDisplay = metrics?.latencyDisplay ?? mockIncident.metrics.latency;
  const dbQueriesDisplay = metrics?.dbQueries ?? mockIncident.metrics.dbQueries;
  const errorRateDisplay = metrics?.errorRate ?? mockIncident.metrics.errorRate;
  const traceId = metrics?.traceId ?? mockIncident.traceId;
  const detectedDuration = metrics?.detectedDuration ?? mockIncident.detectedDuration;
  const dataSource = metrics?.source ?? 'STATIC_FALLBACK';

  const totalOrders = ordersTelem?.total_orders ?? orders.length;
  const totalItems = ordersTelem?.total_items ?? 0;
  const payloadKb = ordersTelem?.payload_bytes ? (ordersTelem.payload_bytes / 1024).toFixed(1) : null;

  return (
    <WorkstationShell
      pageTitle="COMMAND CENTER"
      subtitle="01 • Incident Triage &amp; Telemetry Signal Stream"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HERO SECTION */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '6px' }}>
              <span className="tp-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22D3EE' }} />
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#22D3EE', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--tp-font-mono)' }}>
                Autonomous SRE Control Center
              </span>
            </div>
            <LiveBadge source={dataSource} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.025em', margin: 0, fontFamily: 'var(--tp-font-sans)' }}>
            AUTONOMOUS TELEMETRY → CODE
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94A3B8', marginTop: '6px', maxWidth: '740px', lineHeight: '1.625' }}>
            Turn production incidents into verified code fixes. Ingest APM traces, correlate AST dependencies, and benchmark fixes before merging.
          </p>
        </div>

        {/* SYSTEM PIPELINE BAR */}
        <div
          className="tp-card"
          style={{
            padding: '16px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0B111D',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SRE Remediation Pipeline:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {mockIncident.pipelineSteps.map((step, idx) => {
              let color = '#64748B';
              let symbol = '○ READY';
              let isPulse = false;

              if (step.status === 'COMPLETE') {
                color = '#34D399';
                symbol = '✓ COMPLETE';
              } else if (step.status === 'ACTIVE') {
                color = '#22D3EE';
                symbol = '◉ ACTIVE';
                isPulse = true;
              }

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isPulse ? (
                      <span className="tp-pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                    ) : (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                    )}
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '0.04em' }}>
                      {step.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--tp-font-mono)', fontWeight: 600, color: color, background: `${color}18`, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${color}33` }}>
                    {symbol}
                  </span>
                  {idx < mockIncident.pipelineSteps.length - 1 && (
                    <span style={{ color: 'rgba(255, 255, 255, 0.15)', marginLeft: '12px' }}>➔</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ARCHITECTURAL FLOW */}
        <TelemetryFlow />

        {/* PRIMARY INCIDENT CARD & FINOPS ROI CARD GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '20px', marginBottom: '24px' }}>
          {/* PRIMARY INCIDENT CARD */}
          <div
            className="tp-card"
            style={{
              padding: '24px',
              borderLeft: '4px solid #F87171',
              background: '#0B111D',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeftColor: '#F87171',
              borderRadius: '8px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="tp-badge-critical">CRITICAL INCIDENT</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#64748B' }}>
                    ID: {mockIncident.id}
                  </span>
                  {mLoading ? (
                    <Skeleton width="80px" height="12px" />
                  ) : (
                    <span style={{ fontSize: '11px', color: '#64748B' }}>&bull; {detectedDuration}</span>
                  )}
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC', margin: 0, fontFamily: 'var(--tp-font-sans)' }}>
                  {mockIncident.title}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Live remeasure button */}
                <button
                  onClick={remeasure}
                  disabled={mLoading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '10.5px',
                    color: mLoading ? '#475569' : '#94A3B8',
                    cursor: mLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--tp-font-mono)',
                  }}
                  title="Re-measure live latency"
                >
                  <RefreshCw size={11} style={{ animation: mLoading ? 'spin 1s linear infinite' : 'none' }} />
                  {mLoading ? 'Measuring...' : 'Remeasure'}
                </button>
                <button
                  onClick={() => navigate('/investigation')}
                  className="tp-btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  <span>INVESTIGATE INCIDENT</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Error boundary for metrics */}
            <ErrorBoundary error={mError} onRetry={remeasure} label="Live telemetry stream">
              <>
                {/* Incident Route & Trace details */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '10px 14px',
                    background: '#030508',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    marginBottom: '18px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--tp-font-mono)',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748B' }}>Endpoint: </span>
                    <span style={{ color: '#F87171', fontWeight: 600 }}>{mockIncident.endpoint}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Status: </span>
                    <span style={{ color: metrics?.httpStatus === 200 ? '#34D399' : '#F87171', fontWeight: 600 }}>
                      {metrics?.httpStatus === 200 ? '200 OK (Fixed)' : mockIncident.statusText}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Trace ID: </span>
                    {mLoading ? <Skeleton width="120px" height="11px" style={{ display: 'inline-block' }} /> : (
                      <span style={{ color: '#22D3EE', fontWeight: 600 }}>{traceId}</span>
                    )}
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Cluster: </span>
                    <span style={{ color: '#94A3B8' }}>{mockIncident.cluster}</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                {mLoading ? <SkeletonMetrics count={3} /> : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '10.5px', color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        Measured Latency
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#F87171', marginTop: '2px' }}>
                        {latencyDisplay}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(248, 113, 113, 0.8)', marginTop: '2px' }}>
                        Threshold SLA: 500ms
                      </div>
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '10.5px', color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        DB Queries Per Request
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#FBBF24', marginTop: '2px' }}>
                        {dbQueriesDisplay}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(251, 191, 36, 0.8)', marginTop: '2px' }}>
                        {dbQueriesDisplay === 1 ? '✓ Batched — N+1 eliminated' : 'N+1 Loop: 1 query expected'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '10.5px', color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        HTTP 504 Error Rate
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#F87171', marginTop: '2px' }}>
                        {errorRateDisplay}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(248, 113, 113, 0.8)', marginTop: '2px' }}>
                        Customer checkouts failing
                      </div>
                    </div>
                  </div>
                )}
              </>
            </ErrorBoundary>

            {/* Live orders data stream bar */}
            {!oLoading && !oError && ordersTelem && (
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '10.5px', fontFamily: 'var(--tp-font-mono)', color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ color: '#34D399' }}>● LIVE STREAM</span>
                <span>{totalOrders} orders</span>
                <span>{totalItems} items</span>
                {payloadKb && <span>{payloadKb} KB payload</span>}
                <span>{ordersTelem.execution_time_ms}ms round-trip</span>
                <button onClick={refetch} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontFamily: 'var(--tp-font-mono)' }}>
                  <RefreshCw size={10} /> refresh
                </button>
              </div>
            )}
          </div>

          {/* FINOPS ROI CARD */}
          <div
            className="tp-card"
            style={{
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0B111D',
              borderRadius: '8px',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={16} color="#34D399" />
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
                    FEATURE #1: FINOPS COST SAVINGS
                  </span>
                </div>
                <div className="tp-badge-success">
                  {mockIncident.finops.roiMultiplier} ROI
                </div>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC', marginBottom: '14px' }}>
                Autonomous Remediation Cost Benefit
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Agent Run Cost</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#22D3EE', marginTop: '2px' }}>
                    {mockIncident.finops.agentExecutionCost}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#64748B', marginTop: '2px' }}>Bob AI LLM inference</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: '#34D399', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Estimated Savings</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#34D399', marginTop: '2px' }}>
                    {mockIncident.finops.estimatedMonthlySavings}
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#34D399', marginTop: '2px' }}>Downsized RDS Tier</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', lineHeight: '1.625', color: '#94A3B8', background: '#030508', padding: '12px 14px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {mockIncident.finops.calculationDetails}
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#34D399', fontFamily: 'var(--tp-font-mono)', fontWeight: 600 }}>
              <span>✓ Carbon Footprint Reduction: -64 kg CO2e/mo</span>
            </div>
          </div>
        </div>

        {/* TELEMETRY SIGNAL GRAPH */}
        <SignalGraph />
      </div>

      {/* CSS for spin animation on refresh icon */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </WorkstationShell>
  );
}
