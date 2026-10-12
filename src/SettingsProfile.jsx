import { useRef, useState } from 'react';

const KEY = 'veylora.profile';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch { return {}; }
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
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.86));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}

export default function SettingsProfile() {
  const [p] = useState(load);
  const [name, setName] = useState(p.name || '');
  const [avatar, setAvatar] = useState(p.avatar || '');
  const [hash, setHash] = useState(p.hash || '');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);

  const pick = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try { setAvatar(await resizeImage(f)); setMsg(''); } catch { setMsg('That file is not a usable image.'); }
  };
  const save = async () => {
    const n = name.trim();
    if (!n) { setMsg('Pick a name first.'); return; }
    const h = pass ? await hashPass(pass) : hash;
    try {
      localStorage.setItem(KEY, JSON.stringify({ name: n.slice(0, 24), avatar, hash: h }));
      setHash(h); setPass(''); setMsg('Saved. It shows on the login screen next time.');
    } catch { setMsg('Could not save (browser storage is unavailable or full).'); }
  };
  const removePass = () => {
    setHash(''); setPass(''); setMsg('Password will be removed when you press Save.');
  };

  return (
    <div className="settings-card sp-card">
      <div className="card-heading">PROFILE <span className="tiny-tag">THIS DEVICE</span></div>
      <div className="sp-top">
        <button type="button" className="sp-avatar" onClick={() => fileRef.current && fileRef.current.click()} title="Choose a photo">
          {avatar ? <img src={avatar} alt="" /> : <span>{(name.trim()[0] || '+').toUpperCase()}</span>}
        </button>
        <div className="sp-fields">
          <label><span className="sp-label">DISPLAY NAME</span>
            <input className="sp-input" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>
          <div className="sp-photo-row">
            <button type="button" className="taskbar-reset" onClick={() => fileRef.current && fileRef.current.click()}>CHANGE PHOTO</button>
            {avatar && <button type="button" className="taskbar-reset" onClick={() => setAvatar('')}>REMOVE PHOTO</button>}
          </div>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
      <label className="sp-pass"><span className="sp-label">{hash ? 'NEW PASSWORD (LEAVE BLANK TO KEEP)' : 'SET A PASSWORD (OPTIONAL)'}</span>
        <input className="sp-input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" />
      </label>
      <div className="sp-actions">
        <button type="button" className="taskbar-reset" onClick={save}>SAVE</button>
        {hash && <button type="button" className="taskbar-reset" onClick={removePass}>REMOVE PASSWORD</button>}
      </div>
      {msg && <p className="setting-note">{msg}</p>}
      <p className="setting-note">Your name, photo and password are stored only in this browser. The password is a screen lock, not real security.</p>
    </div>
  );
}
