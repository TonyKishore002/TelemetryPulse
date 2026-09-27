import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Database, Zap, Clock } from 'lucide-react';

export default function SignalGraph() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Synthetic telemetry waveform coordinates showing the incident latency spike
  const points = [
    { x: 0, y: 120 },
    { x: 40, y: 118 },
    { x: 80, y: 122 },
    { x: 120, y: 115 },
    { x: 160, y: 125 },
    { x: 200, y: 119 },
    { x: 240, y: 110 },
    { x: 280, y: 85 },
    { x: 320, y: 35 },   // SPIKE START
    { x: 360, y: 15 },   // PEAK (4.8s LATENCY SPIKE)
    { x: 400, y: 18 },   // PLATEAU AT TIMEOUT
    { x: 440, y: 22 },
    { x: 480, y: 20 },
    { x: 520, y: 25 },
    { x: 560, y: 22 },
    { x: 600, y: 24 }
  ];

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L 600 150 L 0 150 Z`;

  return (
    <div className="tp-card" style={{ padding: '24px', background: '#0B111D', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#F87171" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              REAL-TIME TELEMETRY SIGNAL STREAM
            </span>
            <span className="tp-badge-critical">CRITICAL SPIKE</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
            Instana OTLP Stream &bull; Ingress Gateway Latency &bull; Sample window: Last 10 minutes
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#64748B' }}>
          <span className="tp-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F87171' }} />
          <span>SAMPLING RATE: 100ms</span>
        </div>
      </div>

      {/* 4 Core Telemetry Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
        <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>
            <span>Throughput</span>
            <Zap size={14} color="#22D3EE" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#22D3EE' }}>
            1,284 <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}>req/s</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '3px' }}>Normal Baseline: 1,200 req/s</div>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#F87171', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>
            <span>P95 Latency</span>
            <Clock size={14} color="#F87171" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#F87171' }}>
            4.8s <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(248, 113, 113, 0.8)' }}>[SLA: 500ms]</span>
          </div>
          <div style={{ fontSize: '10px', color: '#F87171', marginTop: '3px' }}>+860% Spike above threshold</div>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#F87171', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>
            <span>Error Rate</span>
            <AlertTriangle size={14} color="#F87171" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#F87171' }}>
            18.4% <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(248, 113, 113, 0.8)' }}>HTTP 504</span>
          </div>
          <div style={{ fontSize: '10px', color: '#F87171', marginTop: '3px' }}>Gateway timeouts escalating</div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FBBF24', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>
            <span>Postgres DB Load</span>
            <Database size={14} color="#FBBF24" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--tp-font-mono)', color: '#FBBF24' }}>
            92% <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(251, 191, 36, 0.8)' }}>Conn Pool</span>
          </div>
          <div style={{ fontSize: '10px', color: '#FBBF24', marginTop: '3px' }}>98/100 pooled connections tied up</div>
        </div>
      </div>

      {/* SVG Waveform Visualization */}
      <div
        style={{
          height: '140px',
          width: '100%',
          background: '#030508',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 14px', pointerEvents: 'none' }}>
          <div style={{ borderBottom: '1px dashed rgba(239, 68, 68, 0.3)', display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--tp-font-mono)', color: '#EF4444' }}>
            <span>CRITICAL SLA TIMEOUT LIMIT (5.0s)</span>
            <span>5000ms</span>
          </div>
          <div style={{ borderBottom: '1px dashed rgba(245, 158, 11, 0.25)', display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--tp-font-mono)', color: '#F59E0B' }}>
            <span>WARNING THRESHOLD (2.0s)</span>
            <span>2000ms</span>
          </div>
          <div style={{ borderBottom: '1px dashed rgba(34, 197, 94, 0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--tp-font-mono)', color: '#22C55E' }}>
            <span>NORMAL TARGET BASELINE (400ms)</span>
            <span>400ms</span>
          </div>
        </div>

        <svg viewBox="0 0 600 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="latencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#EF4444" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill="url(#latencyGradient)" />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Live pulsing coordinate marker on current peak */}
          <circle cx="360" cy="15" r="5" fill="#EF4444" />
          <circle cx="360" cy="15" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="5;14;5" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* Label callout */}
          <rect x="375" y="8" width="130" height="22" rx="4" fill="#0D131D" stroke="#EF4444" strokeWidth="1" />
          <text x="382" y="23" fill="#F8FAFC" fontSize="10" fontFamily="var(--tp-font-mono)" fontWeight="700">
            P95: 4.8s (101 DB calls)
          </text>
        </svg>
      </div>
    </div>
  );
}
