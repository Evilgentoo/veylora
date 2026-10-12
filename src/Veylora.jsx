import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Yozune from './Yozune';
import Kairune from './Kairune';
import Tunekai from './Tunekai';
import Games from './Games';
import './yozune.css';
import './kairune.css';
import './tunekai.css';
import './games.css';
import {
  Star, Settings as SettingsIcon, Folder, Image as ImageIcon, Wifi, Volume2, BatteryFull, Sun, Minus, Square, X, ChevronRight, Check, Film, Play, Gamepad2, Maximize2, Minimize2 } from 'lucide-react';

const settingsSections = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'system', label: 'System' },
  { id: 'taskbar', label: 'Taskbar' },
  { id: 'tab-cloak', label: 'Tab Cloak' },
  { id: 'about', label: 'About Veylora' },
];

const TAB_CLOAK_PRESETS = [
  { id: 'google-classroom', label: 'Google Classroom', title: 'Google Classroom', url: 'https://classroom.google.com/', iconUrl: 'https://www.gstatic.com/classroom/logo_square_rounded.svg' },
  { id: 'google-docs', label: 'Google Docs', title: 'Google Docs', url: 'https://docs.google.com/document/' },
  { id: 'google-drive', label: 'Google Drive', title: 'Google Drive', url: 'https://drive.google.com/' },
  { id: 'google-slides', label: 'Google Slides', title: 'Google Slides', url: 'https://docs.google.com/presentation/' },
  { id: 'google-sheets', label: 'Google Sheets', title: 'Google Sheets', url: 'https://docs.google.com/spreadsheets/' },
  { id: 'khan-academy', label: 'Khan Academy', title: 'Khan Academy', url: 'https://www.khanacademy.org/' },
  { id: 'desmos', label: 'Desmos', title: 'Desmos | Graphing Calculator', url: 'https://www.desmos.com/' },
  { id: 'geogebra', label: 'GeoGebra', title: 'GeoGebra', url: 'https://www.geogebra.org/' },
  { id: 'quizlet', label: 'Quizlet', title: 'Quizlet', url: 'https://quizlet.com/' },
  { id: 'schoology', label: 'Schoology', title: 'Schoology', url: 'https://www.schoology.com/' },
  { id: 'canvas', label: 'Canvas LMS', title: 'Canvas', url: 'https://canvas.instructure.com/' },
  { id: 'clever', label: 'Clever', title: 'Clever | Portal', url: 'https://clever.com/' },
  { id: 'ixl', label: 'IXL', title: 'IXL | Math, Language Arts, Science, Social Studies', url: 'https://www.ixl.com/' },
  { id: 'deltamath', label: 'DeltaMath', title: 'DeltaMath', url: 'https://www.deltamath.com/' },
  { id: 'prodigy', label: 'Prodigy', title: 'Prodigy Education', url: 'https://www.prodigygame.com/' },
  { id: 'blooket', label: 'Blooket', title: 'Blooket', url: 'https://www.blooket.com/' },
  { id: 'gimkit', label: 'Gimkit', title: 'Gimkit', url: 'https://www.gimkit.com/' },
  { id: 'kahoot', label: 'Kahoot!', title: 'Kahoot!', url: 'https://kahoot.com/' },
  { id: 'quizizz', label: 'Quizizz', title: 'Quizizz', url: 'https://quizizz.com/' },
  { id: 'nearpod', label: 'Nearpod', title: 'Nearpod', url: 'https://nearpod.com/' },
  { id: 'edpuzzle', label: 'Edpuzzle', title: 'Edpuzzle', url: 'https://edpuzzle.com/' },
  { id: 'brainpop', label: 'BrainPOP', title: 'BrainPOP', url: 'https://www.brainpop.com/' },
  { id: 'newsela', label: 'Newsela', title: 'Newsela', url: 'https://newsela.com/' },
  { id: 'ck12', label: 'CK-12', title: 'CK-12', url: 'https://www.ck12.org/' },
  { id: 'amplify', label: 'Amplify', title: 'Amplify', url: 'https://learning.amplify.com/' },
];

// Google Classroom uses its own official square icon. The other sites use
// the Google favicon service with the preset's canonical page URL.
const getTabCloakIcon = (preset) => preset.iconUrl || `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(preset.url)}`;


