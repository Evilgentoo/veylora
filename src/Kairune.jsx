import { useEffect, useRef, useState } from 'react';
import { X, Minus, Square, Play, Search as SearchIcon, Home as HomeIcon } from 'lucide-react';

const TMDB_BASE   = 'https://lftzbxewtwgexsqwijft.supabase.co/functions/v1/swift-service';
const TMDB_POSTER = TMDB_BASE + '/image/t/p/w342';
const TMDB_BACK   = TMDB_BASE + '/image/t/p/w1280';
const TMDB_STILL  = TMDB_BASE + '/image/t/p/w300';
const VIDSRC      = 'https://vidsrc.to/embed/';

const J = 'with_genres=16&with_origin_country=JP';

const ROWS = [
  { label: 'Popular This Season', url: '/discover/tv?sort_by=popularity.desc&' + J },
  { label: 'Top Rated Anime',     url: '/discover/tv?sort_by=vote_average.desc&vote_count.gte=200&' + J },
  { label: 'Trending Now',        url: '/trending/tv/week' },
  { label: 'Action & Adventure',  url: '/discover/tv?with_genres=16,10759&with_origin_country=JP' },
  { label: 'Romance',             url: '/discover/tv?with_genres=16,10749&with_origin_country=JP' },
  { label: 'Fantasy',             url: '/discover/tv?with_genres=16,10765&with_origin_country=JP' },
  { label: 'Sci-Fi & Mecha',      url: '/discover/tv?with_genres=16,10765,878&with_origin_country=JP' },
  { label: 'Comedy',              url: '/discover/tv?with_genres=16,35&with_origin_country=JP' },
  { label: 'Slice of Life',       url: '/discover/tv?with_genres=16,10751&with_origin_country=JP' },
  { label: 'Anime Films',         url: '/discover/movie?with_genres=16&with_origin_country=JP' }
];

const titleOf = (m) => m?.title || m?.name || 'Untitled';
const yearOf  = (m) => ((m?.release_date || m?.first_air_date || '').slice(0, 4));

