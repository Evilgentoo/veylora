import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import './startup.css';

const KEY = 'veylora.profile';
const STEPS = [
  ['Parsing system files', 700],
  ['Restoring your settings', 800],
  ['Loading fonts & glyphs', 600],
  ['Decoding wallpaper imagery', 900],
  ['Warming the compositor', 600],
  ['Indexing app & game library', 800],
  ['Opening apps in the background', 700],
  ['Preparing your sign-in screen', 700],
];
const TOTAL = STEPS.reduce((a, s) => a + s[1], 0);
const SKIP_AFTER = 3000;

function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || 'null');
    return p && p.name ? p : null;
  } catch { return null; }
}
function saveProfile(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
}
async function hashPass(s) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('veylora:' + s));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch { return 'plain:' + s; }
}
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}
const pad = (n) => String(n).padStart(2, '0');
const stamp = (ms) => '[' + pad(Math.floor(ms / 60000)) + ':' + pad(Math.floor(ms / 1000) % 60) + ']';

function Mark({ size = 52 }) {
  const dx = Math.round(size * 0.1), dy = Math.round(size * 0.06);
  return (
    <span className="vs-octo" style={{ transform: 'translate(-' + dx + 'px,-' + dy + 'px) scale(' + size / 16 + ')' }} aria-hidden="true">
      <span className="brand-mark"><Star size={18} fill="currentColor" /></span>
    </span>
  );
}

function Boot({ onDone }) {
  const [t, setT] = useState(0);
  const [logs, setLogs] = useState([]);
  const doneRef = useRef(false);
  const lastStep = useRef(-1);
  const doneFn = useRef(onDone);
  doneFn.current = onDone;
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    doneFn.current();
  };

  useEffect(() => {
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const el = now - t0;
      setT(el);
      if (el >= TOTAL) {
        setTimeout(finish, 350);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let acc = 0, step = STEPS.length;
  for (let i = 0; i < STEPS.length; i++) {
    if (t < acc + STEPS[i][1]) { step = i; break; }
    acc += STEPS[i][1];
  }
  useEffect(() => {
    if (step === lastStep.current) return;
    lastStep.current = step;
    setLogs((l) => [...l, (step < STEPS.length ? STEPS[step][0] : 'Boot complete') + '…'].slice(-7));
  }, [step]);

  const pct = Math.min(100, Math.round((t / TOTAL) * 100));
  const left = Math.max(0, Math.ceil((TOTAL - t) / 1000));
  const segs = 40, filled = Math.floor((pct / 100) * segs);
  const canSkip = t >= SKIP_AFTER;

  return (
    <div className="vs-boot">
      <i className="vs-corner tl" /><i className="vs-corner tr" /><i className="vs-corner bl" /><i className="vs-corner br" />
      <aside className="vs-log">
        <header><span className="vs-dots"><b /><b /><b /></span><span>BOOT.LOG</span><em>VEYLORA TTY1</em></header>
        <div className="vs-now">
          <div><small>NOW LOADING</small><strong>{step < STEPS.length ? STEPS[step][0] : 'Done'}</strong></div>
          <div className="vs-eta"><small>ESTIMATED TIME LEFT</small><span>{left <= 1 ? 'about 1 second' : 'about ' + left + ' seconds'}</span></div>
        </div>
        <ul className="vs-steps">
          {STEPS.map((s, i) => (
            <li key={s[0]} className={i < step ? 'done' : i === step ? 'cur' : ''}>
              <span>{i < step ? '✓' : i === step ? '▶' : '○'}</span>{s[0]}
            </li>
          ))}
        </ul>
        <div className="vs-lines">
          {logs.map((l, i) => <div key={i + l}><span>{stamp(t)}</span> {l}</div>)}
        </div>
        <div className="vs-prompt">veylora@web:~$ boot --start <i>{stamp(t)} {pct}%</i></div>
      </aside>
      <div className="vs-ver"><b>VEYLORA OS v1.0</b><span>WEB · BROWSER RUNTIME</span></div>
      <main className="vs-center">
        <div className="vs-orb"><Mark /></div>
        <div className="vs-bar">{Array.from({ length: segs }, (_, i) => <i key={i} className={i < filled ? 'on' : ''} />)}</div>
        <div className="vs-meta"><b>{pct}%</b>{canSkip
          ? <button onClick={finish}>SKIP ▸</button>
          : <span>SKIP APPEARS AFTER 3 SECONDS</span>}</div>
      </main>
    </div>
  );
}

function Setup({ existing, onSave }) {
  const [name, setName] = useState(existing?.name || '');
  const [avatar, setAvatar] = useState(existing?.avatar || '');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const pick = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try { setAvatar(await resizeImage(f)); setErr(''); } catch { setErr('That file is not a usable image.'); }
  };
  const submit = async (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) { setErr('Pick a name first.'); return; }
    onSave({ name: n.slice(0, 24), avatar, hash: pass ? await hashPass(pass) : '' });
  };
  return (
    <form className="vs-card" onSubmit={submit}>
      <h2>Welcome</h2>
      <p>Set up your profile. It stays in this browser only.</p>
      <button type="button" className="vs-avatar big" onClick={() => fileRef.current && fileRef.current.click()} title="Choose a photo">
        {avatar ? <img src={avatar} alt="" /> : <span>{(name.trim()[0] || '+').toUpperCase()}</span>}
        <em>Change photo</em>
      </button>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
      <input className="vs-input" placeholder="Your name" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} autoFocus />
      <input className="vs-input" type="password" placeholder="Password (optional)" value={pass} onChange={(e) => setPass(e.target.value)} />
      {err && <div className="vs-err">{err}</div>}
      <button className="vs-btn primary" type="submit">Continue</button>
    </form>
  );
}

