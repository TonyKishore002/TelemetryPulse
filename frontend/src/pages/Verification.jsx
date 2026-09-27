import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, GitPullRequest, RefreshCw } from 'lucide-react';
import WorkstationShell from '../components/WorkstationShell';
import Terminal from '../components/Terminal';
import ExplainAnalyzeDiff from '../components/ExplainAnalyzeDiff';
import MetricComparison from '../components/MetricComparison';
import PostMortemCard from '../components/PostMortemCard';
import PullRequestCard from '../components/PullRequestCard';
import ErrorBoundary from '../components/ErrorBoundary';
import LiveBadge from '../components/LiveBadge';
import Skeleton, { SkeletonMetrics } from '../components/Skeleton';
import { useVerificationResults } from '../hooks/useVerificationResults';

export default function Verification() {
  const navigate = useNavigate();
  const { results, liveLatency, loading, error, rerun } = useVerificationResults();

  // Live values from verification report or live probe
  const batchedMs = liveLatency?.batchedMs ?? results?.tasks?.task_a_benchmark?.metrics?.batched_latency_avg_ms;
  const unbatchedMs = results?.tasks?.task_a_benchmark?.metrics?.unbatched_latency_avg_ms;
  const reductionPct = results?.tasks?.task_a_benchmark?.metrics?.latency_reduction_pct;
  const speedup = results?.tasks?.task_a_benchmark?.metrics?.speedup_multiplier;
  const roundtripsSaved = results?.tasks?.task_a_benchmark?.metrics?.roundtrips_eliminated;
  const verifyId = results?.verification_id;
  const overallStatus = results?.overall_status;

  return (
    <WorkstationShell
      pageTitle="VERIFICATION"
      subtitle="03 • BobShell Sandbox Validation &amp; Safety Governance"
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/investigation')}
              className="tp-btn-secondary"
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              <ArrowLeft size={14} />
              <span>INVESTIGATION</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.025em', color: '#F8FAFC', margin: 0 }}>
                  AUTONOMOUS VERIFICATION
                </h1>
                <div className="tp-badge-success">
                  <CheckCircle2 size={13} color="#34D399" />
                  <span>VERIFICATION COMPLETE</span>
                </div>
                {liveLatency && <LiveBadge source="LIVE_MEASUREMENT" />}
                {!liveLatency && !loading && <LiveBadge source="STATIC_FALLBACK" />}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                Sandboxed BobShell Isolation Container &bull; Load Benchmarking &bull; SAST Vulnerability Clearance
                {verifyId && <span style={{ marginLeft: '8px', color: '#475569' }}>• {verifyId}</span>}
              </div>
            </div>
          </div>

          {/* Live rerun button */}
          <button
            onClick={rerun}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '11px',
              color: loading ? '#475569' : '#94A3B8',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--tp-font-mono)',
            }}
          >
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Probing...' : 'Live Probe'}
          </button>
        </div>

        {/* LIVE VERIFICATION BANNER */}
        {(batchedMs || unbatchedMs || reductionPct) && (
          <ErrorBoundary error={error} onRetry={rerun} label="Verification report stream">
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '14px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                fontSize: '11.5px',
                fontFamily: 'var(--tp-font-mono)',
              }}
            >
              <span style={{ color: '#34D399', fontWeight: 700 }}>● LIVE VERIFICATION REPORT</span>
              {batchedMs !== undefined && (
                <span style={{ color: '#F8FAFC' }}>Batched: <b style={{ color: '#34D399' }}>{batchedMs}ms</b></span>
              )}
              {unbatchedMs !== undefined && (
                <span style={{ color: '#F8FAFC' }}>Unbatched: <b style={{ color: '#F87171' }}>{unbatchedMs}ms</b></span>
              )}
              {reductionPct !== undefined && (
                <span style={{ color: '#F8FAFC' }}>Reduction: <b style={{ color: '#34D399' }}>−{reductionPct}%</b></span>
              )}
              {speedup && (
                <span style={{ color: '#F8FAFC' }}>Speedup: <b style={{ color: '#22D3EE' }}>{speedup}</b></span>
              )}
              {roundtripsSaved !== undefined && (
                <span style={{ color: '#F8FAFC' }}>Roundtrips Saved: <b style={{ color: '#34D399' }}>{roundtripsSaved}</b></span>
              )}
              {liveLatency?.payloadBytes && (
                <span style={{ color: '#64748B' }}>{(liveLatency.payloadBytes / 1024).toFixed(1)} KB live payload</span>
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* VERIFIED PERFORMANCE IMPROVEMENT METRICS */}
        <MetricComparison liveLatency={liveLatency} />

        {/* FEATURE #3: BOBSHELL TERMINAL & SAST SECURITY PROTECTION GATE */}
        <Terminal />

        {/* FEATURE #4: QUERY EXECUTION PLAN DIFF TABLE (EXPLAIN ANALYZE) */}
        <ExplainAnalyzeDiff />

        {/* FEATURE #5: AUTOMATED INCIDENT POST-MORTEM & RUNBOOK GENERATOR */}
        <PostMortemCard />

        {/* PULL REQUEST CARD WITH HUMAN REVIEW GOVERNANCE BANNERS */}
        <PullRequestCard />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </WorkstationShell>
  );
}