export default function Kairune({ onClose, onMinimize, onToggleMaximize, maximized, beginDrag, position }) {
  const [tab, setTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hero, setHero] = useState(null);
  const [rows, setRows] = useState({});
  const [picker, setPicker] = useState(null);
  const [player, setPlayer] = useState(null);
  const [subMode, setSubMode] = useState('sub');

  async function fetchJson(path) {
    const res = await fetch(TMDB_BASE + path);
    return res.json();
  }

  async function loadHero() {
    try {
      const data = await fetchJson('/discover/tv?sort_by=popularity.desc&' + J);
      const list = (data?.results || []).filter((x) => x.backdrop_path);
      setHero(list[0] || null);
    } catch (e) { console.warn('hero', e); }
  }

  async function loadRow(url) {
    try {
      const data = await fetchJson(url);
      const list = (data?.results || []).filter((m) => m.poster_path);
      setRows((prev) => ({ ...prev, [url]: list }));
    } catch (e) { console.warn('row', e); }
  }

  useEffect(() => {
    if (!hero) loadHero();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (tab !== 'home') return;
    ROWS.forEach((r, i) => {
      setTimeout(() => { if (!rows[r.url]) loadRow(r.url); }, i * 120);
    });
  }, [tab]); // eslint-disable-line

  useEffect(() => {
    if (tab !== 'search') return;
    if (!searchQuery) { setSearchResults([]); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const data = await fetchJson('/search/multi?query=' + encodeURIComponent(searchQuery));
        const list = (data?.results || []).filter((m) =>
          (m.media_type === 'movie' || m.media_type === 'tv') &&
          m.poster_path &&
          m.original_language === 'ja');
        setSearchResults(list);
      } catch (e) { console.warn(e); }
      setSearching(false);
    }, 320);
    return () => clearTimeout(t);
  }, [searchQuery, tab]);

  function openPlayer(mediaType, id, title, season, episode) {
    let src;
    if (mediaType === 'tv' && season && episode) src = `${VIDSRC}tv/${id}/${season}/${episode}`;
    else src = `${VIDSRC}movie/${id}`;
    const label = mediaType === 'tv' && season && episode
      ? `${title} — S${season}E${episode}`
      : title;
    setPlayer({ src, title: label });
  }
  function closePlayer() { setPlayer(null); }

  async function openPicker(id, title) {
    setPicker({ id, title, seasons: [], eps: [], season: null, loading: true });
    try {
      const data = await fetchJson('/tv/' + id);
      const seasons = (data?.seasons || []).filter((s) => s.season_number > 0);
      if (!seasons.length) {
        setPicker((p) => ({ ...p, seasons: [], loading: false }));
        return;
      }
      setPicker((p) => ({ ...p, seasons, season: seasons[0].season_number, loading: false }));
      loadEpisodes(id, seasons[0].season_number);
    } catch (e) { console.warn(e); }
  }
  async function loadEpisodes(id, seasonNumber) {
    setPicker((p) => ({ ...p, eps: [], loadingEps: true }));
    try {
      const data = await fetchJson('/tv/' + id + '/season/' + seasonNumber);
      setPicker((p) => ({ ...p, eps: data?.episodes || [], season: seasonNumber, loadingEps: false }));
    } catch (e) { console.warn(e); }
  }
  function closePicker() { setPicker(null); }

  function onTileClick(mediaType, id, title) {
    if (mediaType === 'tv') openPicker(id, title);
    else openPlayer('movie', id, title);
  }

  function HeroBlock({ item }) {
    if (!item) return <div className="kr-hero kr-hero--empty" />;
    const year = yearOf(item);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '';
    const desc = (item.overview || '').slice(0, 260) + (item.overview && item.overview.length > 260 ? '…' : '');
    return (
      <div className="kr-hero">
        {item.backdrop_path && (
          <div className="kr-hero-bg" style={{ backgroundImage: `url("${TMDB_BACK + item.backdrop_path}")` }} />
        )}
        <div className="kr-hero-shade" />
        <div className="kr-hero-content">
          <span className="kr-hero-badge">NEW EPISODES</span>
          <h1 className="kr-hero-title">{titleOf(item)}</h1>
          <p className="kr-hero-sub">Beyond the Journey's End</p>
          <div className="kr-hero-meta">
            {year && <span>{year}</span>}
            {rating && <span>★ {rating}</span>}
            <span>Sub | Dub</span>
            <span>Anime</span>
          </div>
          <p className="kr-hero-desc">{desc}</p>
          <div className="kr-hero-actions">
            <button className="kr-play" onClick={() => onTileClick('tv', item.id, titleOf(item))}>
              <Play size={16} fill="currentColor" /> START WATCHING
            </button>
            <button className="kr-watch">+ ADD TO WATCHLIST</button>
          </div>
        </div>
      </div>
    );
  }

  function Card({ item, mediaType }) {
    const t = titleOf(item);
    return (
      <button className="kr-card" onClick={() => onTileClick(mediaType, item.id, t)} aria-label={t}>
        <img src={item.poster_path ? TMDB_POSTER + item.poster_path : ''} alt="" loading="lazy" />
        <span className="kr-card-meta">
          <span className="kr-card-title">{t}</span>
          <span className="kr-card-sub">{yearOf(item)}</span>
        </span>
      </button>
    );
  }

  function Row({ label, items }) {
    return (
      <section className="kr-row">
        <div className="kr-row-head">
          <h2 className="kr-row-title">{label}</h2>
          <p className="kr-row-sub">Catch up on the newest episodes</p>
        </div>
        <div className="kr-row-track">
          {!items && <div className="kr-row-loading">Loading…</div>}
          {items && items.length === 0 && <div className="kr-row-loading">Nothing to show.</div>}
          {items && items.map((m) => {
            const isMovie = !!m.release_date;
            return <Card key={m.id + '-' + (isMovie ? 'movie' : 'tv')} item={m} mediaType={isMovie ? 'movie' : 'tv'} />;
          })}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`window kr-window ${maximized ? 'maximized' : ''}`}
      style={!maximized && position ? { transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` } : undefined}
      aria-label="Kairune"
    >
      <header
        className="window-titlebar"
        onPointerDown={beginDrag}
        onDoubleClick={(e) => { if (!e.target.closest('button')) onToggleMaximize?.(); }}
      >
        <div className="window-controls">
          <button className="window-control close" aria-label="Close Kairune" onClick={onClose}><X size={12} /></button>
          <button className="window-control minimize" aria-label="Minimize Kairune" onClick={onMinimize}><Minus size={12} /></button>
          <button className="window-control maximize" aria-label="Toggle maximize" onClick={onToggleMaximize}><Square size={10} /></button>
        </div>
        <span className="window-title">KAIRUNE</span>
        <span className="titlebar-spacer" />
      </header>

      <div className="kr-body">
        <nav className="kr-nav">
          <div className="kr-nav-left">
            <span className="kr-brand"><i className="brand-mark" />Kairune</span>
            <div className="kr-nav-links">
              <button className={`kr-nav-link ${tab === 'home' ? 'is-active' : ''}`} onClick={() => setTab('home')}>
                <HomeIcon size={14} /> Home
              </button>
              <button className={`kr-nav-link ${tab === 'search' ? 'is-active' : ''}`} onClick={() => setTab('search')}>
                <SearchIcon size={14} /> Search
              </button>
            </div>
          </div>
          <div className="kr-nav-right">
            <div className="kr-nav-avatar" />
          </div>
        </nav>

        <div className="kr-main">
          {tab === 'home' && (
            <div className="kr-scroll">
              <HeroBlock item={hero} />
              <div className="kr-rows">
                {ROWS.map((r) => (
                  <Row key={r.url} label={r.label} items={rows[r.url]} />
                ))}
              </div>
            </div>
          )}

          {tab === 'search' && (
            <div className="kr-search">
              <input
                type="search"
                className="kr-search-input"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="kr-search-title">
                {searchQuery ? `Results for "${searchQuery}"` : 'Search'}
              </div>
              {searching && <div className="kr-hint">Searching…</div>}
              {!searching && searchResults.length === 0 && searchQuery && (
                <div className="kr-hint">No results. Try another title.</div>
              )}
              <div className="kr-search-grid">
                {searchResults.map((m) => (
                  <Card key={m.id + '-' + m.media_type} item={m} mediaType={m.media_type} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {picker && (
        <div className="kr-overlay">
          <div className="kr-picker">
            <div className="kr-picker-bar">
              <span className="kr-picker-title">{picker.title}</span>
              <button className="kr-picker-close" onClick={closePicker}><X size={14} /></button>
            </div>
            <div className="kr-picker-body">
              {picker.loading && <div className="kr-hint">Loading seasons…</div>}
              {!picker.loading && picker.seasons.length === 0 && <div className="kr-hint">No seasons available.</div>}
              {!picker.loading && picker.seasons.length > 0 && (
                <>
                  <div className="kr-season-row">
                    <label>Season</label>
                    <select value={picker.season} onChange={(e) => loadEpisodes(picker.id, Number(e.target.value))}>
                      {picker.seasons.map((s) => (
                        <option key={s.season_number} value={s.season_number}>Season {s.season_number}</option>
                      ))}
                    </select>
                  </div>
                  <div className="kr-eps">
                    {picker.loadingEps && <div className="kr-hint">Loading episodes…</div>}
                    {!picker.loadingEps && picker.eps.map((ep) => (
                      <button key={ep.episode_number} className="kr-ep" onClick={() => {
                        const s = picker.season;
                        closePicker();
                        openPlayer('tv', picker.id, picker.title, s, ep.episode_number);
                      }}>
                        <span className="kr-ep-still">
                          {ep.still_path
                            ? <img src={TMDB_STILL + ep.still_path} alt="" loading="lazy" />
                            : <span className="kr-ep-still-fb">{ep.episode_number}</span>}
                          <span className="kr-ep-num">{ep.episode_number}</span>
                        </span>
                        <span className="kr-ep-info">
                          <span className="kr-ep-name">{ep.name || ('Episode ' + ep.episode_number)}</span>
                          <span className="kr-ep-meta">{ep.air_date || ''}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {player && (
        <div className="kr-overlay kr-overlay--player">
          <div className="kr-player">
            <div className="kr-player-bar">
              <span className="kr-player-title">{player.title}</span>
              <div className="kr-player-actions">
                <button className={`kr-pill ${subMode === 'sub' ? 'is-active' : ''}`} onClick={() => setSubMode('sub')}>SUB</button>
                <button className={`kr-pill ${subMode === 'dub' ? 'is-active' : ''}`} onClick={() => setSubMode('dub')}>DUB</button>
                <button className="kr-picker-close" onClick={closePlayer}>Close</button>
              </div>
            </div>
            <div className="kr-player-frame">
              <iframe
                src={player.src}
                allowFullScreen
                allow="autoplay; fullscreen"
                referrerPolicy="origin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                title={player.title}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
