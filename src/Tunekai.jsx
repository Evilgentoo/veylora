import { useEffect, useRef, useState } from 'react';
import { X, Minus, Square, Home as HomeIcon, Search as SearchIcon, Heart, ListMusic, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Plus, Music2 } from 'lucide-react';

const CACHE_KEY = 'veylora.tunekai.cache';
const LIKED_KEY = 'veylora.tunekai.liked';

const GENRES = [
  { label: 'Pop', q: 'pop hits', hue: 320 },
  { label: 'Hip-Hop', q: 'hip hop hits', hue: 38 },
  { label: 'Rock', q: 'rock classics', hue: 4 },
  { label: 'Lo-Fi', q: 'lofi beats', hue: 200 },
  { label: 'R&B', q: 'r&b hits', hue: 275 },
  { label: 'Jazz', q: 'jazz classics', hue: 28 },
  { label: 'Electronic', q: 'electronic dance', hue: 175 },
  { label: 'Anime', q: 'anime openings', hue: 340 },
  { label: 'Classical', q: 'classical piano', hue: 220 },
];

const fromItunes = (r) => ({
  id: String(r.trackId),
  title: r.trackName,
  artist: r.artistName,
  album: r.collectionName || '',
  thumb: (r.artworkUrl100 || '').replace('100x100', '300x300'),
  preview: r.previewUrl,
  url: r.trackViewUrl,
});
const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

function cacheGet(k) {
  try { const c = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); const e = c[k]; if (e && Date.now() - e.t < 43200000) return e.v; } catch {}
  return null;
}
function cacheSet(k, v) {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    c[k] = { t: Date.now(), v };
    const keys = Object.keys(c);
    if (keys.length > 40) keys.sort((a, b) => c[a].t - c[b].t).slice(0, keys.length - 40).forEach((x) => delete c[x]);
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {}
}
async function itunes(path) {
  const r = await fetch('https://itunes.apple.com' + path);
  if (r.status === 403 || r.status === 429) throw new Error('rate');
  if (!r.ok) throw new Error('api');
  return r.json();
}
async function loadTrending() {
  try {
    const rss = await fetch('https://rss.applemarketingtools.com/api/v2/us/music/most-played/25/songs.json');
    const d = await rss.json();
    const ids = ((d.feed && d.feed.results) || []).map((x) => x.id).join(',');
    if (ids) {
      const lk = await itunes('/lookup?entity=song&id=' + ids);
      const list = (lk.results || []).filter((r) => r.previewUrl).map(fromItunes);
      if (list.length) return list;
    }
  } catch {}
  const d = await itunes('/search?media=music&entity=song&limit=25&term=' + encodeURIComponent('top hits'));
  return (d.results || []).filter((r) => r.previewUrl).map(fromItunes);
}

