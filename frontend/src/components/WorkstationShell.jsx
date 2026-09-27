import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  Activity,
  Search,
  CheckCircle2,
  Terminal,
  Shield,
  Layers,
  ChevronRight,
  Server,
  Cpu,
  GitBranch,
  ArrowLeft,
  CircleDot
} from 'lucide-react';
import '../workstation.css';

export default function WorkstationShell({ children, pageTitle, subtitle }) {
  const location = useLocation();

  // Ensure Lenis smooth scroll from landing page is completely deactivated and purged
  React.useEffect(() => {
    if (window.lenis) {
      try {
        if (typeof window.lenis.destroy === 'function') {
          window.lenis.destroy();
        } else if (typeof window.lenis.stop === 'function') {
          window.lenis.stop();
        }
      } catch (err) {}
      window.lenis = null;
    }
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
  }, []);

  const navItems = [
    {
      num: '→',
      title: 'SRE WORKSTATION',
      path: '/workstation',
      icon: Activity,
      desc: 'Unified Incident → Refactor → Deploy'
    }
  ];

  return (
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0d0c12',
        color: '#F8FAFC',
        fontFamily: 'var(--tp-font-sans)'
      }}
    >
      {/* PERSISTENT SIDEBAR (260px) */}
      <aside
        style={{
          width: '260px',
          minWidth: '260px',
          background: '#0c0b10',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 40,
          flexShrink: 0,
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Brand & Subtitle */}
        <div>
          <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/logo.png"
                alt="TelemetryPulse Logo"
                style={{
                  width: '34px',
                  height: '34px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(34, 211, 238, 0.35))'
                }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.04em', color: '#F8FAFC' }}>
                  TELEMETRYPULSE
                </div>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#22D3EE' }}>
                  AUTONOMOUS SRE
                </div>
              </div>
            </a>

            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '12px',
                fontSize: '11px',
                color: '#64748B',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#22D3EE')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
            >
              <ArrowLeft size={13} />
              <span>← Back to Landing Page</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                padding: '6px 10px 8px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#64748B',
                textTransform: 'uppercase'
              }}
            >
              Autonomous Pipeline
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    color: isActive ? '#22D3EE' : '#94A3B8',
                    borderLeft: isActive ? '2px solid #22D3EE' : '2px solid transparent',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.color = '#F8FAFC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94A3B8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isActive ? '#22D3EE' : '#64748B'} strokeWidth={isActive ? 2.2 : 1.8} />
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: isActive ? 700 : 600, letterSpacing: '0.04em' }}>
                        <span style={{ opacity: 0.6, marginRight: '6px', fontFamily: 'var(--tp-font-mono)' }}>{item.num}</span>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '10px', color: isActive ? 'rgba(34, 211, 238, 0.8)' : '#64748B', marginTop: '1px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22D3EE' }} />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status Badges */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.07)', background: 'rgba(12, 11, 16, 0.6)' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase' }}>
            System Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#34D399' }}>
              <span className="tp-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              <span>TELEMETRY ONLINE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#22D3EE' }}>
              <span className="tp-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22D3EE' }} />
              <span>BOB AGENT ACTIVE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#94A3B8' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              <span>REPOSITORY CONNECTED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--tp-font-mono)', color: '#94A3B8' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              <span>TEST ENV READY</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW AREA (TOP HEADER + SCROLLABLE CONTENT) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* TOP HEADER (Sticky, Glassmorphism, subtle bottom border) */}
        <header
          style={{
            height: '56px',
            minHeight: '56px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(13, 12, 18, 0.85)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px'
          }}
        >
          {/* Active section title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
              {pageTitle || 'WORKSTATION'}
            </span>
            {subtitle && (
              <>
                <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</span>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', color: '#94A3B8', textTransform: 'uppercase' }}>
                  {subtitle}
                </span>
              </>
            )}
          </div>

          {/* Right side indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* System Online badge */}
            <div className="tp-badge-success">
              <span className="tp-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              <span>SYSTEM ONLINE</span>
            </div>

            {/* Bob Agent Active badge */}
            <div className="tp-badge-cyan">
              <Cpu size={12} color="#22D3EE" />
              <span>BOB AGENT ACTIVE</span>
            </div>

            {/* User Badge: Tony | SRE Lead */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#05070B'
                }}
              >
                TK
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#F8FAFC' }}>Tony</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>|</span>
              <span style={{ fontSize: '11px', color: '#22D3EE', fontWeight: 500 }}>SRE Lead</span>
            </div>
          </div>
        </header>

        {/* Workstation Page Content — ONLY this element scrolls */}
        <main
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          tabIndex={-1}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#0d0c12',
            backgroundImage: 'radial-gradient(1000px 500px at 50% 0%, rgba(99, 102, 241, 0.07), rgba(139, 92, 246, 0.02) 60%, transparent 100%)',
            backgroundAttachment: 'local',
            padding: '24px 28px 48px',
            overscrollBehavior: 'contain',
            outline: 'none'
          }}
          className="tp-scroll"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