const LOCAL_WALLPAPER_PRESETS = [
  { id: 'mono-manga', name: 'Mono Manga', file: import.meta.env.BASE_URL + 'wallpapers/mono-manga.jpg', category: 'MONOCHROME', type: 'image' },
  { id: 'abstract', name: 'Abstract', file: import.meta.env.BASE_URL + 'wallpapers/abstract-pink-purple-blue.jpg', category: 'ABSTRACT', type: 'image' },
  { id: 'dreamscape', name: 'Dreamscape', file: import.meta.env.BASE_URL + 'wallpapers/dreamscape.jpg', category: 'DREAMSCAPE', type: 'image' },
  { id: 'anime-girl-captain', name: 'Anime Girl Captain', file: import.meta.env.BASE_URL + 'wallpapers/anime-girl-captain.png', category: 'ANIME', type: 'image' },
  { id: 'black-lambo', name: 'Black Lambo', file: import.meta.env.BASE_URL + 'wallpapers/black-lambo.png', category: 'AUTOMOTIVE', type: 'image' },
  { id: 'broly', name: 'Broly', file: import.meta.env.BASE_URL + 'wallpapers/broly.jpg', category: 'ANIME', type: 'image' },
  { id: 'evangellion', name: 'Evangelion', file: import.meta.env.BASE_URL + 'wallpapers/evangellion.jpg', category: 'ANIME', type: 'image' },
  { id: 'itachi-uchiha-snow', name: 'Itachi: Snowfall', file: import.meta.env.BASE_URL + 'wallpapers/itachi-uchiha-snow.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'knight-of-the-abyss', name: 'Knight of the Abyss', file: import.meta.env.BASE_URL + 'wallpapers/knight-of-the-abyss.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'luffy', name: 'Luffy', file: import.meta.env.BASE_URL + 'wallpapers/luffy.png', category: 'ANIME', type: 'image' },
  { id: 'neon-gaze', name: 'Neon Gaze', file: import.meta.env.BASE_URL + 'wallpapers/neon-gaze-anime-girl.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'red-gun-girl', name: 'Red Gun Girl', file: import.meta.env.BASE_URL + 'wallpapers/red-gun-girl.png', category: 'ANIME', type: 'image' },
  { id: 'shattered-reflection', name: 'Shattered Reflection', file: import.meta.env.BASE_URL + 'wallpapers/shattered-reflection-anime-eyes.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'sonic-x-shadow', name: 'Sonic × Shadow', file: import.meta.env.BASE_URL + 'wallpapers/sonic-x-shadow.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'ssj-goku-blue', name: 'SSJ Goku Blue', file: import.meta.env.BASE_URL + 'wallpapers/ssj-goku-blue.png', category: 'ANIME', type: 'image' },
  { id: 'white-bird', name: 'White Bird', file: import.meta.env.BASE_URL + 'wallpapers/white-bird.png', category: 'NATURE', type: 'image' },
  { id: 'winter-hills', name: 'Winter Hills', file: import.meta.env.BASE_URL + 'wallpapers/winter-hills.png', category: 'LANDSCAPE', type: 'image' },
  { id: 'chainsaw-man', name: 'Chainsaw Man', file: import.meta.env.BASE_URL + 'wallpapers/chainsaw-man.jpg', category: 'ANIME', type: 'image' },
  { id: 'makima', name: 'Makima: Control Devil', file: import.meta.env.BASE_URL + 'wallpapers/makima.jpg', category: 'ANIME', type: 'image' },
  { id: 'fire-and-earth', name: 'Fire & Earth', file: import.meta.env.BASE_URL + 'wallpapers/fire-and-earth.png', category: 'ANIME', type: 'image' },
  { id: 'hyakkimaru-reclaimed', name: 'Hyakkimaru: Reclaimed', file: import.meta.env.BASE_URL + 'wallpapers/hyakkimaru-reclaimed.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'hells-paradise', name: "Hell's Paradise", file: import.meta.env.BASE_URL + 'wallpapers/hells-paradise.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'black-swordsman-crimson-eclipse', name: 'Black Swordsman: Crimson Eclipse', file: import.meta.env.BASE_URL + 'wallpapers/black-swordsman-crimson-eclipse.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'goku-black-ssj-rose', name: 'Goku Black: Super Saiyan Rosé', file: import.meta.env.BASE_URL + 'wallpapers/goku-black-ssj-rose.mp4', category: 'LIVE WALLPAPER', type: 'video' },
  { id: 'cell-black-white', name: 'Cell: Black & White', file: import.meta.env.BASE_URL + 'wallpapers/cell-black-white.png', category: 'ANIME', type: 'image' },
  { id: 'genshin-moonlight', name: 'Genshin: Moonlight', file: import.meta.env.BASE_URL + 'wallpapers/genshin-moonlight.png', category: 'GAMING', type: 'image' },
  { id: 'invincible-blue', name: 'Invincible: Blue', file: import.meta.env.BASE_URL + 'wallpapers/invincible-blue.png', category: 'INVINCIBLE', type: 'image' },
  { id: 'invincible-oxygen-mask', name: 'Invincible: Oxygen Mask', file: import.meta.env.BASE_URL + 'wallpapers/invincible-oxygen-mask.png', category: 'INVINCIBLE', type: 'image' },
  { id: 'invincible-mars', name: 'Invincible: Mars', file: import.meta.env.BASE_URL + 'wallpapers/invincible-mars.jpg', category: 'INVINCIBLE', type: 'image' },
  { id: 'thragg', name: 'Thragg: Grand Regent', file: import.meta.env.BASE_URL + 'wallpapers/thragg.png', category: 'INVINCIBLE', type: 'image' },
  { id: 'kakashi-lightning', name: 'Kakashi: Lightning', file: import.meta.env.BASE_URL + 'wallpapers/kakashi-lightning.jpg', category: 'ANIME', type: 'image' },
  { id: 'kakashi-crimson-mono', name: 'Kakashi: Crimson Mono', file: import.meta.env.BASE_URL + 'wallpapers/kakashi-crimson-mono.png', category: 'ANIME', type: 'image' },
  { id: 'naruto-sasuke-rivals-1', name: 'Naruto & Sasuke: Rivals I', file: import.meta.env.BASE_URL + 'wallpapers/naruto-sasuke-rivals-1.jpg', category: 'ANIME', type: 'image' },
  { id: 'naruto-sasuke-rivals-2', name: 'Naruto & Sasuke: Rivals II', file: import.meta.env.BASE_URL + 'wallpapers/naruto-sasuke-rivals-2.png', category: 'ANIME', type: 'image' },
  { id: 'red-eye', name: 'Red Eye', file: import.meta.env.BASE_URL + 'wallpapers/red-eye.jpg', category: 'ANIME', type: 'image' },
  { id: 'red-eye-tangled', name: 'Red Eye: Tangled', file: import.meta.env.BASE_URL + 'wallpapers/red-eye-tangled.png', category: 'ANIME', type: 'image' },
  { id: 'goku-red-hair-flight', name: 'Goku: Red Hair Flight', file: import.meta.env.BASE_URL + 'wallpapers/goku-red-hair-flight.png', category: 'ANIME', type: 'image' },
  { id: 'zoro-red-eyes', name: 'Zoro: Red Eyes', file: import.meta.env.BASE_URL + 'wallpapers/zoro-red-eyes.png', category: 'ANIME', type: 'image' },
  { id: 'zoro-white-out', name: 'Zoro: White Out', file: import.meta.env.BASE_URL + 'wallpapers/zoro-white-out.jpg', category: 'ANIME', type: 'image' },

  { id: 'chainsaw-cage', name: 'Chainsaw Man: Cage', file: import.meta.env.BASE_URL + 'wallpapers/chainsaw-cage.jpg', category: 'ANIME', type: 'image' },
  { id: 'chainsaw-duo', name: 'Chainsaw Man: Duo', file: import.meta.env.BASE_URL + 'wallpapers/chainsaw-duo.jpg', category: 'ANIME', type: 'image' },
  { id: 'chinese-text', name: 'Chinese Text', file: import.meta.env.BASE_URL + 'wallpapers/chinese-text.png', category: 'TYPOGRAPHY', type: 'image' },
  { id: 'eva-02-asuka', name: 'EVA-02: Asuka', file: import.meta.env.BASE_URL + 'wallpapers/eva-02-asuka.png', category: 'ANIME', type: 'image' },
  { id: 'got-monochrome', name: 'Game of Thrones: Mono', file: import.meta.env.BASE_URL + 'wallpapers/got-monochrome.jpg', category: 'MONOCHROME', type: 'image' },
  { id: 'half-sword', name: 'Half Sword', file: import.meta.env.BASE_URL + 'wallpapers/half-sword.jpg', category: 'FANTASY', type: 'image' },
  { id: 'laughing-scientist', name: 'Laughing Scientist', file: import.meta.env.BASE_URL + 'wallpapers/laughing-scientist.jpg', category: 'MONOCHROME', type: 'image' },
  { id: 'masashi-kishimoto', name: 'Kishimoto Tribute', file: import.meta.env.BASE_URL + 'wallpapers/masashi-kishimoto.jpg', category: 'ANIME', type: 'image' },
  { id: 'razer-mono', name: 'Razer: Monochrome', file: import.meta.env.BASE_URL + 'wallpapers/razer-mono.jpg', category: 'BRANDING', type: 'image' },
  { id: 'skull-mono', name: 'Skull: Monochrome', file: import.meta.env.BASE_URL + 'wallpapers/skull-mono.jpg', category: 'MONOCHROME', type: 'image' },
  { id: 'nissan-japanese-car', name: 'Nissan Japanese Car', file: import.meta.env.BASE_URL + 'wallpapers/nissan-japanese-car.png', category: 'AUTOMOTIVE', type: 'image' },
  { id: 'pepe-frog', name: 'Pepe Frog', file: import.meta.env.BASE_URL + 'wallpapers/pepe-frog.png', category: 'MEME', type: 'image' },
];

const ACCENT_PRESETS = [
  { id: 'sakura', name: 'Sakura', color: '#f18ac9' },
  { id: 'violet', name: 'Violet', color: '#a78bfa' },
  { id: 'ocean', name: 'Ocean', color: '#67c7ed' },
  { id: 'mint', name: 'Mint', color: '#7ee0b0' },
  { id: 'crimson', name: 'Crimson', color: '#fa778c' },
  { id: 'amber', name: 'Amber', color: '#f5c16c' },
  { id: 'aurora', name: 'Aurora', color: '#2dd4bf' },
  { id: 'lagoon', name: 'Lagoon', color: '#38bdf8' },
  { id: 'citrus', name: 'Citrus', color: '#c6e23c' },
  { id: 'ember', name: 'Ember', color: '#ff7a45' },
  { id: 'orchid', name: 'Orchid', color: '#d16bff' },
  { id: 'frost', name: 'Frost', color: '#cfe3ff' },
  { id: 'rose-gold', name: 'Rose Gold', color: '#e8a598' },
  { id: 'ultraviolet', name: 'Ultraviolet', color: '#6c5cff' },
  { id: 'cobalt', name: 'Cobalt', color: '#3b6cff' },
];

const WIDGET_IDS = ['digital', 'calendar', 'analog'];
const WIDGET_SIZE = { digital: { w: 240, h: 92 }, calendar: { w: 236, h: 224 }, analog: { w: 160, h: 160 } };
const WIDGET_DEFAULT_ON = { digital: false, calendar: false, analog: false };
const WIDGET_DEFAULT_POS = { digital: { x: 1, y: 0 }, calendar: { x: 1, y: 0.15 }, analog: { x: 1, y: 0.42 } };

function readWidgetJson(key, fallback, kind) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    if (!raw || typeof raw !== 'object') return fallback;
    const out = {};
    for (const id of WIDGET_IDS) {
      const v = raw[id];
      if (kind === 'pos') {
        out[id] = v && Number.isFinite(v.x) && Number.isFinite(v.y)
          ? { x: Math.min(1, Math.max(0, v.x)), y: Math.min(1, Math.max(0, v.y)) }
          : fallback[id];
      } else {
        out[id] = typeof v === 'boolean' ? v : fallback[id];
      }
    }
    return out;
  } catch { return fallback; }
}