function Login({ profile, onUnlock, onReset, onPower }) {
  const [now, setNow] = useState(() => new Date());
  const [pass, setPass] = useState('');
  const [bad, setBad] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!profile.hash) { onUnlock(); return; }
    if ((await hashPass(pass)) === profile.hash) { onUnlock(); return; }
    setBad(true); setPass('');
    setTimeout(() => setBad(false), 500);
  };
  return (
    <div className="vs-login">
      <div className="vs-clock">
        <strong>{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</strong>
        <span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
      </div>
      <form className="vs-who" onSubmit={submit}>
        <div className="vs-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : <span>{profile.name[0].toUpperCase()}</span>}</div>
        <h3>{profile.name}</h3>
        {profile.hash ? (
          <>
            <p>Enter your password to sign in</p>
            <div className={'vs-pw' + (bad ? ' bad' : '')}>
              <input type="password" placeholder="Enter Password" value={pass} onChange={(e) => setPass(e.target.value)} autoFocus />
              <button type="submit" aria-label="Sign in">›</button>
            </div>
            {!confirmReset ? (
              <button type="button" className="vs-link" onClick={() => setConfirmReset(true)}>Forgot password?</button>
            ) : (
              <div className="vs-reset">
                <span>This clears your name, photo and password on this device.</span>
                <button type="button" className="vs-link" onClick={onReset}>Reset profile</button>
                <button type="button" className="vs-link" onClick={() => setConfirmReset(false)}>Cancel</button>
              </div>
            )}
          </>
        ) : (
          <>
            <p>No password set</p>
            <button className="vs-btn primary" type="submit" autoFocus>Sign in</button>
          </>
        )}
      </form>
      <div className="vs-power">
        <button onClick={() => window.location.reload()}>↻ Restart</button>
        <button onClick={onPower}>⏻ Shut Down</button>
      </div>
    </div>
  );
}

export default function Startup({ children }) {
  const [phase, setPhase] = useState('boot'); // boot | setup | login | leaving | desktop | off
  const [profile, setProfile] = useState(loadProfile);
  const [bootKey, setBootKey] = useState(0);

  const afterBoot = () => setPhase(profile ? 'login' : 'setup');
  const unlock = () => { setPhase('leaving'); setTimeout(() => setPhase('desktop'), 500); };
  const save = (p) => { saveProfile(p); setProfile(p); setPhase('login'); };
  const reset = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setProfile(null); setPhase('setup'); };

  return (
    <>
      {children}
      {phase !== 'desktop' && (
        <div className={'vs-root' + (phase === 'leaving' ? ' leaving' : '')}>
          {phase === 'boot' && <Boot key={bootKey} onDone={afterBoot} />}
          {phase === 'setup' && <div className="vs-stage"><Setup existing={profile} onSave={save} /></div>}
          {(phase === 'login' || phase === 'leaving') && profile && (
            <Login profile={profile} onUnlock={unlock} onReset={reset} onPower={() => setPhase('off')} />
          )}
          {phase === 'off' && (
            <button className="vs-off" onClick={() => { setBootKey((k) => k + 1); setPhase('boot'); }}>
              <Mark size={34} /><span>Powered off — click to start</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
