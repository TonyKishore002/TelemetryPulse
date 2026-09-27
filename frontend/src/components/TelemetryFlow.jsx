import React, { useState } from 'react';
import { Radio, ArrowRight, Zap, CheckCircle2, GitPullRequest, Code, Search } from 'lucide-react';

// TelemetryPulse - Autonomous Telemetry Flow Pipeline
export default function TelemetryFlow() {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    { id: 'api', label: 'API', sub: 'GET /orders', status: '504 GATEWAY TIMEOUT', color: '#EF4444', icon: Radio },
    { id: 'trace', label: 'TRACE', sub: 'trace-82931', status: '101 DB SPANS', color: '#F59E0B', icon: Search },
    { id: 'telemetry', label: 'TELEMETRY', sub: 'Instana APM', status: '4.8s LATENCY', color: '#22D3EE', icon: Zap },
    { id: 'bob-ai', label: 'BOB AI', sub: 'Autonomous SRE', status: 'ROOT CAUSE AST', color: '#6366F1', icon: Zap },
    { id: 'source-code', label: 'SOURCE CODE', sub: 'orderController.js', status: 'SYNTHESIZED FIX', color: '#38BDF8', icon: Code },
    { id: 'verified-fix', label: 'VERIFIED FIX', sub: 'BobShell Sandbox', status: 'PR #247 STAGED', color: '#22C55E', icon: CheckCircle2 }
  ];

  return (
    <div
      className="tp-card"
      style={{
        padding: '20px 24px',
        marginBottom: '24px',
        background: '#0B111D',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22D3EE' }} className="tp-pulse-dot" />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
            Autonomous Telemetry-to-Code Pipeline
          </span>
        </div>
        <div className="tp-badge-cyan">
          LIVE PIPELINE: RUNNING
        </div>
      </div>

      {/* SVG Flow Container */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', gap: '10px', flexWrap: 'nowrap', overflowX: 'auto', padding: '4px 0' }} className="tp-scroll scrollbar-thin">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isHovered = activeNode === node.id;
          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{
                  flex: '1 0 140px',
                  minWidth: '140px',
                  background: isHovered ? '#111A29' : '#030508',
                  border: `1px solid ${isHovered ? node.color : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '14px 16px',
                  boxShadow: isHovered ? `0 4px 16px ${node.color}22` : 'none',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: node.color, fontFamily: 'var(--tp-font-mono)' }}>
                    {node.label}
                  </span>
                  <Icon size={14} color={node.color} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#F8FAFC', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {node.sub}
                </div>
                <div
                  style={{
                    fontSize: '9.5px',
                    fontFamily: 'var(--tp-font-mono)',
                    fontWeight: 600,
                    color: node.color,
                    background: `${node.color}15`,
                    border: `1px solid ${node.color}30`,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    letterSpacing: '0.04em'
                  }}
                >
                  {node.status}
                </div>
              </div>

              {/* Connecting Pulse Arrow between nodes */}
              {index < nodes.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '0 2px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '2px',
                      background: `linear-gradient(90deg, ${node.color}88, ${nodes[index + 1].color}88)`,
                      position: 'relative'
                    }}
                  >
                    <div
                      className="tp-pulse-dot"
                      style={{
                        position: 'absolute',
                        right: '-3px',
                        top: '-2px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: nodes[index + 1].color,
                        boxShadow: `0 0 8px ${nodes[index + 1].color}`
                      }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