function DigitalClockWidget({ now }) {
  const h = now.getHours();
  const hh = String(h % 12 || 12).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return (
    <div className="widget-digital">
      <span className="widget-digital-time">{hh}:{mm}</span>
      <span className="widget-digital-ampm">{h >= 12 ? 'PM' : 'AM'}</span>
    </div>
  );
}

function CalendarWidget({ now }) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const today = now.getDate();
  const lead = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const monthName = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  return (
    <div className="widget-calendar">
      <div className="widget-cal-month">{monthName}</div>
      <div className="widget-cal-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={'h' + i} className="widget-cal-dow">{d}</span>)}
        {cells.map((d, i) => <span key={i} className={`widget-cal-day ${d === today ? 'today' : ''}`}>{d || ''}</span>)}
      </div>
    </div>
  );
}

function AnalogClockWidget({ now }) {
  const s = now.getSeconds();
  const mi = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + mi / 60;
  const hand = (deg, len, tail, w, color) => (
    <line x1="80" y1={80 + tail} x2="80" y2={80 - len} stroke={color} strokeWidth={w} strokeLinecap="round" transform={`rotate(${deg} 80 80)`} />
  );
  return (
    <div className="widget-analog">
      <svg viewBox="0 0 160 160" width="100%" height="100%" aria-hidden="true">
        <circle cx="80" cy="80" r="68" fill="rgba(0,0,0,0.38)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const a = ((n * 30 - 90) * Math.PI) / 180;
          return <text key={n} x={80 + Math.cos(a) * 52} y={80 + Math.sin(a) * 52} fill="#f5f2f8" fontSize="13" textAnchor="middle" dominantBaseline="central">{n}</text>;
        })}
        {hand(h * 30, 36, 6, 4, '#f5f2f8')}
        {hand(mi * 6, 54, 8, 3, '#f5f2f8')}
        {hand(s * 6, 58, 14, 1.6, '#ff9f0a')}
        <circle cx="80" cy="80" r="3.2" fill="#ff9f0a" />
      </svg>
    </div>
  );
}

