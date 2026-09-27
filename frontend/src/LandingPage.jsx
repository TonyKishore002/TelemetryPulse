import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import '../styles.css';
import '../website-base.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLaunchDashboard = (e) => {
    console.log('[TelemetryPulse] handleLaunchDashboard invoked');
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window.lenis) {
      try {
        if (typeof window.lenis.destroy === 'function') {
          window.lenis.destroy();
        }
      } catch (err) {}
      window.lenis = null;
    }
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    setMenuOpen(false);
    navigate('/workstation');
  };

  useEffect(() => {
    // If returning from another route via client-side history navigation (e.g. browser back button),
    // the WebGL canvas in #ijsk was detached when LandingPage unmounted.
    // Detect this condition and perform a clean document reload to restore the 3D scene engine.
    const canvas = document.querySelector('#ijsk canvas');
    if (!canvas && (window.__builder || window.__sceneState)) {
      window.location.reload();
      return;
    }

    // 1. Peachworlds engine configuration
    window._pwInitialPath = "/";
    window._pwPreviewResourceUrls = [];

    // Dynamically inject script.js if not already in document
    if (!document.querySelector('script[src*="script.js"]')) {
      const script = document.createElement('script');
      script.src = '/script.js';
      script.defer = true;
      script.setAttribute('fetchpriority', 'high');
      document.body.appendChild(script);
    }

    // 2. Initialize Lenis smooth scroll with enhanced fluid momentum
    let lenis = window.lenis;
    if (!lenis || typeof lenis.raf !== 'function') {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.25,
        infinite: false,
        autoResize: true,
      });
      window.lenis = lenis;
    } else if (typeof lenis.start === 'function') {
      lenis.start();
    }

    let rafId;
    function raf(time) {
      if (window.lenis && typeof window.lenis.raf === 'function') {
        window.lenis.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    document.documentElement.classList.add('lenis', 'lenis-smooth');
    document.body.classList.add('lenis', 'lenis-smooth');

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
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
    };
  }, []);

  const scrollTo = (targetId, offset = 0) => {
    setMenuOpen(false);
    const el = document.getElementById(targetId);
    if (!el) return;
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(el, {
        offset: offset,
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="pwb-body-wrap" style={{ opacity: 1, minHeight: '100vh', overflow: 'visible' }}>
      {/* Background 3D Scene */}
      <div className="pwb-background pwb-flex-grid-wrap" id="ip1j">
        <div className="pwb-scene" id="ijsk"></div>
      </div>

      {/* Navigation Header */}
      <div className="pwb-flex-grid-wrap" id="ihkww7">
        <div className="pw-block-style" id="int5ct">
          <div className="pwb-flex-grid-wrap" id="i1lwz-3">
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-3" style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", gap: "12px", width: "auto" }} onClick={() => scrollTo('i84ba', 0)}>
              <img src="/logo.png" alt="TelemetryPulse" style={{ width: "32px", height: "32px", minWidth: "32px", objectFit: "contain", flexShrink: 0, display: "block" }} />
              <div id="ispyh-2-3-2-3-3-2" style={{ whiteSpace: "nowrap" }}>TelemetryPulse</div>
            </div>
            <div className="framer-1cc0f02" id="imob0j-3-3-2">
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-3-2">
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2', -60)}>Workflow</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-2" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-4', -60)}>Features</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-2-2" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-3-2', -60)}>Benchmarks</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-2-2-2" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-2-2', -60)}>Tech Stack</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-nav-docs" style={{ cursor: "pointer" }} onClick={() => scrollTo('injpw', -40)}>Docs</p>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2" style={{ pointerEvents: 'none' }}>Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2" style={{ pointerEvents: 'none' }}/>
                </div>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-4" style={{ cursor: 'pointer' }} onClick={() => setMenuOpen(!menuOpen)}>
              <div className="pw-block-style" id="ilouwl"></div>
              <div className="pw-block-style" id="ilouwl-2"></div>
            </div>
            <div className="pwb-relative-overlay" id="iy2h61" style={{ display: menuOpen ? 'block' : 'none', opacity: menuOpen ? 1 : 0, transition: 'opacity 0.25s ease' }}>
              <div className="pwb-flex-grid-wrap" id="i1lwz-3-2">
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-2" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", width: "auto" }}>
                  <img src="/logo.png" alt="TelemetryPulse" style={{ width: "28px", height: "28px", minWidth: "28px", objectFit: "contain", flexShrink: 0, display: "block" }} />
                  <div id="ispyh-2-3-2-3-3-2-2" style={{ whiteSpace: "nowrap" }}>TelemetryPulse</div>
                </div>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-4-2" style={{ cursor: 'pointer' }} onClick={() => setMenuOpen(false)}>
                  <img src="/files.peachworlds.com/website/779ba49e-ab86-49fd-87d9-bc12c446465b/close-24dp-000000-fill0-wght400-grad0-opsz24.png" loading="lazy" id="iet44-4-2"/>
                </div>
              </div>
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-3">
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-4" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2', -60)}>Workflow</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-2-3" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-4', -60)}>Features</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-2-2-3" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-3-2', -60)}>Benchmarks</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-3-2-2-2-2-2-2-2" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-2-2', -60)}>Tech Stack</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-nav-docs-m" style={{ cursor: "pointer" }} onClick={() => scrollTo('injpw', -40)}>Docs</p>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-3" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-3" style={{ pointerEvents: 'none' }}>Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-3" style={{ pointerEvents: 'none' }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pwb-anchor" id="i3owk"></div>

      {/* 1. Hero Section */}
      <div className="pwb-flex-grid-wrap" id="i84ba">
        <div className="pwb-flex-grid-wrap" id="i1lwz">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-hero-badge" style={{ marginBottom: "14px", letterSpacing: "1.2px", textTransform: "uppercase" }}>
              AUTONOMOUS SRE &amp; TELEMETRY REMEDIATION PLATFORM
            </h4>
            <h1 className="pw-user-text-style-6ae56f11-b178-4dd1-8bf0-1f16cb6f2a2e" id="ispyh-2-2">
              From Production Telemetry to <br id="ibpex9"/>Verified Code Fixes in Seconds.
            </h1>
            <div className="pw-block-style" id="i81y03-2">
              <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-4">
                🟢 Live Telemetry Active | Powered by IBM Bob 2.0
              </p>
            </div>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-2">
            <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3">
              TelemetryPulse ingests live APM traces, pinpoints database bottlenecks, and orchestrates agentic code refactoring with human-in-the-loop governance—powered by IBM Bob 2.0.
            </p>
            <div className="pw-block-style" id="i81y03">
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-4" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-4" style={{ pointerEvents: 'none' }}>Launch SRE Workstation →</p>
                <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-4" style={{ pointerEvents: 'none' }}/>
              </div>
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-5" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2', -60)}>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-6">⚡ Explore Workflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions / Overview Section */}
      <div className="pwb-flex-grid-wrap" id="ilwyn">
        <div className="pwb-flex-grid-wrap" id="i1lwz-2-4">
          <div className="pw-block-style" id="ipgqtg">
            <div className="pw-block-style" id="iklwi7">
              <div className="pw-block-style" id="iyg80u">
                <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3">OVERVIEW</h4>
                <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2">Automate end-to-end incident triage and verification.</h1>
                <div className="pw-block-style" id="i81y03-3">
                  <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-6" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                    <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-7" style={{ pointerEvents: 'none' }}>Launch SRE Workstation →</p>
                    <img className="pw-image-style" src="/files.peachworlds.com/website/1e762a76-bab8-4b68-ba7a-4e73db09081b/arrow-r.svg" loading="lazy" id="i9hq34-3" style={{ pointerEvents: 'none' }}/>
                  </div>
                  <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-5-2" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-3-2', -60)}>
                    <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-6-2">View Benchmarks</p>
                  </div>
                </div>
              </div>
              <div className="pw-block-style" id="iyg80u-2">
                <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-5">
                  Streamline trace analysis, synthesize code-level fixes, and verify performance regressions automatically inside sandboxed runtimes.
                </p>
              </div>
            </div>
            <div className="pw-block-style" id="ijuu9f">
              <img className="pw-image-style" src="/sre-dashboard-overview.jpg?v=2" alt="TelemetryPulse Main SRE Dashboard Overview" loading="lazy" id="i0esdr"/>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Technology Stack Strip */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2-2-2">
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-2-2">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-5">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f text-cyan-400 text-xs font-bold tracking-widest uppercase" id="ispyh-2-3-2-3-2-2-2-3-2-2-5" style={{ color: '#22D3EE', letterSpacing: '0.12em', fontWeight: 700 }}>TECHNOLOGY STACK</h4>
            <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e text-white text-2xl md:text-3xl font-extrabold tracking-tight" id="ispyh-2-2-2-3-2-5" style={{ color: '#F8FAFC', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>Powered by Enterprise SRE &amp; Autonomous AI Infrastructure.</h1>
          </div>
        </div>
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-2-2-2">
          <div className="pw-grid-style" id="iod904" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', width: '100%', pointerEvents: 'auto' }}>
            <div className="pw-block-style flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-[#14131b]/95 backdrop-blur-xl shadow-xl shadow-black/60 hover:border-cyan-400/40 hover:bg-[#181724] transition-all duration-200" id="iqypqm" style={{ minHeight: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#14131b', backgroundColor: 'rgba(20, 19, 27, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)', pointerEvents: 'auto' }}>
              <span className="text-white text-lg font-bold tracking-tight" style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '-0.2px' }}>IBM Bob 2.0</span>
              <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1.5" style={{ fontSize: '11px', fontWeight: '600', color: '#22D3EE', marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Agentic AI</span>
            </div>
            <div className="pw-block-style flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-[#14131b]/95 backdrop-blur-xl shadow-xl shadow-black/60 hover:border-cyan-400/40 hover:bg-[#181724] transition-all duration-200" id="i1naqa" style={{ minHeight: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#14131b', backgroundColor: 'rgba(20, 19, 27, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)', pointerEvents: 'auto' }}>
              <span className="text-white text-lg font-bold tracking-tight" style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '-0.2px' }}>BobShell</span>
              <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1.5" style={{ fontSize: '11px', fontWeight: '600', color: '#22D3EE', marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Sandbox Runtime</span>
            </div>
            <div className="pw-block-style flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-[#14131b]/95 backdrop-blur-xl shadow-xl shadow-black/60 hover:border-cyan-400/40 hover:bg-[#181724] transition-all duration-200" id="ijtbth" style={{ minHeight: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#14131b', backgroundColor: 'rgba(20, 19, 27, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)', pointerEvents: 'auto' }}>
              <span className="text-white text-lg font-bold tracking-tight" style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '-0.2px' }}>Python (Flask)</span>
              <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1.5" style={{ fontSize: '11px', fontWeight: '600', color: '#22D3EE', marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Backend API</span>
            </div>
            <div className="pw-block-style flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-[#14131b]/95 backdrop-blur-xl shadow-xl shadow-black/60 hover:border-cyan-400/40 hover:bg-[#181724] transition-all duration-200" id="is888l" style={{ minHeight: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#14131b', backgroundColor: 'rgba(20, 19, 27, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)', pointerEvents: 'auto' }}>
              <span className="text-white text-lg font-bold tracking-tight" style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '-0.2px' }}>Supabase</span>
              <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1.5" style={{ fontSize: '11px', fontWeight: '600', color: '#22D3EE', marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>PostgreSQL</span>
            </div>
            <div className="pw-block-style flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-[#14131b]/95 backdrop-blur-xl shadow-xl shadow-black/60 hover:border-cyan-400/40 hover:bg-[#181724] transition-all duration-200" id="is888l-2" style={{ minHeight: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#14131b', backgroundColor: 'rgba(20, 19, 27, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)', pointerEvents: 'auto' }}>
              <span className="text-white text-lg font-bold tracking-tight" style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '-0.2px' }}>React / Vite</span>
              <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1.5" style={{ fontSize: '11px', fontWeight: '600', color: '#22D3EE', marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Frontend UI</span>
            </div>
            <div className="pw-block-style flex flex-col items-center justify-center p-5 rounded-xl border border-white/10 bg-[#14131b]/95 backdrop-blur-xl shadow-xl shadow-black/60 hover:border-cyan-400/40 hover:bg-[#181724] transition-all duration-200" id="is888l-2-2" style={{ minHeight: '120px', height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#14131b', backgroundColor: 'rgba(20, 19, 27, 0.95)', backdropFilter: 'blur(30px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)', pointerEvents: 'auto' }}>
              <span className="text-white text-lg font-bold tracking-tight" style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', letterSpacing: '-0.2px' }}>Bandit SAST</span>
              <span className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1.5" style={{ fontSize: '11px', fontWeight: '600', color: '#22D3EE', marginTop: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Security Gate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pwb-anchor" id="i3owk-2-3"></div>

      {/* 3. Workflow / How It Works Section (3 Cards) */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2">
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2">WORKFLOW</h4>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-6">
              <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-3-2-6">How It Works.</h1>
              <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-5-2-4">Explore how TelemetryPulse detects, refactors, and verifies production bottlenecks from telemetry trigger to staged pull request.</p>
            </div>
          </div>
        </div>
        <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3">
            <div className="pw-block-style" id="ipkvji-4-4">
              <img className="pw-image-style" src="/files.peachworlds.com/website/8056b15c-2739-49df-8a3a-131691083dc5/chatgpt-image-jun-15-2026-08-50-45-pm.webp" loading="lazy" id="iry0if-3"/>
            </div>
            <div className="pw-block-style" id="ipkvji-4-3">
              <h3 className="pw-user-text-style-68210bff-519a-4c4d-8aa2-b3b5be3cb987" id="ispyh-2-2-2-2-2-2-3">1. Detect &amp; Triage (APM Telemetry)</h3>
              <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2">Ingests live OpenTelemetry and Instana alerts, correlates trace waterfalls, and isolates N+1 sequential database bottlenecks in real time.</p>
            </div>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-2">
            <div className="pw-block-style" id="ipkvji-4-2-4">
              <img className="pw-image-style" src="/files.peachworlds.com/website/c209c201-370c-4e3e-ac83-3599e528f690/chatgpt-image-jun-15-2026-08-53-36-pm.webp" loading="lazy" id="idghoz-3"/>
            </div>
            <div className="pw-block-style" id="ipkvji-4-3-2">
              <h3 className="pw-user-text-style-68210bff-519a-4c4d-8aa2-b3b5be3cb987" id="ispyh-2-2-2-2-2-2-3-2">2. Agentic Refactor &amp; Human Gate (IBM Bob 2.0)</h3>
              <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-2">IBM Bob synthesizes AST-level patches (converting N+1 loops into batched queries) and routes proposals through an interactive Slack gate for human approval.</p>
            </div>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-2-2">
            <div className="pw-block-style" id="ipkvji-4-2-2-2">
              <img className="pw-image-style" src="/files.peachworlds.com/website/353a19a2-d02a-4005-aa0a-2d07eb23d24a/chatgpt-image-jun-15-2026-08-52-37-pm.webp" loading="lazy" id="icg3p7-3"/>
            </div>
            <div className="pw-block-style" id="ipkvji-4-3-2-2">
              <h3 className="pw-user-text-style-68210bff-519a-4c4d-8aa2-b3b5be3cb987" id="ispyh-2-2-2-2-2-2-3-2-2">3. Sandbox Verification &amp; PR Staging (BobShell)</h3>
              <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-2-2">Executes parallel benchmark tests, Pytest suites, and SAST security scans inside isolated BobShell sandboxes before staging auto-documented PRs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Deep-Dive Cards Section */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2-3">
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-3">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-3">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4">GOVERNANCE &amp; VERIFICATION</h4>
            <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-3-2-3">Built for High-Trust Production SRE</h1>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3-3">
            <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-5-2-2">
              Human-gated Slack controls, AST-level query optimization, and sandboxed security verification.
            </p>
          </div>
        </div>
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-3-3">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3-3-3">
            
            {/* Feature Detail Card 1: Human-in-the-Loop Slack Gate */}
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-3">
              <div className="pw-block-style" id="iktmiu">
                <div className="pw-block-style" id="ipkvji-4-5-3">
                  <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4-3">FEATURE 1</h4>
                  <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-2-2-2-3-4-3">Human-in-the-Loop Slack Gate</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-3">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-3">
                    Zero unverified code hits production; web and Slack endpoints enforce strict engineering governance with 3-line Markdown approvals before altering code.<br id="i91bg2-3"/>
                  </p>
                </div>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-6" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-6">Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-6"/>
                </div>
              </div>
              <div className="pw-block-style" id="iktmiu-2-3">
                <div className="pw-block-style" id="ipkvji-4-5-3-2-3">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-2-2-2-5-2-2-3">01</p>
                </div>
                <img className="pw-image-style" src="/files.peachworlds.com/website/ef3f779a-8b6a-4bd8-bcb9-0b77d639001a/chatgpt-image-jun-15-2026-08-59-34-pm.webp" loading="lazy" id="icg3p7-2-3"/>
              </div>
              {/* Responsive duplicate */}
              <div className="pw-block-style" id="iktmiu-4">
                <div className="pw-block-style" id="ipkvji-4-5-3-5">
                  <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4-3-4">FEATURE 1</h4>
                  <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-2-2-2-3-4-3-4">Human-in-the-Loop Slack Gate</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-3-4">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-3-4">
                    Zero unverified code hits production; web and Slack endpoints enforce strict engineering governance with 3-line Markdown approvals before altering code.<br id="i91bg2-3-4"/>
                  </p>
                </div>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-6-5" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-6-5">Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-6-5"/>
                </div>
              </div>
            </div>

            {/* Feature Detail Card 2: IBM Bob Multi-Agent Consortium */}
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-3-2">
              <div className="pw-block-style" id="iktmiu-2-2-3">
                <div className="pw-block-style" id="ipkvji-4-5-3-2-2-3">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-2-2-2-5-2-2-2-3">02</p>
                </div>
                <img className="pw-image-style" src="/files.peachworlds.com/website/351c33a9-2727-4ead-96ba-0e84a1dfccfd/chatgpt-image-jun-15-2026-09-04-22-pm.webp" loading="lazy" id="icg3p7-2-2-3"/>
              </div>
              <div className="pw-block-style" id="iktmiu-3">
                <div className="pw-block-style" id="ipkvji-4-5-3-3">
                  <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4-3-2">FEATURE 2</h4>
                  <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-2-2-2-3-4-3-2">IBM Bob Multi-Agent Consortium</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-3-2">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-3-2">
                    Specialized AI roles collaborate to synthesize production-safe, AST-verified code fixes (converting N+1 loops into batched queries) and generate deterministic execution plan diffs.<br id="i91bg2-3-2"/>
                  </p>
                </div>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-6-2" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-6-2">Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-6-2"/>
                </div>
              </div>
            </div>

            {/* Feature Detail Card 3: FinOps Compute Savings & Security */}
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-3-2-2">
              <div className="pw-block-style" id="iktmiu-3-2">
                <div className="pw-block-style" id="ipkvji-4-5-3-3-2">
                  <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4-3-2-2">FEATURE 3</h4>
                  <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-2-2-2-3-4-3-2-2">FinOps Compute Savings &amp; Security</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-3-2-2">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-3-2-2">
                    Calculates real-time RDS compute and database connection pool cost reductions per eliminated query span and executes parallel Bandit SAST security checks inside isolated sandboxes.<br id="i91bg2-3-2-2"/>
                  </p>
                </div>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-6-3" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-6-3">Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-6-3"/>
                </div>
              </div>
              <div className="pw-block-style" id="iktmiu-2-2-2-3">
                <div className="pw-block-style" id="ipkvji-4-5-3-2-2-2-3">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-2-2-2-5-2-2-2-2-3">03</p>
                </div>
                <img className="pw-image-style" src="/files.peachworlds.com/website/969dfc0e-13eb-475b-8459-6d8e44a15e0a/chatgpt-image-jun-15-2026-09-05-41-pm.webp" loading="lazy" id="icg3p7-2-2-2-3"/>
              </div>
              {/* Responsive duplicate */}
              <div className="pw-block-style" id="iktmiu-3-2-2">
                <div className="pw-block-style" id="ipkvji-4-5-3-3-2-3">
                  <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4-3-2-2-3">FEATURE 3</h4>
                  <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-2-2-2-3-4-3-2-2-3">FinOps Compute Savings &amp; Security</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-3-2-2-3">
                  <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-3-2-2-3">
                    Calculates real-time RDS compute and database connection pool cost reductions per eliminated query span and executes parallel Bandit SAST security checks inside isolated sandboxes.<br id="i91bg2-3-2-2-3"/>
                  </p>
                </div>
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-6-3-3" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                  <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-6-3-3">Launch SRE Workstation →</p>
                  <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-6-3-3"/>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Key Features Grid */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2-4" style={{ backgroundColor: '#000' }}>
        <div className="pw-block-style" id="ifyx0h">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-4">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-2">KEY FEATURES</h4>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-4-2">
              <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-3-2-4-2">Key Features</h1>
              <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-5-2-3-2">Autonomous telemetry triage, real-time database optimization, and human-governed code remediation.</p>
            </div>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3-4">
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4">
              <div className="pw-block-style" id="ipkvji-4-5">
                <img className="pw-image-style" src="/files.peachworlds.com/website/517ad5b6-138b-4098-990f-894804952f29/saas-vector-1-1.png" loading="lazy" id="iry0if-2"/>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-4">
                <h2 className="pw-user-text-style-abab9931-4159-4d9f-b594-3693bb5f6ccd" id="ispyh-2-2-2-2-2-2-3-4">Live Supabase Engine</h2>
                <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-2-2-4-4-2-4">Subscribes directly to PostgreSQL change streams for zero-refresh telemetry updates.</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-2-3">
              <div className="pw-block-style" id="ipkvji-4-2-3">
                <img className="pw-image-style" src="/files.peachworlds.com/website/90285b6e-091c-4e52-885c-50c57065609f/group.png" loading="lazy" id="idghoz-2"/>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-2-3">
                <h2 className="pw-user-text-style-abab9931-4159-4d9f-b594-3693bb5f6ccd" id="ispyh-2-2-2-2-2-2-3-2-3">IBM Bob Multi-Agent Consortium</h2>
                <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-2-2-4-4-2-2-3">Specialized AI roles collaborate to synthesize production-safe, AST-verified code fixes.</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-5">
              <div className="pw-block-style" id="ipkvji-4-5-5">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa-finops"/>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-4-5">
                <h2 className="pw-user-text-style-abab9931-4159-4d9f-b594-3693bb5f6ccd" id="ispyh-2-2-2-2-2-2-3-4-5">Human-in-the-Loop Slack Gate</h2>
                <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-2-2-4-4-2-4-5">Zero unverified code hits production; web and Slack endpoints enforce strict engineering governance.</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-2-3-3">
              <div className="pw-block-style" id="ipkvji-4-2-3-3">
                <img className="pw-image-style" src="/files.peachworlds.com/website/109417e2-2c9d-4c68-bb84-6aa737bc26a8/frame.png" loading="lazy" id="idghoz-2-3"/>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-2-3-3">
                <h2 className="pw-user-text-style-abab9931-4159-4d9f-b594-3693bb5f6ccd" id="ispyh-2-2-2-2-2-2-3-2-3-3">FinOps Compute Savings</h2>
                <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-2-2-4-4-2-2-3-3">Calculates real-time RDS compute and database connection pool cost reductions per eliminated query span.</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-2-3-4" style={{ marginTop: "24px" }}>
              <div className="pw-block-style" id="ipkvji-4-2-3-4">
                <img className="pw-image-style" src="/files.peachworlds.com/website/109417e2-2c9d-4c68-bb84-6aa737bc26a8/frame.png" loading="lazy" id="idghoz-2-4" style={{ maxHeight: "48px", objectFit: "contain" }}/>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-2-3-4">
                <h2 className="pw-user-text-style-abab9931-4159-4d9f-b594-3693bb5f6ccd" id="ispyh-2-2-2-2-2-2-3-2-3-4">BobShell Dual Sandbox &amp; Verification</h2>
                <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-2-2-4-4-2-2-3-4">Executes parallel benchmark tests, Pytest suites, and SAST security scans inside isolated sandboxes before staging auto-documented PRs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real Benchmark Metrics Strip (4 Stat Cards) */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2-3-2">
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-3-2">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-3-2">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-4-2">BENCHMARKS</h4>
            <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-3-2-3-2">
              Real Benchmark Metrics.<br id="i62czt"/>Verified Impact on TelemetryPulse.
            </h1>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3-3-2">
            <div className="pw-block-style" id="iryxrh">
              {/* Stat 1: Latency Speedup */}
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-2-3">
                <div className="pw-block-style" id="ipkvji-4-5-2-3">
                  <h1 className="pw-user-text-style-6ae56f11-b178-4dd1-8bf0-1f16cb6f2a2e" id="ispyh-2-2-2-2-2-2-3-4-2-3" style={{ fontSize: "32px" }}>216x</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-2-3">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-4-2-3">
                    Latency Speedup<br id="i91bg2-2-3"/>
                    <span style={{ fontSize: "13px", opacity: 0.75, fontWeight: 400, display: "block", marginTop: "4px" }}>2,776ms → 12.8ms execution</span>
                  </h4>
                </div>
              </div>
              {/* Stat 2: Query Optimization */}
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-2-2">
                <div className="pw-block-style" id="ipkvji-4-5-2-2">
                  <h1 className="pw-user-text-style-6ae56f11-b178-4dd1-8bf0-1f16cb6f2a2e" id="ispyh-2-2-2-2-2-2-3-4-2-2" style={{ fontSize: "32px" }}>101 → 1</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-2-2">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-4-2-2">
                    Query Optimization<br id="i91bg2-2-2"/>
                    <span style={{ fontSize: "13px", opacity: 0.75, fontWeight: 400, display: "block", marginTop: "4px" }}>N+1 PostgREST calls eliminated</span>
                  </h4>
                </div>
              </div>
              {/* Stat 3: Security Passed */}
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-2">
                <div className="pw-block-style" id="ipkvji-4-5-2">
                  <h1 className="pw-user-text-style-6ae56f11-b178-4dd1-8bf0-1f16cb6f2a2e" id="ispyh-2-2-2-2-2-2-3-4-2" style={{ fontSize: "32px" }}>100%</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-2">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-4-2">
                    Security Passed<br id="i91bg2-2"/>
                    <span style={{ fontSize: "13px", opacity: 0.75, fontWeight: 400, display: "block", marginTop: "4px" }}>0 vulnerabilities on Bandit SAST</span>
                  </h4>
                </div>
              </div>
              {/* Stat 4: Mean Time to Repair */}
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-4-2-2-2">
                <div className="pw-block-style" id="ipkvji-4-5-2-2-2">
                  <h1 className="pw-user-text-style-6ae56f11-b178-4dd1-8bf0-1f16cb6f2a2e" id="ispyh-2-2-2-2-2-2-3-4-2-2-2" style={{ fontSize: "32px" }}>&lt; 30s</h1>
                </div>
                <div className="pw-block-style" id="ipkvji-4-3-4-2-2-2">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-4-2-2-2">
                    Mean Time to Repair<br id="i91bg2-2-2-2"/>
                    <span style={{ fontSize: "13px", opacity: 0.75, fontWeight: 400, display: "block", marginTop: "4px" }}>Telemetry trigger to PR staging</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pwb-anchor" id="i3owk-2-2-2-2"></div>

      {/* Production Problems Solved */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2-2">
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-2">
          <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-2-3-2-2">
            <p className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-3-4-2-2">PRODUCTION PROBLEMS SOLVED</p>
            <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-3-2-2-2-3-2">Real-World Production Bottlenecks Solved</h1>
          </div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3-2-2-2-2-2">
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-3-3-2-3">
              <div className="pw-block-style" id="ipkvji-4-4-2-3-2-2-3-3">
                <div className="pw-block-style" id="ipkvji-4-4-2-3-2-2-2-2-2-3">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-2-2-2-3-3-2-3-2-2-2-2-2-3">N+1 Database Query Loop Exhaustion</h4>
                  <p className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-3-2-2-3-2-2-2-2-2-3">99.5% Latency Reduction</p>
                </div>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-4-2">
                <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-3-3-2-3-2">
                  “Identifies sequential ORM and PostgREST for-loops firing 100+ separate round-trips, rewriting them into high-performance batched SQL queries with a 99.5% latency drop.”
                </h4>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-3-3-2-2-3">
              <div className="pw-block-style" id="ipkvji-4-4-2-3-2-2-3-2-3">
                <div className="pw-block-style" id="ipkvji-4-4-2-3-2-2-2-2-2-2-3">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-2-2-2-3-3-2-3-2-2-2-2-2-2-3">504 Gateway Timeouts Under High Load</h4>
                  <p className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-3-2-2-3-2-2-2-2-2-2-3">MTTR &lt; 30s</p>
                </div>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-4-2">
                <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-3-3-2-2-2-3">
                  “Automates high-priority P1 incident triage under connection pool exhaustion, correlating spans and cutting Mean Time To Repair from 45 minutes to under 30 seconds.”
                </h4>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-3-3-2-2-2-2">
              <div className="pw-block-style" id="ipkvji-4-4-2-3-2-2-3-2-2-2">
                <div className="pw-block-style" id="ipkvji-4-4-2-3-2-2-2-2-2-2-2-2">
                  <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-2-2-2-3-3-2-3-2-2-2-2-2-2-2-2">Unverified &amp; Risky AI Patch Deployments</h4>
                  <p className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-3-2-2-3-2-2-2-2-2-2-2-2">0 Vulnerabilities | 7/7 Pytest Passed</p>
                </div>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-4-2">
                <h4 className="pw-user-text-style-bdff28c9-02fe-4067-b8c1-3aa144c1200c" id="ispyh-2-2-2-4-4-2-3-3-2-2-2-2-2">
                  “Guarantees deterministic safety through isolated BobShell sandbox dual-verification, passing 7/7 unit tests and Bandit SAST security scans before PR staging.”
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 3-Stage Autonomous Pipeline Section */}
      <div className="pwb-flex-grid-wrap" id="ilwyn-2-2-2-3">
        <div className="pwb-flex-grid-wrap" id="i1lwz-5-2-2-3">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-6-2-2-3">
            <h4 className="pw-user-text-style-47248e95-3515-4423-8189-0bbe15d8728f" id="ispyh-2-3-2-3-2-2-2-3-2-2-3-4">THE 3-STAGE AUTONOMOUS PIPELINE</h4>
            <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-3-2-2-2">End-to-End Autonomous Remediation Engine</h1>
          </div>
        </div>
        <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-3-2-2">
          {/* Card 1: Stage 1 - Detect & Triage */}
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-3-3">
            <div className="pw-block-style" id="ipkvji-4-4-3">
              <h3 className="pw-user-text-style-68210bff-519a-4c4d-8aa2-b3b5be3cb987" id="ispyh-2-2-2-2-2-2-3-3-3">DETECT &amp; TRIAGE</h3>
              <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-2-3-2">Live Telemetry &amp; 3s URL Probes<br id="i91bg2-2-3-2"/></p>
            </div>
            <div className="pw-block-style" id="il5oxh"></div>
            <div className="pw-block-style" id="ipkvji-4-3-3-3">
              <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-4-4-2-3-3">STAGE 01<span id="igqc2i">· DETECT</span></h1>
            </div>
            <div className="pw-block-style" id="ipkvji-4-3-3-3-2">
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-2"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2">Continuous 3s telemetry URL probing</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-3"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2">Automated N+1 bottleneck pinpointing</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-2">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-4"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-2">Live P99 latency &amp; payload analysis</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-2-2">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-5"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-2-2">PostgreSQL &amp; Supabase trace streaming</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
              <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2">Launch SRE Workstation →</p>
              <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2"/>
            </div>
          </div>

          {/* Card 2: Stage 2 - Refactor & Govern */}
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-3-2-3">
            <div className="pw-block-style" id="ipkvji-4-4-2-3">
              <h3 className="pw-user-text-style-68210bff-519a-4c4d-8aa2-b3b5be3cb987" id="ispyh-2-2-2-2-2-2-3-3-2-3">REFACTOR &amp; GOVERN</h3>
              <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-2-3-2-2">IBM Bob 2.0 AST Diff &amp; Slack Gate Sign-off<br id="i91bg2-2-3-2-2"/></p>
            </div>
            <div className="pw-block-style" id="il5oxh-2"></div>
            <div className="pw-block-style" id="ipkvji-4-3-3-2-3">
              <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-4-4-2-3-3-2">STAGE 02<span id="ij5nfb">· REFACTOR</span></h1>
            </div>
            <div className="pw-block-style" id="ipkvji-4-3-3-3-2-3">
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-3">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-3">IBM Bob 2.0 AST query batching</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-3">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-10"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-3">Side-by-side code diff visualization</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-2-2-2">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-11"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-2">Interactive Slack human gate proposal</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-2-2-2-2">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-12"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-2-2">Zero surprise production mutations</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-3-2" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
              <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-3-2">Launch SRE Workstation →</p>
              <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2"/>
            </div>
          </div>

          {/* Card 3: Stage 3 - Verify & Deploy */}
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-4-2-2-3-3-2-2-2">
            <div className="pw-block-style" id="ipkvji-4-4-2-2-2">
              <h3 className="pw-user-text-style-68210bff-519a-4c4d-8aa2-b3b5be3cb987" id="ispyh-2-2-2-2-2-2-3-3-2-2-2">VERIFY &amp; DEPLOY</h3>
              <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-4-4-2-4-2-3-2-3">BobShell Speedup Verification &amp; Automated GitHub PR Staging<br id="i91bg2-2-3-2-3"/></p>
            </div>
            <div className="pw-block-style" id="il5oxh-3"></div>
            <div className="pw-block-style" id="ipkvji-4-3-3-2-2-2">
              <h1 className="pw-user-text-style-9711fa5c-ea00-4752-8af0-945c28ef776e" id="ispyh-2-2-2-4-4-2-3-3-2-2">STAGE 03<span id="ij5nfb-2">· VERIFY</span></h1>
            </div>
            <div className="pw-block-style" id="ipkvji-4-3-3-3-2-5">
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-5">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-6"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-5">BobShell clean sandbox execution</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-5">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-7"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-5">Before vs After latency speedup proof</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-2-3">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-8"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-2-4">7/7 Pytest &amp; Bandit SAST security gate</p>
              </div>
              <div className="pw-block-style" id="ipkvji-4-3-3-3-2-2-2-2-2-4">
                <img className="pw-image-style" src="/files.peachworlds.com/website/bc49777a-353d-4a30-a109-5b7c6e62dd05/volume-base-blk.svg" loading="lazy" id="irsa5v-3-9"/>
                <p className="pw-user-text-style-24b64575-cd02-447f-8652-42c6ba02cfec" id="ispyh-2-2-2-3-2-2-2-2-2-2-2-4">Automated GitHub PR staging &amp; branch</p>
              </div>
            </div>
            <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-3" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
              <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-3">Launch SRE Workstation →</p>
              <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-3"/>
            </div>
          </div>
        </div>
      </div>

      <div className="pwb-anchor" id="i3owk-2-2-2"></div>

      {/* Call to Action Footer */}
      <div className="pwb-flex-grid-wrap" id="injpw">
        <div className="pwb-flex-grid-wrap" id="i1lwz-4">
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-5"></div>
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-5-2">
            <h1 className="pw-user-text-style-6ae56f11-b178-4dd1-8bf0-1f16cb6f2a2e" id="ispyh-2-2-3-2">
              From Telemetry to Verified Fixes.<br id="iiwi0b-2"/>Launch your SRE Workstation with TelemetryPulse today.
            </h1>
            <div className="pw-block-style" id="i81y03-4-3">
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-2-2-2-3-2" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-2-2-2-3-2" style={{ pointerEvents: 'none' }}>Launch SRE Workstation →</p>
                <img className="pw-image-style" src="/files.peachworlds.com/website/0422e965-7e36-438f-890d-a24d0eaa3b33/arow-white.svg" loading="lazy" id="i9hq34-2-2-3-2-2-2-3-2" style={{ pointerEvents: 'none' }}/>
              </div>
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-2-2-5-3-3" style={{ cursor: "pointer" }} onClick={() => window.open('https://github.com/TonyKishore002/TelemetryPulse', '_blank', 'noopener,noreferrer')}>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-2-6-3-3">GitHub Repository ↗</p>
              </div>
            </div>
          </div>
          {/* Tech Stack Footer Strip */}
          <div className="pwb-flex-grid-wrap" id="i1lwz-2-5-3">
            <div className="pw-block-style" id="igl11n-4">
              <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-2-4" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", width: "auto" }}>
                <img src="/logo.png" alt="TelemetryPulse" style={{ width: "28px", height: "28px", minWidth: "28px", objectFit: "contain", flexShrink: 0, display: "block" }} />
                <span id="i5gga9-3" style={{ whiteSpace: "nowrap" }}>TelemetryPulse</span>
              </div>
              <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-3-4" style={{ marginTop: "12px", lineHeight: "1.6" }}>
                IBM Bob 2.0 &bull; BobShell &bull; Python (Flask) &bull; Supabase (PostgreSQL) &bull; React / Vite &bull; Bandit SAST
              </p>
              <a
                href="https://github.com/TonyKishore002/TelemetryPulse"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "16px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#E2E8F0",
                  fontSize: "12px",
                  fontFamily: "var(--tp-font-mono, monospace)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  width: "fit-content"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(34, 211, 238, 0.12)";
                  e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.4)";
                  e.currentTarget.style.color = "#22D3EE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.color = "#E2E8F0";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>github.com/TonyKishore002/TelemetryPulse ↗</span>
              </a>
            </div>
            <div className="pw-block-style" id="i3n84f-3">
              <div className="pw-block-style" id="igl11n-3-4">
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-2-2-4">
                  <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-2-3-3-2-2-2-4">Platform</p>
                </div>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-5" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2', -60)}>Workflow</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-2-5" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-4', -60)}>Features</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-2-2-5" style={{ cursor: "pointer" }} onClick={() => scrollTo('ilwyn-2-2-3-2', -60)}>Benchmarks</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-2-2-3-3" style={{ cursor: "pointer" }} onClick={handleLaunchDashboard}>SRE Workstation</p>
                <a
                  href="https://github.com/TonyKishore002/TelemetryPulse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62"
                  style={{ cursor: "pointer", textDecoration: "none", color: "inherit", display: "block" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#22D3EE')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  GitHub Repository ↗
                </a>
              </div>
              <div className="pw-block-style" id="igl11n-3-2-3">
                <div className="pwb-flex-grid-wrap" id="i1lwz-2-3-2-2-2-3">
                  <p className="pw-user-text-style-3045d4e5-cceb-462e-a2d3-aff6a744df83" id="ispyh-2-3-2-3-3-2-2-2-2-3">Tech Stack</p>
                </div>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-3-3">IBM Bob 2.0 &bull; BobShell</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-2-3-3">Python (Flask) &bull; Supabase</p>
                <p className="pw-user-text-style-db4943d4-453d-474d-b88a-07d9ad351c62" id="ispyh-2-3-3-2-2-2-2-3">React / Vite &bull; Bandit SAST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pwb-anchor" id="i3owk-2-2-2-2"></div>
    </div>
  );
}