export default function Tunekai({ onClose, onMinimize, onToggleMaximize, maximized }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [view, setView] = useState('home');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [volume, setVolume] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [liked, setLiked] = useState(() => { try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'); } catch { return []; } });

  const audioRef = useRef(null);
  const stateRef = useRef({});
  const advanceRef = useRef(() => {});
  const volRef = useRef(80);
  const dragRef = useRef(null);

  stateRef.current = { queue, idx, repeat, shuffle };
  volRef.current = volume;
  const current = idx >= 0 ? queue[idx] : null;

  function beginDrag(e) {
    if (maximized || e.target.closest('button')) return;
    dragRef.current = { px: e.clientX, py: e.clientY, sx: pos.x, sy: pos.y };
    const move = (ev) => setPos({ x: ev.clientX - dragRef.current.px + dragRef.current.sx, y: ev.clientY - dragRef.current.py + dragRef.current.sy });
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  useEffect(() => {
    const a = new Audio();
    a.preload = 'auto';
    a.volume = volRef.current / 100;
    audioRef.current = a;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => advanceRef.current(true);
    const onTime = () => setTime(a.currentTime || 0);
    const onMeta = () => setDur(a.duration || 0);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnd);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    return () => {
      a.pause(); a.src = '';
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  useEffect(() => { try { localStorage.setItem(LIKED_KEY, JSON.stringify(liked)); } catch {} }, [liked]);

  useEffect(() => {
    const cached = cacheGet('trending');
    if (cached) { setTrending(cached); return; }
    loadTrending()
      .then((list) => { cacheSet('trending', list); setTrending(list); })
      .catch((e) => setError(e.message === 'rate' ? 'rate' : 'api'));
  }, []);

  function load(t) {
    const a = audioRef.current;
    if (!a || !t || !t.preview) return;
    a.src = t.preview;
    setTime(0); setDur(30);
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  }
  function playList(list, i) {
    if (!list[i]) return;
    setQueue(list); setIdx(i); load(list[i]);
  }
  function playIndex(n) {
    const q = stateRef.current.queue;
    if (!q[n]) return;
    setIdx(n); load(q[n]);
  }
  function advance(auto) {
    const s = stateRef.current;
    const a = audioRef.current;
    if (!s.queue.length) return;
    if (auto && s.repeat === 'one') { if (a) { a.currentTime = 0; a.play().catch(() => {}); } return; }
    let n;
    if (s.shuffle && s.queue.length > 1) { do { n = Math.floor(Math.random() * s.queue.length); } while (n === s.idx); }
    else n = s.idx + 1;
    if (n >= s.queue.length) {
      if (s.repeat === 'all' || !auto) n = 0;
      else { setPlaying(false); return; }
    }
    playIndex(n);
  }
  advanceRef.current = advance;
  function previous() {
    const s = stateRef.current;
    const a = audioRef.current;
    if (!s.queue.length) return;
    if (a && a.currentTime > 3) { a.currentTime = 0; return; }
    playIndex(Math.max(0, s.idx - 1));
  }
  function togglePlay() {
    const a = audioRef.current;
    if (!current || !a) return;
    if (a.paused) a.play().catch(() => {}); else a.pause();
  }
  function seek(v) { const a = audioRef.current; if (a) { a.currentTime = Number(v); setTime(Number(v)); } }
  function changeVolume(v) { const n = Number(v); setVolume(n); if (audioRef.current) audioRef.current.volume = n / 100; }
  function isLiked(t) { return liked.some((x) => x.id === t.id); }
  function toggleLike(t) { setLiked((l) => (l.some((x) => x.id === t.id) ? l.filter((x) => x.id !== t.id) : [t, ...l])); }
  function addToQueue(t) {
    if (idx < 0) { setQueue([t]); setIdx(0); load(t); return; }
    setQueue((q) => (q.some((x) => x.id === t.id) ? q : [...q, t]));
  }

  async function doSearch(q) {
    const term = (q || '').trim();
    if (!term) return;
    setView('search'); setError('');
    const key = 'search:' + term.toLowerCase();
    const cached = cacheGet(key);
    if (cached) { setResults(cached); return; }
    setLoading(true);
    try {
      const d = await itunes('/search?media=music&entity=song&limit=25&term=' + encodeURIComponent(term));
      const list = (d.results || []).filter((r) => r.previewUrl).map(fromItunes);
      cacheSet(key, list); setResults(list);
    } catch (e) { setResults([]); setError(e.message === 'rate' ? 'rate' : 'api'); }
    setLoading(false);
  }

  function errorBox() {
    if (!error) return null;
    if (error === 'rate') return <div className="tk-note"><strong>Too many searches too fast.</strong> Apple allows about 20 a minute, so wait a moment and try again. Songs you already searched load instantly.</div>;
    return <div className="tk-note"><strong>Couldn't reach the music service.</strong> Check your connection and try again.</div>;
  }

  function tile(list, t, i) {
    return (
      <div key={t.id + '-' + i} className="tk-tile">
        <button className="tk-tile-art" onClick={() => playList(list, i)} aria-label={'Play ' + t.title}>
          {t.thumb ? <img src={t.thumb} alt="" loading="lazy" /> : <Music2 size={28} />}
          <span className="tk-tile-play"><Play size={18} fill="currentColor" /></span>
        </button>
        <span className="tk-tile-title">{t.title}</span>
        <span className="tk-tile-artist">{t.artist}</span>
      </div>
    );
  }
  function row(list, t, i) {
    const on = current && current.id === t.id;
    return (
      <div key={t.id + '-' + i} className={'tk-row' + (on ? ' is-on' : '')}>
        <button className="tk-row-main" onClick={() => playList(list, i)}>
          <span className="tk-row-thumb">{t.thumb ? <img src={t.thumb} alt="" loading="lazy" /> : <Music2 size={18} />}</span>
          <span className="tk-row-text"><span className="tk-row-title">{t.title}</span><span className="tk-row-artist">{t.artist}</span></span>
        </button>
        <button className={'tk-icon' + (isLiked(t) ? ' is-liked' : '')} onClick={() => toggleLike(t)} aria-label="Like"><Heart size={16} fill={isLiked(t) ? 'currentColor' : 'none'} /></button>
        <button className="tk-icon" onClick={() => addToQueue(t)} aria-label="Add to queue"><Plus size={16} /></button>
      </div>
    );
  }

  return (
    <section
      className={`window tk-window ${maximized ? 'maximized' : ''}`}
      style={!maximized ? { transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))` } : undefined}
      aria-label="Tunekai"
    >
      <header className="window-titlebar" onPointerDown={beginDrag} onDoubleClick={(e) => { if (!e.target.closest('button')) onToggleMaximize?.(); }}>
        <div className="window-controls">
          <button className="window-control close" aria-label="Close Tunekai" onClick={onClose}><X size={12} /></button>
          <button className="window-control minimize" aria-label="Minimize Tunekai" onClick={onMinimize}><Minus size={12} /></button>
          <button className="window-control maximize" aria-label="Toggle maximize" onClick={onToggleMaximize}><Square size={10} /></button>
        </div>
        <span className="window-title">TUNEKAI</span>
        <span className="titlebar-spacer" />
      </header>

      <div className="tk-body">
        <aside className="tk-rail">
          <div className="tk-logo" />
          <button className={`tk-rail-btn ${view === 'home' ? 'is-active' : ''}`} onClick={() => setView('home')} title="Home"><HomeIcon size={20} /></button>
          <button className={`tk-rail-btn ${view === 'search' ? 'is-active' : ''}`} onClick={() => setView('search')} title="Search"><SearchIcon size={20} /></button>
          <button className={`tk-rail-btn ${view === 'liked' ? 'is-active' : ''}`} onClick={() => setView('liked')} title="Liked songs"><Heart size={20} /></button>
        </aside>

        <main className="tk-main">
          <div className="tk-scroll">
            {view === 'home' && (
              <>
                <section className="tk-hero">
                  <span className="tk-eyebrow">TUNEKAI</span>
                  <h1 className="tk-hero-title">Press play on <em>anything</em>.</h1>
                  <p className="tk-hero-desc">Search any song or artist and hear a 30-second preview, with a queue and a liked list saved on this device.</p>
                  <div className="tk-hero-actions">
                    <button className="tk-btn primary" onClick={() => setView('search')}>Find music</button>
                    <button className="tk-btn" onClick={() => setView('liked')}>Liked songs</button>
                  </div>
                </section>
                {errorBox()}
                <h2 className="tk-h2">Start with a mood</h2>
                <div className="tk-genres">
                  {GENRES.map((g) => (
                    <button key={g.label} className="tk-genre" style={{ '--g': g.hue }} onClick={() => { setQuery(g.q); doSearch(g.q); }}>
                      <span className="tk-genre-art"><Music2 size={26} /></span>
                      <span className="tk-genre-name">{g.label}</span>
                      <span className="tk-genre-sub">Radio</span>
                    </button>
                  ))}
                </div>
                <h2 className="tk-h2">Trending music</h2>
                <div className="tk-tiles">
                  {!trending && !error && <div className="tk-hint">Loading…</div>}
                  {trending && trending.map((t, i) => tile(trending, t, i))}
                </div>
              </>
            )}

            {view === 'search' && (
              <>
                <form className="tk-search" onSubmit={(e) => { e.preventDefault(); doSearch(query); }}>
                  <SearchIcon size={16} />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search songs, artists, moods…" autoFocus />
                  <button type="submit" className="tk-btn primary small">Search</button>
                </form>
                {errorBox()}
                {loading && <div className="tk-hint">Searching…</div>}
                {!loading && !error && results.length === 0 && <div className="tk-hint">Type something and press Enter.</div>}
                <div className="tk-list">{results.map((t, i) => row(results, t, i))}</div>
              </>
            )}

            {view === 'liked' && (
              <>
                <h2 className="tk-h2 first">Liked songs</h2>
                {liked.length === 0 && <div className="tk-hint">Tap the heart on any song to save it here.</div>}
                <div className="tk-list">{liked.map((t, i) => row(liked, t, i))}</div>
              </>
            )}
          </div>
        </main>

        <aside className="tk-side">
          <div className="tk-art">
            {current && current.thumb ? <img src={current.thumb} alt="" /> : <div className="tk-art-empty"><Music2 size={28} /><span>Pick a song to start</span></div>}
          </div>
          {current && (
            <a className="tk-store" href={current.url} target="_blank" rel="noreferrer">Listen on Apple Music</a>
          )}
          <div className="tk-side-head"><ListMusic size={15} /> Queue</div>
          <div className="tk-queue">
            {queue.length === 0 && <div className="tk-hint">Nothing queued yet.</div>}
            {queue.map((t, i) => (
              <button key={t.id + '-' + i} className={'tk-q-item' + (i === idx ? ' is-on' : '')} onClick={() => playIndex(i)}>
                <span className="tk-q-title">{t.title}</span>
                <span className="tk-q-artist">{t.artist}</span>
              </button>
            ))}
          </div>
          <div className="tk-credit">30-second previews provided courtesy of iTunes</div>
        </aside>
      </div>

      <footer className="tk-bar">
        <div className="tk-now">
          <span className="tk-now-art">{current && current.thumb ? <img src={current.thumb} alt="" /> : <Music2 size={18} />}</span>
          <span className="tk-now-text">
            <span className="tk-now-title">{current ? current.title : 'Nothing playing'}</span>
            <span className="tk-now-artist">{current ? current.artist : 'Pick a song to start'}</span>
          </span>
          {current && <button className={'tk-icon' + (isLiked(current) ? ' is-liked' : '')} onClick={() => toggleLike(current)} aria-label="Like"><Heart size={16} fill={isLiked(current) ? 'currentColor' : 'none'} /></button>}
        </div>
        <div className="tk-center">
          <div className="tk-controls">
            <button className={'tk-icon' + (shuffle ? ' is-on' : '')} onClick={() => setShuffle((v) => !v)} aria-label="Shuffle"><Shuffle size={16} /></button>
            <button className="tk-icon" onClick={previous} aria-label="Previous"><SkipBack size={18} fill="currentColor" /></button>
            <button className="tk-play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
            <button className="tk-icon" onClick={() => advance(false)} aria-label="Next"><SkipForward size={18} fill="currentColor" /></button>
            <button className={'tk-icon' + (repeat !== 'off' ? ' is-on' : '')} onClick={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))} aria-label="Repeat">
              <Repeat size={16} />{repeat === 'one' && <span className="tk-badge">1</span>}
            </button>
          </div>
          <div className="tk-seek">
            <span>{fmt(time)}</span>
            <input type="range" min="0" max={dur || 0} step="0.1" value={Math.min(time, dur || 0)} onChange={(e) => seek(e.target.value)} />
            <span>{fmt(dur)}</span>
          </div>
        </div>
        <div className="tk-vol">
          <button className="tk-icon" onClick={() => changeVolume(volume > 0 ? 0 : 80)} aria-label="Mute">{volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => changeVolume(e.target.value)} />
        </div>
      </footer>
    </section>
  );
}
