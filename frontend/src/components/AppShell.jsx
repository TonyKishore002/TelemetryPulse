import React from 'react';
import { NavLink, useLocation, Link, Outlet } from 'react-router-dom';
import {
  Activity,
  Search,
  CheckCircle2,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import '../workstation.css';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      num: '01',
      title: 'COMMAND CENTER',
      path: '/command-center',
      icon: Activity,
      desc: 'Incident Triage & Signals'
    },
    {
      num: '02',
      title: 'INVESTIGATION',
      path: '/investigation',
      icon: Search,
      desc: 'Trace Waterfall & AST Diff'
    },
    {
      num: '03',
      title: 'VERIFICATION',
      path: '/verification',
      icon: CheckCircle2,
      desc: 'BobShell Sandbox & SAST'
    }
  ];

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        background: '#0A0F17',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 40,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Brand & Subtitle */}
      <div>
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
            Workstation Pipelines
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
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(5, 7, 11, 0.5)' }}>
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
  );
}

export function TopBar({ pageTitle, subtitle }) {
  return (
    <header
      style={{
        height: '56px',
        minHeight: '56px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(10, 15, 23, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
  );
}

export default function AppShell({ children, pageTitle, subtitle }) {
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

  return (
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      className="flex min-h-screen w-full bg-[#05070B] text-slate-100"
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        background: '#05070B',
        color: '#F8FAFC',
        fontFamily: 'var(--tp-font-sans)'
      }}
    >
      <Sidebar />
      <div
        className="flex flex-1 flex-col"
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh'
        }}
      >
        <TopBar pageTitle={pageTitle} subtitle={subtitle} />
        {/* Workstation Page Content */}
        <main
          className="flex-1 p-6"
          style={{
            flex: 1,
            padding: '24px 28px 48px',
            background: 'var(--tp-bg-primary)'
          }}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
