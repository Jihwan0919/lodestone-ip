'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [ip, setIp] = useState({ a: 'SCANNING...', l: '-', i: '-', tz: 'Asia/Seoul', vpn: false });
  const [time, setTime] = useState('--:--:--');
  const [msg, setMsg] = useState('');
  const [st, setSt] = useState({ x: 0, y: 0, d: 1, s: false, w: false });

  const xpSfx = () => { try { const c = new AudioContext(), n = c.currentTime, b = 1150 + Math.random() * 250; [b, b * 1.35].forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(f, n + i * 0.055); g.gain.setValueAtTime(0.08, n + i * 0.055); g.gain.exponentialRampToValueAtTime(0.0001, n + i * 0.055 + 0.28); o.connect(g); g.connect(c.destination); o.start(n + i * 0.055); o.stop(n + i * 0.055 + 0.29); }); } catch {} };

  const loadIP = async () => {
    setIp((p) => ({ ...p, a: 'SCANNING...' }));
    try { const j = await (await fetch('https://ipwho.is')).json(); if (j.success) { const isp = j.connection?.isp || j.connection?.org || 'Detected'; return setIp({ a: j.ip, l: `${j.country || ''} ${j.city || ''}`.trim() || 'Global', i: isp, tz: j.timezone?.id || 'Asia/Seoul', vpn: Boolean(j.security?.vpn || j.security?.proxy || j.security?.tor || /vpn|proxy|cloud|aws|google|azure|oracle|digitalocean|linode|vultr|ovh|hetzner|mullvad|nord|express|proton|surfshark|cloudflare/i.test(isp)) }); } } catch {}
    try { const fb = await (await fetch('https://ipify.org')).json(); if (fb.ip) return setIp({ a: fb.ip, l: 'Global', i: 'Direct', tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Seoul', vpn: false }); } catch {}
    setIp({ a: 'BLOCKED', l: '-', i: '-', tz: 'Asia/Seoul', vpn: false });
  };

  useEffect(() => { loadIP(); }, []);
  useEffect(() => { const tick = () => { try { setTime(new Intl.DateTimeFormat('en-GB', { timeZone: ip.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())); } catch { setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })); } }; tick(); const id = setInterval(tick, 1000); return () => clearInterval(id); }, [ip.tz]);
  useEffect(() => {
    const k: Record<string, boolean> = {}; let vy = 0, gr = true;
    const dn = (e: KeyboardEvent) => { const c = e.key.toLowerCase(); if (c === ' ') e.preventDefault(); k[c] = true; if ((c === 'w' || c === ' ' || e.key === 'ArrowUp') && gr) { vy = 15; gr = false; } };
    const up = (e: KeyboardEvent) => { k[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    const id = setInterval(() => setSt((p) => { let { x, y, d } = p, w = false; const s = Boolean(k['s'] || k['arrowdown']), sp = s ? 3.5 : 7; if (k['a'] || k['arrowleft']) { x -= sp; d = -1; w = true; } if (k['d'] || k['arrowright']) { x += sp; d = 1; w = true; } x = Math.max(-40, Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 220)); y += vy; if (y > 0 || vy > 0) { vy -= 1.15; if (y <= 0) { y = 0; vy = 0; gr = true; } } else { y = 0; vy = 0; gr = true; } return { x, y, d, s, w }; }), 20);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); clearInterval(id); };
  }, []);

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); xpSfx(); if (ip.a.includes('SCAN') || ip.a.includes('BLOCKED')) return; await navigator.clipboard.writeText(ip.a); setMsg('✔ IP 복사 완료! (COPIED)'); setTimeout(() => setMsg(''), 2500); };
  const rescan = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.blur(); xpSfx(); loadIP(); };
  const isKR = ip.tz === 'Asia/Seoul';
  const gems = [{ top: 6, left: 8, background: '#22d3ee' }, { top: 6, right: 8, background: '#4ade80' }, { bottom: 6, left: 8, background: '#facc15' }, { bottom: 6, right: 8, background: '#f43f5e' }];

  return (
    <div className="world-container world-night">
      <div className="sky-layer"><div className="celestial-body moon" />{['14%,12%', '24%,28%', '12%,48%', '28%,66%', '18%,82%'].map((v, i) => <div key={i} className="star" style={{ top: v.split(','), left: v.split(',') }} />)}<div className="mc-cloud cloud-1 cloud-night" /><div className="mc-cloud cloud-2 cloud-night" /></div>
      <svg viewBox="0 0 320 80" preserveAspectRatio="none" className="mountains-svg"><polygon points="0,80 0,46 48,46 48,18 90,18 90,48 150,48 150,16 212,16 212,38 284,38 284,22 320,22 320,80" fill="#0b132b" opacity="0.7" /><polygon points="0,80 0,58 72,58 72,44 140,44 140,62 210,62 210,38 272,38 272,54 320,54 320,80" fill="#132a13" /></svg>
      <div className="portal-wrap"><div className="portal-frame"><div className="portal-inner" /></div></div>
      <div className="pickaxe-wrap"><svg viewBox="0 0 16 16" width="110" height="110"><path d="M5,2 h6 v2 h2 v2 h2 v5 h-2 v-4 h-2 v-2 h-6 z" fill="#22d3ee" /><path d="M10,5 h1 v1 h-1 z M8,7 h1 v1 h-1 z M6,9 h1 v1 h-1 z M4,11 h1 v1 h-1 z M2,13 h2 v2 h-2 z" fill="#a855f7" /></svg></div>
      <main className="mc-gui">
        <div className="enchant-banner" style={{ position: 'relative', textAlign: 'center', marginBottom: 14, padding: '12px', border: '3px solid #000', boxShadow: 'inset 2px 2px 0 #d946ef, inset -2px -2px 0 #4c1d95' }}>
          {gems.map((g, i) => <span key={i} style={{ position: 'absolute', width: 8, height: 8, boxShadow: `0 0 8px ${g.background}`, ...g }} />)}
          <div style={{ fontSize: 11, color: '#f0abfc', letterSpacing: 2 }}>✦ ENCHANTED GLOBAL IP TRACKER ✦</div>
          <h1 style={{ fontSize: 28, color: '#fef08a', textShadow: '3px 3px 0 #713f12, 0 0 18px rgba(250,204,21,0.9)', margin: '2px 0' }}>내 IP 좌표 찾기</h1>
          <div style={{ fontSize: 13, color: '#67e8f9', textShadow: '2px 2px 0 #083344', letterSpacing: 2 }}>FIND MY IP ADDRESS</div>
          <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.78)', border: '2px solid #c084fc', padding: '5px 16px', fontSize: 16, color: '#fef08a', marginTop: 10, boxShadow: '0 0 12px rgba(192,132,252,0.5)' }}>🕒 {isKR ? '대한민국 (KST)' : ip.tz} · {time}</div>
        </div>
        <div className="mc-term">
          <div className="term-top"><span>▶ 감지된 IP 주소 (DETECTED IP)</span><span style={{ color: ip.vpn ? '#ffaa00' : '#55ff55', fontWeight: 'bold' }}>{ip.vpn ? '⚠ VPN / PROXY 감지됨' : '● DIRECT (일반 망)'}</span></div>
          <div className="ip-row"><span className="ip-val">{ip.a}</span><button onClick={copy} className="mc-btn">복사 / COPY</button></div>
          <p className="copy-msg">{msg}</p>
          <div className="info-grid"><div className="info-card"><span className="info-lbl">지역 (REGION)</span><span className="info-val-biome">{ip.l}</span></div><div className="info-card"><span className="info-lbl">통신망 (ISP)</span><span className="info-val-isp">{ip.i}</span></div></div>
        </div>
        <button onClick={rescan} className="mc-btn mc-btn-full">🧭 좌표 재동기화 (RESCAN IP)</button>
      </main>
      <div className="hotbar">{['🧭', '📦', '⛏️', '🗡️', '🧱', '💎', '🗺️', '🔦', '🍖'].map((it, i) => <div key={i} className={`hotbar-slot ${i === 0 ? 'hotbar-active' : ''}`}>{it}</div>)}</div>
      <div className="left-scene"><svg viewBox="0 0 32 32" width="105" height="105" className="iso-shadow"><polygon points="16,4 28,10 16,16 4,10" fill="#b47832" stroke="#291709" /><polygon points="4,10 16,16 16,28 4,22" fill="#8f5b22" stroke="#291709" /><polygon points="28,10 16,16 16,28 28,22" fill="#734718" stroke="#291709" /><rect x="9" y="14" width="2.5" height="4.5" fill="#cbd5e1" /></svg><div className="torch-wrap"><div className="torch-flame" /><div className="torch-stick" /></div></div>
      <div style={{ position: 'fixed', bottom: `${84 + st.y}px`, left: `${130 + st.x}px`, zIndex: 25, pointerEvents: 'none', transform: `scaleX(${st.d}) scaleY(${st.s ? 0.82 : 1})`, transformOrigin: 'bottom center' }}><svg viewBox="0 0 18 34" width="90" height="165" className={`iso-shadow ${st.w ? 'idle-3d' : ''}`}><rect x="5" y="1" width="8" height="8" fill="#4a2e16" /><rect x="5" y="3" width="8" height="6" fill="#b8845c" /><rect x="6" y="5" width="2" height="1" fill="#3b369c" /><rect x="10" y="5" width="2" height="1" fill="#3b369c" /><rect x="5" y="9" width="8" height="12" fill="#00a8a8" /><rect x="2" y="9" width="3" height="12" fill="#b8845c" /><rect x="13" y="9" width="3" height="12" fill="#9c6d49" /><rect x="5" y="21" width="8" height="10" fill="#3b369c" /><rect x="5" y="31" width="8" height="2" fill="#525252" /></svg></div>
      <div className="right-scene"><svg viewBox="0 0 36 56" width="115" height="180" className="iso-shadow idle-3d"><polygon points="18,2 28,7 18,12 8,7" fill="#4ade80" stroke="#052e16" /><polygon points="8,7 18,12 18,24 8,19" fill="#22c55e" stroke="#052e16" /><polygon points="28,7 18,12 18,24 28,19" fill="#16a34a" stroke="#052e16" /><rect x="10" y="11" width="2.5" height="2.5" fill="#052e16" /><rect x="14.5" y="13" width="2.5" height="2.5" fill="#052e16" /><polygon points="10,20 18,24 18,42 10,38" fill="#22c55e" stroke="#052e16" /><polygon points="26,20 18,24 18,42 26,38" fill="#15803d" stroke="#052e16" /><polygon points="6,38 14,42 14,50 6,46" fill="#16a34a" stroke="#052e16" /><polygon points="18,42 26,46 26,54 18,50" fill="#15803d" stroke="#052e16" /></svg><svg viewBox="0 0 32 32" width="110" height="110" className="iso-shadow"><polygon points="16,3 29,9.5 16,16 3,9.5" fill="#64748b" stroke="#1e293b" /><polygon points="3,9.5 16,16 16,29 3,22.5" fill="#475569" stroke="#1e293b" /><polygon points="29,9.5 16,16 16,29 29,22.5" fill="#334155" stroke="#1e293b" /><rect x="13" y="7" width="3" height="2" fill="#22d3ee" /><rect x="6" y="14" width="3" height="3" fill="#22d3ee" /><rect x="20" y="17" width="3" height="3" fill="#67e8f9" /></svg></div>
      <div className="ground-layer"><div className="ground-grass" /><div className="ground-dirt" /><div className="ground-stone" /><div className="ground-rock" /></div>
    </div>
  );
}
