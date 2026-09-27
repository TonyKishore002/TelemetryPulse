import React, { useState } from 'react';
import { Clock, Database, Layers, AlertCircle, ChevronDown, ChevronRight, Server } from 'lucide-react';
import { mockTraceSpans } from '../data/mockData';

// TelemetryPulse - Distributed Trace Waterfall Graph
export default function TraceGraph() {
  const [selectedSpan, setSelectedSpan] = useState(mockTraceSpans[1]);
  const [expanded, setExpanded] = useState(true);

  // Total duration is 4800ms
  const totalDuration = 4800;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="#22D3EE" />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: '#F8FAFC' }}>
              DISTRIBUTED TRACE WATERFALL: trace-82931
            </span>
            <span className="tp-badge-cyan">101 SPANS CORRELATED</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            OpenTelemetry Ingestion &bull; Root span exceeded 4.8s due to sequential database calls
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="tp-badge-critical" style={{ fontSize: '11px', fontFamily: 'var(--tp-font-mono)' }}>
            N+1 PATTERN DETECTED
          </div>
        </div>
      </div>

      {/* Waterfall Visualizer */}
      <div
        style={{
          background: '#030508',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Timeline Axis */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: '#090D14',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '10.5px',
            fontFamily: 'var(--tp-font-mono)',
            color: '#94A3B8'
          }}
        >
          <span>0ms (HTTP Request Ingress)</span>
          <span>1,200ms</span>
          <span>2,400ms</span>
          <span>3,600ms</span>
          <span>4,800ms (504 Timeout Threshold)</span>
        </div>

        {/* Spans List */}
        <div style={{ maxHeight: '320px', overflowY: 'auto' }} className="scrollbar-thin scrollbar-thumb-slate-800 tp-scroll">
          {mockTraceSpans.map((span) => {
            const isSelected = selectedSpan?.id === span.id;
            const leftPercent = (span.startTime / totalDuration) * 100;
            const widthPercent = Math.max((span.duration / totalDuration) * 100, 1.5);

            let barColor = '#22D3EE';
            if (span.type === 'db-n1' || span.type === 'db-n1-grouped') {
              barColor = '#F87171';
            } else if (span.type === 'application') {
              barColor = '#818CF8';
            } else if (span.type === 'http') {
              barColor = '#FBBF24';
            }

            return (
              <div
                key={span.id}
                onClick={() => setSelectedSpan(span)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '280px 1fr 90px',
                  alignItems: 'center',
                  padding: '10px 18px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Span Name & Service */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  {span.type.startsWith('db') ? (
                    <Database size={13} color={barColor} style={{ flexShrink: 0 }} />
                  ) : (
                    <Server size={13} color={barColor} style={{ flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--tp-font-mono)',
                      color: isSelected ? '#22D3EE' : '#F8FAFC',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={span.name}
                  >
                    {span.name}
                  </span>
                </div>

                {/* Waterfall Gantt Bar */}
                <div style={{ position: 'relative', height: '14px', width: '100%', margin: '0 12px' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      height: '100%',
                      background: barColor,
                      borderRadius: '3px',
                      boxShadow: span.type.startsWith('db-n1') ? '0 0 10px rgba(248, 113, 113, 0.3)' : 'none',
                      opacity: 0.9
                    }}
                  />
                </div>

                {/* Duration */}
                <div style={{ textAlign: 'right', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: barColor, fontWeight: 700 }}>
                  {span.duration}ms
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Span Detail Box */}
      {selectedSpan && (
        <div
          style={{
            marginTop: '16px',
            padding: '14px 18px',
            background: '#030508',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Span Inspector Focus
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 600, fontFamily: 'var(--tp-font-mono)', color: '#F8FAFC', marginTop: '2px' }}>
              {selectedSpan.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '11.5px', fontFamily: 'var(--tp-font-mono)' }}>
            <div>
              <span style={{ color: '#94A3B8' }}>Location: </span>
              <span style={{ color: '#22D3EE' }}>{selectedSpan.file}</span>
            </div>
            <div>
              <span style={{ color: '#94A3B8' }}>Duration: </span>
              <span style={{ color: '#F87171', fontWeight: 700 }}>{selectedSpan.duration}ms</span>
            </div>
            <div>
              <span style={{ color: '#94A3B8' }}>Service: </span>
              <span style={{ color: '#F8FAFC' }}>{selectedSpan.service}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
