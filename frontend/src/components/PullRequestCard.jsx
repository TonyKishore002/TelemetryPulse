import React, { useState } from 'react';
import { GitPullRequest, GitBranch, GitCommit, CheckCircle2, ShieldAlert, ExternalLink, ArrowRight } from 'lucide-react';
import { mockPullRequest } from '../data/mockData';

export default function PullRequestCard() {
  const [created, setCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePR = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCreated(true);
    }, 700);
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
            <GitPullRequest size={16} color="#22D3EE" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: '#F8FAFC' }}>
              SOURCE CODE REPOSITORY &amp; PULL REQUEST DISPATCH
            </span>
            <span className="tp-badge-cyan">{mockPullRequest.repo}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            Stage verified AST changes &bull; Enforce safety governance gate
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#94A3B8' }}>
            <GitBranch size={13} color="#818CF8" />
            <span>branch: </span>
            <span style={{ color: '#22D3EE' }}>{mockPullRequest.branch}</span>
          </div>
        </div>
      </div>

      {/* Main PR Body */}
      <div
        style={{
          background: '#030508',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '20px 22px',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>
                {mockPullRequest.prTitle}
              </span>
              {created && (
                <span className="tp-badge-success">
                  PR #{mockPullRequest.prNumber} OPEN
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#94A3B8', display: 'flex', gap: '20px' }}>
              <span>Base: <strong style={{ color: '#F8FAFC' }}>{mockPullRequest.baseBranch}</strong></span>
              <span>Head: <strong style={{ color: '#F8FAFC' }}>{mockPullRequest.branch}</strong></span>
              <span>Commit: <strong style={{ color: '#22D3EE' }}>{mockPullRequest.commitHash}</strong></span>
            </div>
          </div>

          {!created ? (
            <button
              onClick={handleCreatePR}
              disabled={isSubmitting}
              className="tp-btn-primary"
              style={{ fontSize: '13px' }}
            >
              <GitPullRequest size={15} />
              <span>{isSubmitting ? 'DISPATCHING TO GITHUB...' : 'CREATE PULL REQUEST'}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="tp-badge-success" style={{ padding: '8px 14px', fontSize: '12px' }}>
                <CheckCircle2 size={15} color="#34D399" />
                <span>✓ PULL REQUEST CREATED (PR #{mockPullRequest.prNumber})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXPLICIT SAFETY GOVERNANCE BANNERS */}
      {created && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Banner 1: Ready for Human Review */}
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '8px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={18} color="#22D3EE" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#22D3EE', letterSpacing: '0.04em' }}>
                  READY FOR HUMAN REVIEW
                </span>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  PR #{mockPullRequest.prNumber} assigned to Tony (SRE Lead) &bull; Awaiting final code review approval
                </div>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '11px',
                color: '#22D3EE',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--tp-font-mono)'
              }}
            >
              <span>View on GitHub</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Banner 2: Auto-deploy Disabled */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <ShieldAlert size={18} color="#F87171" />
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#F87171', letterSpacing: '0.04em' }}>
                AUTO-DEPLOY DISABLED — HUMAN REVIEW REQUIRED
              </span>
              <div style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '2px' }}>
                Safety Policy: SRE safety guardrails prevent automated merging to production. Human engineer review and explicit merge click required.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
