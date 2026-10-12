import { useEffect, useRef, useState } from 'react';
import {
  Star, Settings as SettingsIcon, Folder, Image as ImageIcon,
  Wifi, Volume2, BatteryFull, Sun, Minus, Square, X, ChevronRight, Check, Film
} from 'lucide-react';

const settingsSections = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'taskbar', label: 'Taskbar' },
  { id: 'about', label: 'About Veylora' },
];

const LOCAL_WALLPAPER_PRESETS = [
  { id: 'mono-manga', name: 'Mono Manga', file: '/wallpapers/mono-manga.jpg', category: 'MONOCHROME', type: 'image' },
  { id: 'abstract', name: 'Abstract', file: '/wallpapers/abstract-pink-purple-blue.jpg', category: 'ABSTRACT', type: 'image' },
  { id: 'dreamscape', name: 'Dreamscape', file: '/wallpapers/dreamscape.jpg', category: 'DREAMSCAPE', type: 'image' },
  { id: 'anime-girl-captain', name: 'Anime Girl Captain', file: '/wallpapers/anime-girl-captain.png', category: 'ANIME', type: 'image' },
  { id: 'black-lambo', name: 'Black Lambo', file: '/wallpapers/black-lambo.png', category: 'AUTOMOTIVE', type: 'image' },
  { id: 'broly', name: 'Broly', file: '/wallpapers/broly.jpg', category: 'ANIME', type: 'image' },
  { id: 'evangellion', name: 'Evangelion', file: '/wallpapers/evangellion.jpg', category: 'ANIME', type: 'image' },
  { id: 'itachi-uchiha-snow', name: 'Itachi: Snowfall', file: '/wallpapers/itachi-uchiha-snow.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'knight-of-the-abyss', name: 'Knight of the Abyss', file: '/wallpapers/knight-of-the-abyss.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'luffy', name: 'Luffy', file: '/wallpapers/luffy.png', category: 'ANIME', type: 'image' },
  { id: 'neon-gaze', name: 'Neon Gaze', file: '/wallpapers/neon-gaze-anime-girl.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'red-gun-girl', name: 'Red Gun Girl', file: '/wallpapers/red-gun-girl.png', category: 'ANIME', type: 'image' },
  { id: 'shattered-reflection', name: 'Shattered Reflection', file: '/wallpapers/shattered-reflection-anime-eyes.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'sonic-x-shadow', name: 'Sonic × Shadow', file: '/wallpapers/sonic-x-shadow.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'ssj-goku-blue', name: 'SSJ Goku Blue', file: '/wallpapers/ssj-goku-blue.png', category: 'ANIME', type: 'image' },
  { id: 'white-bird', name: 'White Bird', file: '/wallpapers/white-bird.png', category: 'NATURE', type: 'image' },
  { id: 'winter-hills', name: 'Winter Hills', file: '/wallpapers/winter-hills.png', category: 'LANDSCAPE', type: 'image' },
];

const ACCENT_PRESETS = [
  { id: 'sakura', name: 'Sakura', color: '#f18ac9' },
  { id: 'violet', name: 'Violet', color: '#a78bfa' },
  { id: 'ocean', name: 'Ocean', color: '#67c7ed' },
  { id: 'mint', name: 'Mint', color: '#7ee0b0' },
  { id: 'crimson', name: 'Crimson', color: '#fa778c' },
  { id: 'amber', name: 'Amber', color: '#f5c16c' },
];

export default function Veylora() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  // VEYLORA_TASKBAR_XY_SCALE
  const [taskbarOpacity, setTaskbarOpacity] = useState(() => Number(localStorage.getItem('veylora.taskbarOpacity') ?? 73));
  const [taskbarBlur, setTaskbarBlur] = useState(() => Number(localStorage.getItem('veylora.taskbarBlur') ?? 28));
  const [taskbarRadius, setTaskbarRadius] = useState(() => Number(localStorage.getItem('veylora.taskbarRadius') ?? 23));
  const [taskbarScaleX, setTaskbarScaleX] = useState(() => Number(localStorage.getItem('veylora.taskbarScaleX') ?? 100));
  const [taskbarScaleY, setTaskbarScaleY] = useState(() => Number(localStorage.getItem('veylora.taskbarScaleY') ?? 100));
  useEffect(() => { localStorage.setItem('veylora.taskbarOpacity', String(taskbarOpacity)); }, [taskbarOpacity]);
  useEffect(() => { localStorage.setItem('veylora.taskbarBlur', String(taskbarBlur)); }, [taskbarBlur]);
  useEffect(() => { localStorage.setItem('veylora.taskbarRadius', String(taskbarRadius)); }, [taskbarRadius]);
  useEffect(() => { localStorage.setItem('veylora.taskbarScaleX', String(taskbarScaleX)); }, [taskbarScaleX]);
  useEffect(() => { localStorage.setItem('veylora.taskbarScaleY', String(taskbarScaleY)); }, [taskbarScaleY]);

  // VEYLORA_TASKBAR_APPEARANCE_CONTROLS
  const [taskbarOpacity, setTaskbarOpacity] = useState(() => Number(localStorage.getItem('veylora.taskbarOpacity') ?? 73));
  const [taskbarBlur, setTaskbarBlur] = useState(() => Number(localStorage.getItem('veylora.taskbarBlur') ?? 28));
  const [taskbarRadius, setTaskbarRadius] = useState(() => Number(localStorage.getItem('veylora.taskbarRadius') ?? 23));
  const [taskbarScale, setTaskbarScale] = useState(() => Number(localStorage.getItem('veylora.taskbarScale') ?? 100));
  useEffect(() => { localStorage.setItem('veylora.taskbarOpacity', String(taskbarOpacity)); }, [taskbarOpacity]);
  useEffect(() => { localStorage.setItem('veylora.taskbarBlur', String(taskbarBlur)); }, [taskbarBlur]);
  useEffect(() => { localStorage.setItem('veylora.taskbarRadius', String(taskbarRadius)); }, [taskbarRadius]);
  useEffect(() => { localStorage.setItem('veylora.taskbarScale', String(taskbarScale)); }, [taskbarScale]);

  const [activeSection, setActiveSection] = useState('appearance');
  const [maximized, setMaximized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // VEYLORA_CONTEXT_MENU_POINTER_POSITION
  const [menuPosition, setMenuPosition] = useState({ x: 18, y: 18 });
  const [wallpaper, setWallpaper] = useState(() => {
    try { return localStorage.getItem('veylora.wallpaper') || ''; } catch { return ''; }
  });
  const [accent, setAccent] = useState(() => {
    try { return localStorage.getItem('veylora.accent') || '#f18ac9'; } catch { return '#f18ac9'; }
  });
  const [time, setTime] = useState(() => new Date());
  const [selectedDesktopItem, setSelectedDesktopItem] = useState('');
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === ',') {
        event.preventDefault();
        setSettingsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (event) => {
      if (!dragOrigin.current) return;
      setPosition({
        x: event.clientX - dragOrigin.current.pointerX + dragOrigin.current.startX,
        y: event.clientY - dragOrigin.current.pointerY + dragOrigin.current.startY,
      });
    };
    const up = () => {
      setDragging(false);
      dragOrigin.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging]);

  const beginDrag = (event) => {
    if (maximized || event.target.closest('button')) return;
    dragOrigin.current = {
      pointerX: event.clientX, pointerY: event.clientY,
      startX: position.x, startY: position.y
    };
    setDragging(true);
  };

  useEffect(() => {
    try {
      if (wallpaper) localStorage.setItem('veylora.wallpaper', wallpaper);
      else localStorage.removeItem('veylora.wallpaper');
    } catch {}
  }, [wallpaper]);

  useEffect(() => {
    try { localStorage.setItem('veylora.accent', accent); } catch {}
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <main
      className="desktop"
      style={{
        ...(wallpaper && !/\.(mp4|webm|mov|m4v|mkv)(?:\?.*)?$/i.test(wallpaper) ? { backgroundImage: `url("${wallpaper}")` } : {}),
        '--accent': accent,
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          setSelectedDesktopItem('');
          setMenuOpen(false);
        }
      }}
      onContextMenu={(event) => {
        if (event.target.closest('.window, .taskbar')) return;
        event.preventDefault();
        // Place the menu at the pointer, then keep it within the viewport.
        const menuWidth = 168;
        const menuHeight = 100;
        setMenuPosition({
          x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
          y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight - 8)),
        });
        setMenuOpen(true);
      }}
    >
      {/* VEYLORA_WALLPAPER_MEDIA_BADGES: desktop live wallpaper */}
      {wallpaper && /\.(mp4|webm|mov|m4v|mkv)(?:\?.*)?$/i.test(wallpaper) && (
        <video
          className="desktop-wallpaper-video"
          key={wallpaper}
          src={wallpaper}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <div className="wallpaper-placeholder" aria-hidden="true" />
      <div className="desktop-icons">
        <button className={`desktop-item ${selectedDesktopItem === 'home' ? 'selected' : ''}`} onClick={() => setSelectedDesktopItem('home')}>
          <span className="desktop-icon folder-icon"><Folder size={27} strokeWidth={1.5} /></span>
          <span>Home</span>
        </button>
        <button className={`desktop-item ${selectedDesktopItem === 'wallpaper' ? 'selected' : ''}`} onClick={() => setSelectedDesktopItem('wallpaper')}>
          <span className="desktop-icon"><ImageIcon size={27} strokeWidth={1.5} /></span>
          <span>Wallpaper</span>
        </button>
      </div>

      {menuOpen && (
        <div className="context-menu" style={{ left: menuPosition.x, top: menuPosition.y }} onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => { setSettingsOpen(true); setActiveSection('appearance'); setMenuOpen(false); }}>Personalize <ChevronRight size={13} /></button>
          <button onClick={() => { setSettingsOpen(true); setActiveSection('appearance'); setMenuOpen(false); }}>Wallpaper settings…</button>
          <button onClick={() => { setMenuOpen(false); setSelectedDesktopItem(''); }}>Refresh desktop</button>
        </div>
      )}

      {settingsOpen && (
        <section
          className={`window settings-window ${maximized ? 'maximized' : ''}`}
          style={!maximized ? { transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` } : undefined}
          aria-label="Settings"
        >
          <header className="window-titlebar" onPointerDown={beginDrag}>
            <div className="window-controls">
              <button className="window-control close" aria-label="Close settings" onClick={() => setSettingsOpen(false)}><X size={12} /></button>
              <button className="window-control minimize" aria-label="Minimize settings" onClick={() => setSettingsOpen(false)}><Minus size={12} /></button>
              <button className="window-control maximize" aria-label="Toggle maximize" onClick={() => { setMaximized(v => !v); setPosition({ x: 0, y: 0 }); }}><Square size={10} /></button>
            </div>
            <span className="window-title">SETTINGS</span>
            <span className="titlebar-spacer" />
          </header>
          <div className="settings-layout">
            <aside className="settings-sidebar">
              <div className="settings-brand"><span className="brand-mark"><Star size={18} fill="currentColor" /></span><span>VEYLORA</span></div>
              <div className="sidebar-caption">SYSTEM</div>
              {settingsSections.map(section => (
                <button key={section.id} className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`} onClick={() => setActiveSection(section.id)}>
                  <span>{section.label}</span>{activeSection === section.id && <span className="active-dot" />}
                </button>
              ))}
              <div className="sidebar-footer">VEYLORA OS / 0.1.0</div>
            </aside>
            <div className="settings-content">
              <div className="content-heading">
                <div className="eyebrow">SYSTEM PREFERENCES</div>
                <h1>{settingsSections.find(s => s.id === activeSection)?.label.toUpperCase()}</h1>
                <p>Make Veylora feel like yours.</p>
              </div>
              {activeSection === 'appearance' && (
                <div className="appearance-stack">
                  <div className="settings-card">
                    <div className="card-heading">WALLPAPER <span className="tiny-tag">LOCAL PRESETS</span></div>
                    <div className="wallpaper-grid">
                      {LOCAL_WALLPAPER_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          className={`wallpaper-tile ${wallpaper === preset.file ? 'chosen' : ''}`}
                          onClick={() => setWallpaper(preset.file)}
                          aria-pressed={wallpaper === preset.file}
                          title={`Apply ${preset.name}`}
                        >
                          <span className="wallpaper-thumb">
                            {preset.type === 'video' ? (
                              <video className="wallpaper-thumb-media" src={preset.file} muted loop autoPlay playsInline preload="metadata" aria-hidden="true" />
                            ) : (
                              <img className="wallpaper-thumb-media" src={preset.file} alt="" loading="lazy" />
                            )}
                            <span className="wallpaper-media-badge" title={preset.type === 'video' ? 'Video wallpaper' : 'Image wallpaper'} aria-label={preset.type === 'video' ? 'Video wallpaper' : 'Image wallpaper'}>
                              {preset.type === 'video' ? <Film size={13} strokeWidth={2} /> : <ImageIcon size={13} strokeWidth={2} />}
                            </span>
                            {wallpaper === preset.file && <span className="wallpaper-check"><Check size={15} /></span>}
                          </span>
                          <span className="wallpaper-tile-name">{preset.name}</span>
                          <span className="wallpaper-tile-category">{preset.category}</span>
                        </button>
                      ))}
                    </div>
                    <p className="setting-note">Choose an image or live video wallpaper. Your selection is saved on this device.</p>
                  </div>
                  <div className="settings-card">
                    <div className="card-heading">ACCENT COLOR <span className="tiny-tag">INTERFACE</span></div>
                    <div className="accent-grid">
                      {ACCENT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          className={`accent-option ${accent === preset.color ? 'chosen' : ''}`}
                          onClick={() => setAccent(preset.color)}
                          aria-pressed={accent === preset.color}
                        >
                          <span className="accent-swatch" style={{ backgroundColor: preset.color }}>{accent === preset.color && <Check size={13} />}</span>
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="setting-note">Accent colors update Veylora's highlights and are saved on this device.</p>
                  </div>
                </div>
              )}
              {activeSection === 'desktop' && <div className="settings-card"><div className="card-heading">DESKTOP</div><p className="setting-note">Desktop configuration will be added in a later phase.</p></div>}
              {activeSection === 'taskbar' && (
                <div className="settings-card taskbar-settings-card">
                  <div className="card-heading">TASKBAR APPEARANCE <span className="tiny-tag">LIVE</span></div>
                  <p className="setting-note taskbar-intro">Tune the glass dock. Changes apply immediately and save automatically.</p>
                  {[
                    { label: 'BACKGROUND OPACITY', value: taskbarOpacity, min: 15, max: 100, unit: '%', set: setTaskbarOpacity },
                    { label: 'GLASS BLUR', value: taskbarBlur, min: 0, max: 40, unit: ' px', set: setTaskbarBlur },
                    { label: 'CORNER ROUNDNESS', value: taskbarRadius, min: 8, max: 34, unit: ' px', set: setTaskbarRadius },
                    { label: 'HORIZONTAL SCALE (X)', value: taskbarScaleX, min: 60, max: 140, unit: '%', set: setTaskbarScaleX },
                    { label: 'VERTICAL SCALE (Y)', value: taskbarScaleY, min: 60, max: 140, unit: '%', set: setTaskbarScaleY },
                  ].map(control => <label className="taskbar-slider-row" key={control.label}>
                    <span className="taskbar-slider-label"><span>{control.label}</span><span className="taskbar-slider-value">{control.value}{control.unit}</span></span>
                    <input type="range" min={control.min} max={control.max} value={control.value} onChange={e => control.set(Number(e.target.value)} />
                  </label>)}
                  <button className="taskbar-reset" onClick={() => { setTaskbarOpacity(73); setTaskbarBlur(28); setTaskbarRadius(23); setTaskbarScaleX(100); setTaskbarScaleY(100); }}>RESET DEFAULTS</button>
                </div>
              )}
              {activeSection === 'about' && <div className="settings-card"><div className="card-heading">ABOUT VEYLORA</div><p className="setting-note">A small desktop environment, built carefully.</p><div className="about-version">VERSION 0.1.0 · DEVELOPMENT BUILD</div></div>}
            </div>
          </div>
        </section>
      )}

      <footer className="taskbar" style={{ backgroundColor: `rgba(17,16,23,${taskbarOpacity / 100})`, backdropFilter: `blur(${taskbarBlur}px) saturate(145%)`, WebkitBackdropFilter: `blur(${taskbarBlur}px) saturate(145%)`, borderRadius: `${taskbarRadius}px`, transform: `translateX(-50%) scaleX(${taskbarScaleX / 100}) scaleY(${taskbarScaleY / 100})` }} style={{ backgroundColor: `rgba(17,16,23,${taskbarOpacity / 100})`, backdropFilter: `blur(${taskbarBlur}px) saturate(145%)`, WebkitBackdropFilter: `blur(${taskbarBlur}px) saturate(145%)`, borderRadius: `${taskbarRadius}px`, transform: `translateX(-50%) scale(${taskbarScale / 100})`, transformOrigin: 'center bottom' }}>
        <button className="dock-icon launcher" aria-label="Open launcher" onClick={() => setMenuOpen(v => !v)} title="Veylora launcher"><Star size={25} fill="currentColor" strokeWidth={1.7} /></button>
        <span className="dock-separator" />
        <button className={`dock-icon settings-dock ${settingsOpen ? 'running' : ''}`} aria-label="Open Settings" title="Settings" onClick={() => setSettingsOpen(true)}><SettingsIcon size={23} strokeWidth={1.8} /></button>
        <span className="dock-divider" />
        <div className="system-tray">
          <button className="tray-icon" title="Brightness"><Sun size={15} /></button>
          <button className="tray-icon" title="Network"><Wifi size={15} /></button>
          <button className="tray-icon" title="Volume"><Volume2 size={15} /></button>
          <button className="tray-icon" title="Battery"><BatteryFull size={15} /></button>
          <div className="clock"><span>{formattedTime}</span><small>{formattedDate}</small></div>
        </div>
      </footer>
      <div className="build-label">VEYLORA <span>•</span> EARLY BUILD</div>
    </main>
  );
}