function WidgetsLayer({ on, pos, locked, opacity, blur, onCommit }) {
  const active = WIDGET_IDS.filter(id => on[id]);
  const anyOn = active.length > 0;
  const [now, setNow] = useState(() => new Date());
  const [drag, setDrag] = useState(null);
  const layerRef = useRef(null);
  useEffect(() => {
    if (!anyOn) return;
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [anyOn]);
  if (!anyOn) return null;

  const startDrag = (id) => (e) => {
    if (locked || e.button !== 0) return;
    const layer = layerRef.current;
    if (!layer) return;
    e.preventDefault();
    const rect = layer.getBoundingClientRect();
    const size = WIDGET_SIZE[id];
    const freeW = Math.max(1, rect.width - size.w - 40);
    const freeH = Math.max(1, rect.height - size.h - 120);
    const start = pos[id];
    const sx = e.clientX;
    const sy = e.clientY;
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch {}
    let cur = start;
    const move = (ev) => {
      cur = {
        x: Math.min(1, Math.max(0, start.x + (ev.clientX - sx) / freeW)),
        y: Math.min(1, Math.max(0, start.y + (ev.clientY - sy) / freeH)),
      };
      setDrag({ id, ...cur });
    };
    const up = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      setDrag(null);
      onCommit(id, cur);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  };

  return (
    <div ref={layerRef} className={`widgets-layer ${locked ? 'locked' : 'unlocked'}`} style={{ '--w-opacity': opacity / 100, '--w-blur': `${blur}px` }}>
      {active.map(id => {
        const p = drag && drag.id === id ? drag : pos[id];
        const { w, h } = WIDGET_SIZE[id];
        return (
          <div
            key={id}
            className={`widget widget-${id}`}
            onPointerDown={startDrag(id)}
            style={{ width: w, height: h, left: `calc(20px + (100% - ${w + 40}px) * ${p.x})`, top: `calc(20px + (100% - ${h + 120}px) * ${p.y})` }}
          >
            {id === 'digital' && <DigitalClockWidget now={now} />}
            {id === 'calendar' && <CalendarWidget now={now} />}
            {id === 'analog' && <AnalogClockWidget now={now} />}
          </div>
        );
      })}
    </div>
  );
}


export default function Veylora() {
  const desktopRef = useRef(null);
  const [siteFullscreen, setSiteFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => {
      const desktop = desktopRef.current;
      const activeElement = document.fullscreenElement || document.webkitFullscreenElement || null;
      setSiteFullscreen(Boolean(desktop && activeElement === desktop));
    };
    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('webkitfullscreenchange', syncFullscreenState);
    syncFullscreenState();
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
      document.removeEventListener('webkitfullscreenchange', syncFullscreenState);
    };
  }, []);

  const toggleSiteFullscreen = () => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    setFullscreenError(false);

    const activeElement = document.fullscreenElement || document.webkitFullscreenElement || null;
    if (activeElement === desktop) {
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
      if (!exitFullscreen) {
        setFullscreenError(true);
        return;
      }
      try {
        const result = exitFullscreen.call(document);
        Promise.resolve(result).catch(() => setFullscreenError(true));
      } catch {
        setFullscreenError(true);
      }
      return;
    }

    const requestFullscreen = desktop.requestFullscreen || desktop.webkitRequestFullscreen;
    if (!requestFullscreen) {
      setFullscreenError(true);
      return;
    }
    try {
      // Call this synchronously in the real click handler for browser permission policies.
      const result = requestFullscreen.call(desktop);
      Promise.resolve(result).then(() => setFullscreenError(false)).catch(() => setFullscreenError(true));
    } catch {
      setFullscreenError(true);
    }
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [yozuneOpen, setYozuneOpen] = useState(false);
  const [yozuneMaximized, setYozuneMaximized] = useState(false);
  const [yozunePosition, setYozunePosition] = useState({ x: 0, y: 0 });
  const [yozuneDragging, setYozuneDragging] = useState(false);
  const yozuneDragOrigin = useRef(null);

  const [kairuneOpen, setKairuneOpen] = useState(false);
  const [kairuneMaximized, setKairuneMaximized] = useState(false);
  const [kairunePosition, setKairunePosition] = useState({ x: 0, y: 0 });
  const [kairuneDragging, setKairuneDragging] = useState(false);
  const kairuneDragOrigin = useRef(null);
  const [tunekaiOpen, setTunekaiOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [gamesMaximized, setGamesMaximized] = useState(false);
  const [tunekaiMaximized, setTunekaiMaximized] = useState(false);

  const [taskbarOpacity, setTaskbarOpacity] = useState(() => Number(localStorage.getItem('veylora.taskbarOpacity') ?? 73));
  const [taskbarBlur, setTaskbarBlur] = useState(() => Number(localStorage.getItem('veylora.taskbarBlur') ?? 28));
  const [taskbarRadius, setTaskbarRadius] = useState(() => Number(localStorage.getItem('veylora.taskbarRadius') ?? 23));
  const [taskbarScaleX, setTaskbarScaleX] = useState(() => Math.max(100, Number(localStorage.getItem('veylora.taskbarScaleX') ?? 100)));
  const [taskbarScaleY, setTaskbarScaleY] = useState(() => Number(localStorage.getItem('veylora.taskbarScaleY') ?? 100));
  useEffect(() => { localStorage.setItem('veylora.taskbarOpacity', String(taskbarOpacity)); }, [taskbarOpacity]);
  useEffect(() => { localStorage.setItem('veylora.taskbarBlur', String(taskbarBlur)); }, [taskbarBlur]);
  useEffect(() => { localStorage.setItem('veylora.taskbarRadius', String(taskbarRadius)); }, [taskbarRadius]);
  useEffect(() => { localStorage.setItem('veylora.taskbarScaleX', String(taskbarScaleX)); }, [taskbarScaleX]);
  useEffect(() => { localStorage.setItem('veylora.taskbarScaleY', String(taskbarScaleY)); }, [taskbarScaleY]);

  const [activeSection, setActiveSection] = useState('appearance');
  const [tabCloakPreset, setTabCloakPreset] = useState(() => {
    try {
      const saved = localStorage.getItem('veylora.tabCloakPreset');
      return TAB_CLOAK_PRESETS.some((preset) => preset.id === saved) ? saved : 'google-classroom';
    } catch { return 'google-classroom'; }
  });
  const [tabCloakEnabled, setTabCloakEnabled] = useState(() => {
    try { return localStorage.getItem('veylora.tabCloakEnabled') === 'true'; } catch { return false; }
  });
  const originalTabMetadata = useRef(null);
  const [maximized, setMaximized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 18, y: 18 });
  const [wallpaper, setWallpaper] = useState(() => {
    try { return localStorage.getItem('veylora.wallpaper') || ''; } catch { return ''; }
  });
  const [theme, setTheme] = useState(() => {
    try { const v = localStorage.getItem('veylora.theme'); return ['dark', 'light', 'auto'].includes(v) ? v : 'dark'; } catch { return 'dark'; }
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
    try { localStorage.setItem('veylora.tabCloakPreset', tabCloakPreset); } catch { /* local storage can be unavailable */ }
  }, [tabCloakPreset]);

  useEffect(() => {
    try { localStorage.setItem('veylora.tabCloakEnabled', String(tabCloakEnabled)); } catch { /* local storage can be unavailable */ }
  }, [tabCloakEnabled]);

  useEffect(() => {
    let iconLink = document.querySelector('link[rel~="icon"]');
    if (!originalTabMetadata.current) {
      originalTabMetadata.current = {
        title: document.title,
        hadIcon: Boolean(iconLink),
        iconHref: iconLink ? iconLink.getAttribute('href') : null,
      };
    }

    if (tabCloakEnabled) {
      const preset = TAB_CLOAK_PRESETS.find((entry) => entry.id === tabCloakPreset) || TAB_CLOAK_PRESETS[0];
      document.title = preset.title;
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      iconLink.href = getTabCloakIcon(preset);
    } else {
      const original = originalTabMetadata.current;
      document.title = original.title || 'Veylora OS';
      const currentIcon = document.querySelector('link[rel~="icon"]');
      if (original.hadIcon) {
        if (currentIcon && original.iconHref) currentIcon.setAttribute('href', original.iconHref);
        else if (currentIcon && !original.iconHref) currentIcon.removeAttribute('href');
      } else if (currentIcon) {
        currentIcon.remove();
      }
    }
  }, [tabCloakEnabled, tabCloakPreset]);

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

  useEffect(() => {
    if (!yozuneDragging) return;
    const move = (event) => {
      if (!yozuneDragOrigin.current) return;
      setYozunePosition({
        x: event.clientX - yozuneDragOrigin.current.pointerX + yozuneDragOrigin.current.startX,
        y: event.clientY - yozuneDragOrigin.current.pointerY + yozuneDragOrigin.current.startY,
      });
    };
    const up = () => {
      setYozuneDragging(false);
      yozuneDragOrigin.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [yozuneDragging]);

  useEffect(() => {
    if (!kairuneDragging) return;
    const move = (event) => {
      if (!kairuneDragOrigin.current) return;
      setKairunePosition({
        x: event.clientX - kairuneDragOrigin.current.pointerX + kairuneDragOrigin.current.startX,
        y: event.clientY - kairuneDragOrigin.current.pointerY + kairuneDragOrigin.current.startY,
      });
    };
    const up = () => {
      setKairuneDragging(false);
      kairuneDragOrigin.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [kairuneDragging]);

  const beginDrag = (event) => {
    if (maximized || event.target.closest('button')) return;
    dragOrigin.current = {
      pointerX: event.clientX, pointerY: event.clientY,
      startX: position.x, startY: position.y
    };
    setDragging(true);
  };

  const beginYozuneDrag = (event) => {
    if (yozuneMaximized || event.target.closest('button')) return;
    yozuneDragOrigin.current = {
      pointerX: event.clientX, pointerY: event.clientY,
      startX: yozunePosition.x, startY: yozunePosition.y
    };
    setYozuneDragging(true);
  };

  const beginKairuneDrag = (event) => {
    if (kairuneMaximized || event.target.closest('button')) return;
    kairuneDragOrigin.current = {
      pointerX: event.clientX, pointerY: event.clientY,
      startX: kairunePosition.x, startY: kairunePosition.y
    };
    setKairuneDragging(true);
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
  useEffect(() => {
    try { localStorage.setItem('veylora.theme', theme); } catch {}
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
    const apply = () => {
      const resolved = theme === 'auto' ? (mq && mq.matches ? 'light' : 'dark') : theme;
      document.documentElement.setAttribute('data-theme', resolved);
    };
    apply();
    if (theme === 'auto' && mq) {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  const [motionMode, setMotionMode] = useState(() => {
    try { const v = localStorage.getItem('veylora.motionMode'); return ['auto', 'reduced', 'full'].includes(v) ? v : 'auto'; } catch { return 'auto'; }
  });
  const [animSpeed, setAnimSpeed] = useState(() => {
    try { const v = Number(localStorage.getItem('veylora.animSpeed')); return v >= 50 && v <= 200 ? v : 100; } catch { return 100; }
  });
  const [lightweight, setLightweight] = useState(() => {
    try { return localStorage.getItem('veylora.lightweight') === '1'; } catch { return false; }
  });
  useEffect(() => { try { localStorage.setItem('veylora.motionMode', motionMode); } catch {} }, [motionMode]);
  useEffect(() => { try { localStorage.setItem('veylora.animSpeed', String(animSpeed)); } catch {} }, [animSpeed]);
  useEffect(() => { try { localStorage.setItem('veylora.lightweight', lightweight ? '1' : '0'); } catch {} }, [lightweight]);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const root = document.documentElement;
      root.classList.toggle('motion-reduced', motionMode === 'reduced' || (motionMode === 'auto' && mq.matches));
      root.classList.toggle('lightweight', lightweight);
      root.style.setProperty('--anim-speed', String(animSpeed / 100));
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [motionMode, lightweight, animSpeed]);

  useEffect(() => {
    if (!lightweight) return;
    const freeze = (v) => { try { v.autoplay = false; v.pause(); } catch {} };
    const sweep = () => document.querySelectorAll('video').forEach(freeze);
    sweep();
    const mo = new MutationObserver(sweep);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      document.querySelectorAll('video').forEach((v) => {
        v.autoplay = true;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      });
    };
  }, [lightweight]);

  const windowRef = useRef(null);
  const exitingRef = useRef(false);
  const GENIE_FULL = 'polygon(-10% -10%, 110% -10%, 110% 110%, -10% 110%)';
  const GENIE_MID = 'polygon(-10% -10%, 110% -10%, 84% 100%, 16% 100%)';
  const GENIE_END = 'polygon(40% 0%, 60% 0%, 52% 100%, 48% 100%)';
  const motionOff = () => document.documentElement.classList.contains('motion-reduced');
  const motionSpeed = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim-speed')) || 1;
  const genieMotion = (el) => {
    const icon = document.querySelector('.settings-dock');
    const ir = icon ? icon.getBoundingClientRect() : { left: window.innerWidth / 2 - 22, top: window.innerHeight - 70, width: 44, height: 44 };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el).transform;
    const m = new DOMMatrixReadOnly(cs === 'none' ? undefined : cs);
    const sx = Math.max(ir.width / r.width, 0.05);
    const sy = Math.max(ir.height / r.height, 0.05);
    const tx = ir.left + ir.width / 2;
    const ty = ir.top + ir.height / 2;
    return {
      translate: `${tx - (r.left + r.width / 2) + m.e * (1 - sx)}px ${ty - r.bottom + m.f * (1 - sy)}px`,
      scale: `${sx} ${sy}`,
    };
  };
  const closeWindow = (kind) => {
    const el = windowRef.current;
    if (exitingRef.current) return;
    if (!el || motionOff() || typeof el.animate !== 'function') { setSettingsOpen(false); return; }
    exitingRef.current = true;
    el.style.pointerEvents = 'none';
    const end = genieMotion(el);
    const anim = el.animate([
      { translate: '0px 0px', scale: '1 1', clipPath: GENIE_FULL, opacity: 1, offset: 0 },
      { clipPath: GENIE_MID, offset: 0.5 },
      { opacity: 1, offset: 0.8 },
      { ...end, clipPath: GENIE_END, opacity: 0, offset: 1 },
    ], { duration: (kind === 'minimize' ? 520 : 400) / motionSpeed(), easing: 'cubic-bezier(.45, .05, .85, .35)', fill: 'forwards' });
    const finish = () => { exitingRef.current = false; setSettingsOpen(false); };
    anim.onfinish = finish;
    anim.oncancel = finish;
  };
  useLayoutEffect(() => {
    if (!settingsOpen) return;
    const el = windowRef.current;
    if (!el || motionOff() || typeof el.animate !== 'function') return;
    const from = genieMotion(el);
    el.animate([
      { ...from, clipPath: GENIE_END, opacity: 0, offset: 0 },
      { clipPath: GENIE_MID, opacity: 1, offset: 0.5 },
      { translate: '0px 0px', scale: '1 1', clipPath: GENIE_FULL, opacity: 1, offset: 1 },
    ], { duration: 460 / motionSpeed(), easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
  }, [settingsOpen]);

  const maxFromRef = useRef(null);
  const toggleMaximize = () => {
    const el = windowRef.current;
    if (el && !motionOff() && typeof el.animate === 'function') {
      const r = el.getBoundingClientRect();
      maxFromRef.current = { l: r.left, t: r.top, w: r.width, h: r.height, radius: getComputedStyle(el).borderRadius };
    }
    setMaximized(v => !v);
    setPosition({ x: 0, y: 0 });
  };
  useLayoutEffect(() => {
    const from = maxFromRef.current;
    maxFromRef.current = null;
    const el = windowRef.current;
    if (!from || !el || typeof el.animate !== 'function' || motionOff()) return;
    const pr = (el.offsetParent || document.body).getBoundingClientRect();
    const r = el.getBoundingClientRect();
    el.animate([
      { left: `${from.l - pr.left}px`, top: `${from.t - pr.top}px`, width: `${from.w}px`, height: `${from.h}px`, borderRadius: from.radius, transform: 'none' },
      { left: `${r.left - pr.left}px`, top: `${r.top - pr.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: getComputedStyle(el).borderRadius, transform: 'none' },
    ], { duration: 360 / motionSpeed(), easing: 'cubic-bezier(.22, 1, .36, 1)' });
  }, [maximized]);

  const [trailOn, setTrailOn] = useState(() => { try { return localStorage.getItem('veylora.trailOn') === '1'; } catch { return false; } });
  const [trailLength, setTrailLength] = useState(() => { try { const v = Number(localStorage.getItem('veylora.trailLength')); return v >= 20 && v <= 100 ? v : 50; } catch { return 50; } });
  const [trailSize, setTrailSize] = useState(() => { try { const v = Number(localStorage.getItem('veylora.trailSize')); return v >= 2 && v <= 12 ? v : 6; } catch { return 6; } });
  useEffect(() => { try { localStorage.setItem('veylora.trailOn', trailOn ? '1' : '0'); } catch {} }, [trailOn]);
  useEffect(() => { try { localStorage.setItem('veylora.trailLength', String(trailLength)); } catch {} }, [trailLength]);
  useEffect(() => { try { localStorage.setItem('veylora.trailSize', String(trailSize)); } catch {} }, [trailSize]);
  const trailCanvasRef = useRef(null);
  const lastPtrRef = useRef(null);
  useEffect(() => {
    const track = (e) => { if (e.pointerType !== 'touch') lastPtrRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointermove', track, { passive: true });
    return () => window.removeEventListener('pointermove', track);
  }, []);
  useEffect(() => {
    if (!trailOn) return;
    const canvas = trailCanvasRef.current;
    const ctx = canvas && canvas.getContext('2d');
    if (!canvas || !ctx) return;
    const hex = String(accent || '').replace('#', '');
    const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    const num = parseInt(full, 16);
    const rgb = full.length === 6 && Number.isFinite(num) ? [(num >> 16) & 255, (num >> 8) & 255, num & 255] : [241, 138, 201];
    const bright = rgb.map(c => Math.min(255, c + 70));
    const N = 26;
    const rate = 0.40 - (trailLength / 100) * 0.28;
    const maxW = trailSize;
    const root = document.documentElement;
    const suppressed = () => root.classList.contains('motion-reduced') || root.classList.contains('lightweight');
    let W = window.innerWidth, H = window.innerHeight;
    let pts = [];
    let target = lastPtrRef.current ? { ...lastPtrRef.current } : null;
    let inside = true, raf = 0, last = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const reset = () => { pts = target ? Array.from({ length: N }, () => ({ x: target.x, y: target.y })) : []; };
    const ribbon = (wMul, aMul, c) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
        if (len < 0.05) continue;
        const ka = 1 - (i - 1) / (pts.length - 1), kb = 1 - i / (pts.length - 1);
        const wa = Math.max(0.3, maxW * Math.pow(ka, 0.85) * wMul) / 2;
        const wb = Math.max(0.15, maxW * Math.pow(kb, 0.85) * wMul) / 2;
        const nx = -dy / len, ny = dx / len;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${Math.pow(Math.max(kb, 0), 1.1) * aMul})`;
        ctx.beginPath();
        ctx.moveTo(a.x + nx * wa, a.y + ny * wa);
        ctx.lineTo(b.x + nx * wb, b.y + ny * wb);
        ctx.lineTo(b.x - nx * wb, b.y - ny * wb);
        ctx.lineTo(a.x - nx * wa, a.y - ny * wa);
        ctx.closePath();
        ctx.fill();
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (suppressed() || !inside || pts.length < 2) return;
      ribbon(3.2, 0.18, rgb);
      ribbon(1, 0.92, bright);
      const h = pts[0];
      const gr = maxW * 2.8;
      const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, gr);
      g.addColorStop(0, `rgba(${bright[0]},${bright[1]},${bright[2]},0.6)`);
      g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(h.x, h.y, gr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${bright[0]},${bright[1]},${bright[2]},0.95)`;
      ctx.beginPath();
      ctx.arc(h.x, h.y, Math.max(1.2, maxW * 0.5), 0, Math.PI * 2);
      ctx.fill();
    };
    const step = (now) => {
      const dt = Math.min(now - (last || now), 50);
      last = now;
      const kk = 1 - Math.pow(1 - rate, dt / 16.67);
      let moving = false;
      if (target && pts.length) {
        pts[0].x = target.x; pts[0].y = target.y;
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i], q = pts[i - 1];
          const dx = q.x - p.x, dy = q.y - p.y;
          p.x += dx * kk; p.y += dy * kk;
          if (Math.abs(dx) > 0.08 || Math.abs(dy) > 0.08) moving = true;
        }
      }
      draw();
      raf = moving && inside && !document.hidden ? requestAnimationFrame(step) : 0;
      if (!raf) last = 0;
    };
    const wake = () => { if (!raf && !document.hidden) { last = 0; raf = requestAnimationFrame(step); } };
    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      target = { x: e.clientX, y: e.clientY };
      if (!pts.length) reset();
      inside = true;
      wake();
    };
    const onLeave = () => { inside = false; draw(); };
    const onEnter = () => { inside = true; wake(); };
    const onVisible = () => { if (!document.hidden) wake(); };
    const onResize = () => { resize(); draw(); };
    const mo = new MutationObserver(() => { draw(); wake(); });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    resize();
    reset();
    draw();
    wake();
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('mouseleave', onLeave);
    root.addEventListener('mouseenter', onEnter);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      mo.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      root.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('visibilitychange', onVisible);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trailOn, trailLength, trailSize, accent]);

  const [cursorStyle, setCursorStyle] = useState(() => { try { const v = localStorage.getItem('veylora.cursorStyle'); return ['default', 'arrow', 'dot'].includes(v) ? v : 'default'; } catch { return 'default'; } });
  const [rippleOn, setRippleOn] = useState(() => { try { return localStorage.getItem('veylora.rippleOn') === '1'; } catch { return false; } });
  useEffect(() => { try { localStorage.setItem('veylora.cursorStyle', cursorStyle); } catch {} }, [cursorStyle]);
  useEffect(() => { try { localStorage.setItem('veylora.rippleOn', rippleOn ? '1' : '0'); } catch {} }, [rippleOn]);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('cursor-custom');
    root.style.removeProperty('--cursor-main');
    root.style.removeProperty('--cursor-hover');
    if (cursorStyle === 'default') return;
    const hex = String(accent || '').replace('#', '');
    const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
    const color = full.length === 6 && Number.isFinite(parseInt(full, 16)) ? '#' + full : '#f18ac9';
    const enc = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    let main, hover, hx, hy;
    if (cursorStyle === 'arrow') {
      const arrow = (fill, stroke) => `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M5 3 L5 21 L9.8 16.6 L13 24 L16.2 22.6 L13 15.3 L19.5 15.3 Z' fill='${fill}' stroke='${stroke}' stroke-width='1.6' stroke-linejoin='round'/></svg>`;
      main = enc(arrow(color, '#ffffff'));
      hover = enc(arrow('#ffffff', color));
      hx = 5; hy = 3;
    } else {
      const wrap = (inner) => `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>${inner}</svg>`;
      main = enc(wrap(`<circle cx='14' cy='14' r='9' fill='${color}' fill-opacity='0.25'/><circle cx='14' cy='14' r='5.5' fill='${color}' stroke='#ffffff' stroke-width='2'/>`));
      hover = enc(wrap(`<circle cx='14' cy='14' r='11' fill='#ffffff' fill-opacity='0.2' stroke='${color}' stroke-width='2.5'/><circle cx='14' cy='14' r='3.5' fill='#ffffff'/>`));
      hx = 14; hy = 14;
    }
    root.style.setProperty('--cursor-main', `${main} ${hx} ${hy}, auto`);
    root.style.setProperty('--cursor-hover', `${hover} ${hx} ${hy}, pointer`);
    root.classList.add('cursor-custom');
  }, [cursorStyle, accent]);
  useEffect(() => {
    if (!rippleOn) return;
    const root = document.documentElement;
    const onDown = (e) => {
      if (e.button !== 0) return;
      if (root.classList.contains('motion-reduced') || root.classList.contains('lightweight')) return;
      if (typeof Element.prototype.animate !== 'function') return;
      const speed = parseFloat(getComputedStyle(root).getPropertyValue('--anim-speed')) || 1;
      const size = 90;
      const el = document.createElement('div');
      el.className = 'click-ripple';
      el.style.left = `${e.clientX - size / 2}px`;
      el.style.top = `${e.clientY - size / 2}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.setProperty('--ripple-color', accent);
      document.body.appendChild(el);
      const anim = el.animate(
        [{ transform: 'scale(0.15)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0 }],
        { duration: 520 / speed, easing: 'cubic-bezier(.2, .7, .3, 1)' }
      );
      anim.onfinish = () => el.remove();
      anim.oncancel = () => el.remove();
    };
    window.addEventListener('pointerdown', onDown, { capture: true, passive: true });
    return () => window.removeEventListener('pointerdown', onDown, { capture: true });
  }, [rippleOn, accent]);

  const [widgetsOn, setWidgetsOn] = useState(() => readWidgetJson('veylora.widgetsOn', WIDGET_DEFAULT_ON, 'on'));
  const [widgetPos, setWidgetPos] = useState(() => readWidgetJson('veylora.widgetPos', WIDGET_DEFAULT_POS, 'pos'));
  const [widgetsLocked, setWidgetsLocked] = useState(() => { try { return localStorage.getItem('veylora.widgetsLocked') === '1'; } catch { return false; } });
  const [widgetOpacity, setWidgetOpacity] = useState(() => { try { const v = Number(localStorage.getItem('veylora.widgetOpacity')); return v >= 15 && v <= 100 ? v : 62; } catch { return 62; } });
  const [widgetBlur, setWidgetBlur] = useState(() => { try { const v = Number(localStorage.getItem('veylora.widgetBlur')); return v >= 0 && v <= 40 ? v : 24; } catch { return 24; } });
  useEffect(() => { try { localStorage.setItem('veylora.widgetsOn', JSON.stringify(widgetsOn)); } catch {} }, [widgetsOn]);
  useEffect(() => { try { localStorage.setItem('veylora.widgetPos', JSON.stringify(widgetPos)); } catch {} }, [widgetPos]);
  useEffect(() => { try { localStorage.setItem('veylora.widgetsLocked', widgetsLocked ? '1' : '0'); } catch {} }, [widgetsLocked]);
  useEffect(() => { try { localStorage.setItem('veylora.widgetOpacity', String(widgetOpacity)); } catch {} }, [widgetOpacity]);
  useEffect(() => { try { localStorage.setItem('veylora.widgetBlur', String(widgetBlur)); } catch {} }, [widgetBlur]);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const taskbarRef = useRef(null);
  useLayoutEffect(() => {
    const el = taskbarRef.current;
    if (!el) return;
    const apply = () => {
      el.style.width = 'max-content';
      const base = parseFloat(getComputedStyle(el).width);
      el.style.width = `${Math.round(base * Math.max(100, taskbarScaleX) / 100)}px`;
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [taskbarScaleX, taskbarScaleY, formattedTime, formattedDate]);


  const openInAboutBlank = () => {
    const preset = TAB_CLOAK_PRESETS.find((entry) => entry.id === tabCloakPreset) || TAB_CLOAK_PRESETS[0];
    const blankWindow = window.open('about:blank', '_blank');
    if (!blankWindow) {
      window.alert('Veylora could not open a new tab. Allow pop-ups for this site and try again.');
      return;
    }

    blankWindow.document.title = preset.title;
    const iconLink = blankWindow.document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.href = getTabCloakIcon(preset);
    blankWindow.document.head.appendChild(iconLink);
    blankWindow.document.documentElement.style.cssText = 'width:100%;height:100%;margin:0;overflow:hidden;background:#09090d;';
    blankWindow.document.body.style.cssText = 'width:100%;height:100%;margin:0;overflow:hidden;background:#09090d;';

    const frame = blankWindow.document.createElement('iframe');
    frame.title = 'Veylora';
    frame.src = window.location.href;
    frame.allow = 'fullscreen; autoplay; gamepad; clipboard-read; clipboard-write';
    frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;display:block;background:#09090d;';
    blankWindow.document.body.appendChild(frame);
  };

  return (
    <main
      ref={desktopRef}
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
        const menuWidth = 168;
        const menuHeight = 100;
        setMenuPosition({
          x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
          y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight - 8)),
        });
        setMenuOpen(true);
      }}
    >
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
          ref={windowRef} className={`window settings-window ${maximized ? 'maximized' : ''}`}
          style={!maximized ? { transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` } : undefined}
          aria-label="Settings"
        >
          <header className="window-titlebar" onPointerDown={beginDrag} onDoubleClick={(e) => { if (!e.target.closest('button')) toggleMaximize(); }}>
            <div className="window-controls">
              <button className="window-control close" aria-label="Close settings" onClick={() => closeWindow('close')}><X size={12} /></button>
              <button className="window-control minimize" aria-label="Minimize settings" onClick={() => closeWindow('minimize')}><Minus size={12} /></button>
              <button className="window-control maximize" aria-label="Toggle maximize" onClick={toggleMaximize}><Square size={10} /></button>
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
                    <div className="theme-label">COLOR MODE</div>
                    <div className="theme-row" role="group" aria-label="Color mode">
                      {[['dark', 'Dark'], ['light', 'Light'], ['auto', 'Auto']].map(([id, label]) => (
                        <button key={id} type="button" className={`theme-option ${theme === id ? 'chosen' : ''}`} aria-pressed={theme === id} onClick={() => setTheme(id)}>{label}</button>
                      ))}
                    </div>
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
              <div className="settings-card widgets-card">
                <div className="card-heading">WIDGETS <span className="tiny-tag">DESKTOP</span></div>
                {[['digital', 'DIGITAL CLOCK'], ['calendar', 'CALENDAR'], ['analog', 'ANALOG CLOCK']].map(([id, label]) => (
                  <div className="sys-row sys-row-border" key={id}>
                    <span className="sys-label">{label}</span>
                    <button className={`sys-switch ${widgetsOn[id] ? 'on' : ''}`} role="switch" aria-checked={widgetsOn[id]} aria-label={label} onClick={() => setWidgetsOn(prev => ({ ...prev, [id]: !prev[id] }))}><span /></button>
                  </div>
                ))}
                <div className="sys-row sys-row-border">
                  <span className="sys-label">LOCK POSITIONS</span>
                  <button className={`sys-switch ${widgetsLocked ? 'on' : ''}`} role="switch" aria-checked={widgetsLocked} aria-label="Lock widget positions" onClick={() => setWidgetsLocked(v => !v)}><span /></button>
                </div>
                <p className="setting-note">While positions are unlocked, drag a widget on the desktop to move it. Lock them to keep them in place.</p>
                <label className="taskbar-slider-row">
                  <span className="taskbar-slider-label"><span>OPACITY</span><span className="taskbar-slider-value">{widgetOpacity}%</span></span>
                  <input type="range" min="15" max="100" value={widgetOpacity} onChange={(e) => setWidgetOpacity(Number(e.target.value))} />
                </label>
                <label className="taskbar-slider-row">
                  <span className="taskbar-slider-label"><span>GLASS BLUR</span><span className="taskbar-slider-value">{widgetBlur} px</span></span>
                  <input type="range" min="0" max="40" value={widgetBlur} onChange={(e) => setWidgetBlur(Number(e.target.value))} />
                </label>
                <button className="taskbar-reset" onClick={() => { setWidgetPos(WIDGET_DEFAULT_POS); setWidgetsLocked(false); setWidgetOpacity(62); setWidgetBlur(24); }}>RESET DEFAULTS</button>
              </div>
                </div>
              )}
              {activeSection === 'system' && (
                <div className="settings-card sys-card">
                  <div className="card-heading">MOTION &amp; PERFORMANCE <span className="tiny-tag">LIVE</span></div>
                  <div className="sys-row">
                    <span className="sys-label">MOTION</span>
                    <div className="sys-seg" role="group" aria-label="Motion">
                      {[['auto', 'AUTO'], ['reduced', 'REDUCED'], ['full', 'FULL']].map(([val, label]) => (
                        <button key={val} className={`sys-seg-btn ${motionMode === val ? 'chosen' : ''}`} aria-pressed={motionMode === val} onClick={() => setMotionMode(val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <p className="setting-note">Auto follows your browser's reduced-motion preference. Reduced turns off animations and hover movement.</p>
                  <label className="taskbar-slider-row">
                    <span className="taskbar-slider-label"><span>ANIMATION SPEED</span><span className="taskbar-slider-value">{animSpeed}%</span></span>
                    <input type="range" min="50" max="200" step="10" value={animSpeed} onChange={(e) => setAnimSpeed(Number(e.target.value))} />
                  </label>
                  <div className="sys-row sys-row-border">
                    <span className="sys-label">LIGHTWEIGHT MODE</span>
                    <button className={`sys-switch ${lightweight ? 'on' : ''}`} role="switch" aria-checked={lightweight} aria-label="Lightweight mode" onClick={() => setLightweight(v => !v)}><span /></button>
                  </div>
                  <p className="setting-note">Removes blur and heavy shadows and pauses live video wallpapers to run smoother on slower devices. Your saved taskbar blur comes back when this is off.</p>
                  <button className="taskbar-reset" onClick={() => { setMotionMode('auto'); setAnimSpeed(100); setLightweight(false); }}>RESET DEFAULTS</button>
                </div>
              )}
              {activeSection === 'system' && (
                <div className="settings-card sys-card">
                  <div className="card-heading">CURSOR TRAIL <span className="tiny-tag">ACCENT</span></div>
                  <div className="sys-row">
                    <span className="sys-label">ENABLE TRAIL</span>
                    <button className={`sys-switch ${trailOn ? 'on' : ''}`} role="switch" aria-checked={trailOn} aria-label="Cursor trail" onClick={() => setTrailOn(v => !v)}><span /></button>
                  </div>
                  <label className="taskbar-slider-row">
                    <span className="taskbar-slider-label"><span>TRAIL LENGTH</span><span className="taskbar-slider-value">{trailLength}%</span></span>
                    <input type="range" min="20" max="100" step="5" value={trailLength} disabled={!trailOn} onChange={(e) => setTrailLength(Number(e.target.value))} />
                  </label>
                  <label className="taskbar-slider-row">
                    <span className="taskbar-slider-label"><span>THICKNESS</span><span className="taskbar-slider-value">{trailSize} px</span></span>
                    <input type="range" min="2" max="12" step="1" value={trailSize} disabled={!trailOn} onChange={(e) => setTrailSize(Number(e.target.value))} />
                  </label>
                  <p className="setting-note">The trail uses your accent color. It turns itself off under Reduced motion and Lightweight mode.</p>
                  <button className="taskbar-reset" onClick={() => { setTrailOn(false); setTrailLength(50); setTrailSize(6); }}>RESET DEFAULTS</button>
                </div>
              )}
              {activeSection === 'system' && (
                <div className="settings-card sys-card">
                  <div className="card-heading">CURSOR STYLE &amp; CLICK <span className="tiny-tag">ACCENT</span></div>
                  <div className="sys-row">
                    <span className="sys-label">CURSOR</span>
                    <div className="sys-seg" role="group" aria-label="Cursor style">
                      {[['default', 'DEFAULT'], ['arrow', 'ARROW'], ['dot', 'DOT']].map(([val, label]) => (
                        <button key={val} className={`sys-seg-btn ${cursorStyle === val ? 'chosen' : ''}`} aria-pressed={cursorStyle === val} onClick={() => setCursorStyle(val)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="sys-row sys-row-border">
                    <span className="sys-label">CLICK RIPPLE</span>
                    <button className={`sys-switch ${rippleOn ? 'on' : ''}`} role="switch" aria-checked={rippleOn} aria-label="Click ripple" onClick={() => setRippleOn(v => !v)}><span /></button>
                  </div>
                  <p className="setting-note">Arrow and dot cursors use your accent color. Text fields and drag handles keep their normal cursors. The click ripple turns itself off under Reduced motion and Lightweight mode.</p>
                  <button className="taskbar-reset" onClick={() => { setCursorStyle('default'); setRippleOn(false); }}>RESET DEFAULTS</button>
                </div>
              )}
              {activeSection === 'taskbar' && (
                <div className="settings-card taskbar-settings-card">
                  <div className="card-heading">TASKBAR APPEARANCE <span className="tiny-tag">LIVE</span></div>
                  <p className="setting-note taskbar-intro">Tune the glass dock. Changes apply immediately and save automatically.</p>
                  {[
                    { label: 'BACKGROUND OPACITY', value: taskbarOpacity, min: 15, max: 100, unit: '%', set: setTaskbarOpacity },
                    { label: 'GLASS BLUR', value: taskbarBlur, min: 0, max: 40, unit: ' px', set: setTaskbarBlur },
                    { label: 'CORNER ROUNDNESS', value: taskbarRadius, min: 8, max: 34, unit: ' px', set: setTaskbarRadius },
                    { label: 'HORIZONTAL SCALE (X)', value: taskbarScaleX, min: 100, max: 160, unit: '%', set: setTaskbarScaleX },
                    { label: 'VERTICAL SCALE (Y)', value: taskbarScaleY, min: 60, max: 140, unit: '%', set: setTaskbarScaleY },
                  ].map(control => <label className="taskbar-slider-row" key={control.label}>
                    <span className="taskbar-slider-label"><span>{control.label}</span><span className="taskbar-slider-value">{control.value}{control.unit}</span></span>
                    <input type="range" min={control.min} max={control.max} value={control.value} onChange={(e) => control.set(Number(e.target.value))} />
                  </label>)}
                  <button className="taskbar-reset" onClick={() => { setTaskbarOpacity(73); setTaskbarBlur(28); setTaskbarRadius(23); setTaskbarScaleX(100); setTaskbarScaleY(100); }}>RESET DEFAULTS</button>
                </div>
              )}
              {activeSection === 'tab-cloak' && (
                <div className="appearance-stack">
                  <div className="settings-card tab-cloak-card">
                    <div className="card-heading">TAB IDENTITY <span className="tiny-tag">25 PRESETS</span></div>
                    <p className="setting-note tab-cloak-intro">Choose a browser-tab label and matching site icon, or open Veylora in a separate about:blank tab.</p>
                    <label className="tab-cloak-toggle">
                      <input type="checkbox" checked={tabCloakEnabled} onChange={(event) => setTabCloakEnabled(event.target.checked)} />
                      <span><strong>Enable tab cloak</strong><small>Use the selected educational site's title and icon in this tab.</small></span>
                    </label>
                    <label className="tab-cloak-field">
                      <span>EDUCATIONAL SITE</span>
                      <select value={tabCloakPreset} onChange={(event) => setTabCloakPreset(event.target.value)}>
                        {TAB_CLOAK_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
                      </select>
                    </label>
                    <div className="tab-cloak-preview">
                      <img src={getTabCloakIcon((TAB_CLOAK_PRESETS.find((preset) => preset.id === tabCloakPreset) || TAB_CLOAK_PRESETS[0]))} alt="" />
                      <span><strong>{(TAB_CLOAK_PRESETS.find((preset) => preset.id === tabCloakPreset) || TAB_CLOAK_PRESETS[0]).title}</strong><small>Browser-tab preview</small></span>
                    </div>
                    <div className="tab-cloak-actions">
                      <button className="upload-button tab-cloak-button" onClick={openInAboutBlank}>OPEN IN ABOUT:BLANK</button>
                      <button className="taskbar-reset tab-cloak-button" onClick={() => setTabCloakEnabled(false)}>RESTORE VEYLORA TAB</button>
                    </div>
                    <p className="setting-note tab-cloak-footnote">The title and icon are cosmetic only. This does not change the page's actual URL or hide browsing activity from network or device monitoring. The about:blank option opens Veylora in a new blank tab; allow pop-ups for it to work.</p>
                  </div>
                </div>
              )}
              {activeSection === 'about' && <div className="settings-card"><div className="card-heading">ABOUT VEYLORA</div><p className="setting-note">A small desktop environment, built carefully.</p><div className="about-version">VERSION 0.1.0 · DEVELOPMENT BUILD</div></div>}
            </div>
          </div>
        </section>
      )}

      <footer className="taskbar" ref={taskbarRef} style={{ backgroundColor: `rgba(var(--tb-rgb, 17,16,23), ${taskbarOpacity / 100})`, backdropFilter: `blur(${taskbarBlur}px) saturate(145%)`, WebkitBackdropFilter: `blur(${taskbarBlur}px) saturate(145%)`, borderRadius: `${taskbarRadius}px`, '--tb-y': taskbarScaleY / 100 }}>
        <button className="dock-icon launcher" aria-label="Open launcher" onClick={() => setMenuOpen(v => !v)} title="Veylora launcher"><Star size={25} fill="currentColor" strokeWidth={1.7} /></button>
        <span className="dock-separator" />
        <button className={`dock-icon settings-dock ${settingsOpen ? 'running' : ''}`} aria-label="Open Settings" title="Settings" onClick={() => setSettingsOpen(true)}><SettingsIcon size={23} strokeWidth={1.8} /></button>
        <button className={`dock-icon yozune-dock ${yozuneOpen ? 'running' : ''}`} aria-label="Open Yozune" title="Yozune" onClick={() => setYozuneOpen(true)}><Play size={22} strokeWidth={1.8} /></button>
        <button className={`dock-icon kairune-dock ${kairuneOpen ? 'running' : ''}`} aria-label="Open Kairune" title="Kairune" onClick={() => setKairuneOpen(true)}><Film size={22} strokeWidth={1.8} /></button>
        <button className={`dock-icon tunekai-dock ${tunekaiOpen ? 'running' : ''}`} aria-label="Open Tunekai" title="Tunekai" onClick={() => setTunekaiOpen(true)}><span aria-hidden="true" /></button>
        <button className={`dock-icon games-dock ${gamesOpen ? 'running' : ''}`} aria-label="Open Games" title="Games" onClick={() => setGamesOpen(true)}><Gamepad2 size={21} strokeWidth={1.8} /></button>
        <span className="dock-divider" />
        <div className="system-tray">
          <button className="tray-icon" title="Brightness"><Sun size={15} /></button>
          <button className="tray-icon" title="Network"><Wifi size={15} /></button>
          <button className="tray-icon" title="Volume"><Volume2 size={15} /></button>
          <button className="tray-icon" title="Battery"><BatteryFull size={15} /></button>
          <button
            type="button"
            className="tray-icon fullscreen-tray-icon"
            aria-label={siteFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            aria-pressed={siteFullscreen}
            title={fullscreenError ? 'Fullscreen unavailable; try HTTPS or localhost.' : siteFullscreen ? 'Exit fullscreen (Esc also works)' : 'Fullscreen Veylora'}
            onClick={toggleSiteFullscreen}
          >
            {siteFullscreen ? <Minimize2 size={15} strokeWidth={1.7} /> : <Maximize2 size={15} strokeWidth={1.7} />}
          </button>
          <div className="clock"><span>{formattedTime}</span><small>{formattedDate}</small></div>
        </div>
      </footer>
      {fullscreenError && <div className="fullscreen-notice" role="status">Fullscreen could not start. Open Veylora from HTTPS or localhost and try again.</div>}
      {trailOn && <canvas ref={trailCanvasRef} className="cursor-trail-canvas" aria-hidden="true" />}
      <WidgetsLayer on={widgetsOn} pos={widgetPos} locked={widgetsLocked} opacity={widgetOpacity} blur={widgetBlur} onCommit={(id, p) => setWidgetPos(prev => ({ ...prev, [id]: p }))} />
      <div className="build-label">VEYLORA <span>•</span> EARLY BUILD</div>
      {yozuneOpen && (
        <Yozune
          maximized={yozuneMaximized}
          beginDrag={beginYozuneDrag}
          position={yozunePosition}
          onClose={() => { setYozuneOpen(false); setYozuneMaximized(false); setYozunePosition({ x: 0, y: 0 }); }}
          onMinimize={() => setYozuneOpen(false)}
          onToggleMaximize={() => setYozuneMaximized(v => !v)}
        />
      )}
      {tunekaiOpen && (
        <Tunekai
          maximized={tunekaiMaximized}
          onClose={() => { setTunekaiOpen(false); setTunekaiMaximized(false); }}
          onMinimize={() => { setTunekaiOpen(false); setTunekaiMaximized(false); }}
          onToggleMaximize={() => setTunekaiMaximized(v => !v)}
        />
      )}
      {gamesOpen && (
        <Games
          maximized={gamesMaximized}
          onClose={() => { setGamesOpen(false); setGamesMaximized(false); }}
          onMinimize={() => setGamesOpen(false)}
          onToggleMaximize={() => setGamesMaximized(v => !v)}
        />
      )}
      {kairuneOpen && (
        <Kairune
          maximized={kairuneMaximized}
          beginDrag={beginKairuneDrag}
          position={kairunePosition}
          onClose={() => { setKairuneOpen(false); setKairuneMaximized(false); setKairunePosition({ x: 0, y: 0 }); }}
          onMinimize={() => setKairuneOpen(false)}
          onToggleMaximize={() => setKairuneMaximized(v => !v)}
        />
      )}

    </main>
  );
}
