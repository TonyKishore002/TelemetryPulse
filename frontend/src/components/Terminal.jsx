import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ShieldCheck, Play, RotateCcw, CheckCircle, Zap } from 'lucide-react';
import { mockTerminalLogs } from '../data/mockData';

export default function Terminal({ onComplete }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    // Initial load: show all logs
    setDisplayedLogs(mockTerminalLogs);
  }, []);

  const replayLogs = () => {
    setDisplayedLogs([]);
    setIsStreaming(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < mockTerminalLogs.length) {
        setDisplayedLogs((prev) => [...prev, mockTerminalLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        if (onComplete) onComplete();
      }
    }, 120);
  };

  const filteredLogs = displayedLogs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LOAD TEST') return log.text.includes('Task A');
    if (activeFilter === 'UNIT TESTS') return log.text.includes('Task B');
    if (activeFilter === 'SAST') return log.text.includes('Task C') || log.text.includes('Security');
    return true;
  });

  return (
    <div className="tp-card" style={{ padding: '24px', marginBottom: '24px', background: '#0B111D' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TerminalIcon size={16} color="#22D3EE" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              BOBSHELL SANDBOX RUNTIME: VERIFICATION CONSOLE
            </span>
            <span className="tp-badge-cyan">CONTAINER: bobshell-sandbox-82931</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            FEATURE #3: Parallel Execution Gates (Load Test &bull; Unit Tests &bull; SAST Vulnerability Scanner)
          </div>
        </div>

        {/* Action Controls & Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', padding: '2px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {['ALL', 'LOAD TEST', 'UNIT TESTS', 'SAST'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  background: activeFilter === tab ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  color: activeFilter === tab ? '#22D3EE' : '#94A3B8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '10.5px',
                  fontFamily: 'var(--tp-font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={replayLogs}
            disabled={isStreaming}
            className="tp-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', fontFamily: 'var(--tp-font-mono)' }}
          >
            <RotateCcw size={12} />
            <span>{isStreaming ? 'STREAMING...' : 'REPLAY PIPELINE'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Window Box */}
      <div
        style={{
          background: '#030508',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        {/* Terminal Chrome Bar (Window top strip with 3 dots) */}
        <div
          style={{
            background: '#090D14',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '9px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span style={{ marginLeft: '12px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#64748B' }}>
              bobshell@sandbox-isolated:~/telemetrypulse-api$ ./scripts/verify_all.sh
            </span>
          </div>

          <div className="tp-badge-success">
            <ShieldCheck size={12} color="#34D399" />
            <span>SAST SCANNER ACTIVE</span>
          </div>
        </div>

        {/* Monospace Log Lines */}
        <div
          style={{
            padding: '18px 20px',
            maxHeight: '320px',
            minHeight: '220px',
            overflowY: 'auto',
            fontFamily: 'var(--tp-font-mono)',
            fontSize: '11.5px',
            lineHeight: '1.75',
            color: '#E2E8F0',
            background: '#030508'
          }}
          className="tp-scroll scrollbar-thin scrollbar-thumb-slate-800"
        >
          {filteredLogs.map((log, index) => {
            let textColor = '#CBD5E1';
            let bg = 'transparent';

            if (log.text.includes('PASSED') || log.text.includes('✓') || log.text.includes('Clean')) {
              textColor = '#34D399';
            } else if (log.text.includes('Task A')) {
              textColor = '#38BDF8';
            } else if (log.text.includes('Task B')) {
              textColor = '#A78BFA';
            } else if (log.text.includes('Task C') || log.text.includes('SAST')) {
              textColor = '#FBBF24';
            } else if (log.text.includes('✅ ALL 3 VERIFICATION GATES PASSED')) {
              textColor = '#34D399';
              bg = 'rgba(16, 185, 129, 0.1)';
            }

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  background: bg,
                  padding: '2px 4px',
                  borderRadius: '3px'
                }}
              >
                <span style={{ color: '#475569', userSelect: 'none', fontSize: '10px', minWidth: '55px' }}>
                  {log.time}
                </span>
                <span style={{ color: textColor }}>{log.text}</span>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* 3 Parallel Verification Verification Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
        <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--tp-font-mono)' }}>TASK A: LOAD TEST</span>
            <CheckCircle size={14} color="#22C55E" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>420ms Latency</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>P95 dropped from 4,800ms (500 vUsers)</div>
        </div>

        <div style={{ background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.25)', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#A78BFA', fontFamily: 'var(--tp-font-mono)' }}>TASK B: UNIT TESTS</span>
            <CheckCircle size={14} color="#22C55E" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>24/24 Passed</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>pytest &amp; regression suite 100% green</div>
        </div>

        <div style={{ background: 'rgba(253, 224, 71, 0.05)', border: '1px solid rgba(253, 224, 71, 0.25)', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#FDE047', fontFamily: 'var(--tp-font-mono)' }}>TASK C: SAST GATE</span>
            <CheckCircle size={14} color="#22C55E" />
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>0 Security Flaws</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Bandit scanner: SQL Injection clean</div>
        </div>
      </div>
    </div>
  );
}
