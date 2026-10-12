import { useEffect, useRef, useState } from 'react';
import { X, Minus, Square, Play, Search as SearchIcon, Home as HomeIcon, Tv } from 'lucide-react';

const TMDB_BASE   = 'https://lftzbxewtwgexsqwijft.supabase.co/functions/v1/swift-service';
const TMDB_POSTER = TMDB_BASE + '/image/t/p/w342';
const TMDB_BACK   = TMDB_BASE + '/image/t/p/w1280';
const TMDB_STILL  = TMDB_BASE + '/image/t/p/w300';
const VIDSRC      = 'https://vidsrc.to/embed/';

const MOVIE_ROWS = [
  { label: 'Trending Now', url: '/trending/movie/week' },
  { label: 'Popular',      url: '/movie/popular' },
  { label: 'Top Rated',    url: '/movie/top_rated' },
  { label: 'New Releases', url: '/movie/now_playing' },
  { label: 'Action',       url: '/discover/movie?with_genres=28' },
  { label: 'Comedy',       url: '/discover/movie?with_genres=35' },
  { label: 'Sci-Fi',       url: '/discover/movie?with_genres=878' },
  { label: 'Horror',       url: '/discover/movie?with_genres=27' },
  { label: 'Animation',    url: '/discover/movie?with_genres=16' },
  { label: 'Drama',        url: '/discover/movie?with_genres=18' }
];

const TV_ROWS = [
  { label: 'Trending TV',        url: '/trending/tv/week' },
  { label: 'Popular Shows',      url: '/tv/popular' },
  { label: 'Top Rated TV',       url: '/tv/top_rated' },
  { label: 'Airing Today',       url: '/tv/airing_today' },
  { label: 'Action & Adventure', url: '/discover/tv?with_genres=10759' },
  { label: 'Comedy Shows',       url: '/discover/tv?with_genres=35' },
  { label: 'Drama Shows',        url: '/discover/tv?with_genres=18' },
  { label: 'Sci-Fi & Fantasy',   url: '/discover/tv?with_genres=10765' },
  { label: 'Animation',          url: '/discover/tv?with_genres=16' },
  { label: 'Crime',              url: '/discover/tv?with_genres=80' }
];

const titleOf = (m) => m?.title || m?.name || 'Untitled';
const yearOf  = (m) => ((m?.release_date || m?.first_air_date || '').slice(0, 4));

export default function Yozune({ onClose, onMinimize, onToggleMaximize, maximized, beginDrag, position }) {
  const [tab, setTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [movieHero, setMovieHero] = useState(null);
  const [tvHero, setTvHero] = useState(null);

  const [movieRows, setMovieRows] = useState({});
  const [tvRows, setTvRows] = useState({});

  const [picker, setPicker] = useState(null);
  const [player, setPlayer] = useState(null);

  const homeRef = useRef(null);
  const tvRef = useRef(null);

  async function fetchJson(path) {
    const res = await fetch(TMDB_BASE + path);
    return res.json();
  }

  async function loadHero(mode) {
    try {
      const path = mode === 'tv' ? '/trending/tv/week' : '/trending/movie/week';
      const data = await fetchJson(path);
      const list = (data?.results || []).filter((x) => x.backdrop_path);
      if (mode === 'tv') setTvHero(list[0] || null);
      else setMovieHero(list[0] || null);
    } catch (e) { console.warn('hero', e); }
  }

  async function loadRow(mode, url) {
    try {
      const data = await fetchJson(url);
      const list = (data?.results || []).filter((m) => m.poster_path);
      if (mode === 'tv') setTvRows((prev) => ({ ...prev, [url]: list }));
      else setMovieRows((prev) => ({ ...prev, [url]: list }));
    } catch (e) { console.warn('row', e); }
  }

  useEffect(() => {
    if (tab === 'home' && !movieHero) loadHero('movie');
    if (tab === 'tv' && !tvHero) loadHero('tv');
  }, [tab]); // eslint-disable-line

  useEffect(() => {
    const rows = tab === 'tv' ? TV_ROWS : (tab === 'home' ? MOVIE_ROWS : []);
    rows.forEach((r, i) => {
      setTimeout(() => {
        if (tab === 'tv' && !tvRows[r.url]) loadRow('tv', r.url);
        if (tab === 'home' && !movieRows[r.url]) loadRow('movie', r.url);
      }, i * 120);
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
          (m.media_type === 'movie' || m.media_type === 'tv') && m.poster_path);
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

  function Hero({ item, mediaType }) {
    if (!item) return <div className="yz-hero yz-hero--empty" />;
    const year = yearOf(item);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : '';
    const desc = (item.overview || '').slice(0, 240) + (item.overview && item.overview.length > 240 ? '…' : '');
    return (
      <div className="yz-hero">
        {item.backdrop_path && (
          <div className="yz-hero-bg" style={{ backgroundImage: `url("${TMDB_BACK + item.backdrop_path}")` }} />
        )}
        <div className="yz-hero-shade" />
        <div className="yz-hero-content">
          <span className="yz-hero-logo"><i className="brand-mark" />YOZUNE</span>
          <h1 className="yz-hero-title">{titleOf(item)}</h1>
          <div className="yz-hero-meta">
            {year && <span className="yz-year">{year}</span>}
            {rating && <span className="yz-rating">{rating}</span>}
            <span>{mediaType === 'tv' ? 'TV SERIES' : 'FILM'}</span>
          </div>
          <p className="yz-hero-desc">{desc}</p>
          <div className="yz-hero-actions">
            <button className="yz-play" onClick={() => onTileClick(mediaType, item.id, titleOf(item))}>
              <Play size={16} fill="currentColor" /> Play
            </button>
          </div>
        </div>
      </div>
    );
  }

  function Tile({ item, mediaType }) {
    const t = titleOf(item);
    return (
      <button className="yz-tile" onClick={() => onTileClick(mediaType, item.id, t)} aria-label={t}>
        <img src={item.poster_path ? TMDB_POSTER + item.poster_path : ''} alt="" loading="lazy" />
        <span className="yz-tile-meta">
          <span className="yz-tile-title">{t}</span>
          <span className="yz-tile-year">{yearOf(item)}</span>
        </span>
      </button>
    );
  }

  function Row({ label, items, mediaType }) {
    return (
      <section className="yz-row">
        <h2 className="yz-row-title">{label}</h2>
        <div className="yz-row-track">
          {!items && <div className="yz-row-loading">Loading…</div>}
          {items && items.length === 0 && <div className="yz-row-loading">Nothing to show.</div>}
          {items && items.map((m) => <Tile key={m.id + '-' + mediaType} item={m} mediaType={mediaType} />)}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`window yz-window ${maximized ? 'maximized' : ''}`}
      style={!maximized && position ? { transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` } : undefined}
      aria-label="Yozune"
    >
      <header
        className="window-titlebar"
        onPointerDown={beginDrag}
        onDoubleClick={(e) => { if (!e.target.closest('button')) onToggleMaximize?.(); }}
      >
        <div className="window-controls">
          <button className="window-control close" aria-label="Close Yozune" onClick={onClose}><X size={12} /></button>
          <button className="window-control minimize" aria-label="Minimize Yozune" onClick={onMinimize}><Minus size={12} /></button>
          <button className="window-control maximize" aria-label="Toggle maximize" onClick={onToggleMaximize}><Square size={10} /></button>
        </div>
        <span className="window-title">YOZUNE</span>
        <span className="titlebar-spacer" />
      </header>

      <div className="yz-body">
        <aside className="yz-rail">
          <div className="yz-rail-logo"><i className="brand-mark" /></div>
          <button className={`yz-rail-btn ${tab === 'home' ? 'is-active' : ''}`} onClick={() => setTab('home')} title="Home"><HomeIcon size={20} /></button>
          <button className={`yz-rail-btn ${tab === 'tv' ? 'is-active' : ''}`} onClick={() => setTab('tv')} title="TV Shows"><Tv size={20} /></button>
          <button className={`yz-rail-btn ${tab === 'search' ? 'is-active' : ''}`} onClick={() => setTab('search')} title="Search"><SearchIcon size={20} /></button>
        </aside>

        <div className="yz-main">
          {tab === 'home' && (
            <div className="yz-scroll" ref={homeRef}>
              <Hero item={movieHero} mediaType="movie" />
              <div className="yz-rows">
                {MOVIE_ROWS.map((r) => (
                  <Row key={r.url} label={r.label} items={movieRows[r.url]} mediaType="movie" />
                ))}
              </div>
            </div>
          )}

          {tab === 'tv' && (
            <div className="yz-scroll" ref={tvRef}>
              <Hero item={tvHero} mediaType="tv" />
              <div className="yz-rows">
                {TV_ROWS.map((r) => (
                  <Row key={r.url} label={r.label} items={tvRows[r.url]} mediaType="tv" />
                ))}
              </div>
            </div>
          )}

          {tab === 'search' && (
            <div className="yz-search">
              <input
                type="search"
                className="yz-search-input"
                placeholder="Search movies and shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="yz-search-title">
                {searchQuery ? `Results for "${searchQuery}"` : 'Search'}
              </div>
              {searching && <div className="yz-search-hint">Searching…</div>}
              {!searching && searchResults.length === 0 && searchQuery && (
                <div className="yz-search-hint">No results.</div>
              )}
              <div className="yz-search-grid">
                {searchResults.map((m) => (
                  <Tile key={m.id + '-' + m.media_type} item={m} mediaType={m.media_type} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {picker && (
        <div className="yz-overlay">
          <div className="yz-picker">
            <div className="yz-picker-bar">
              <span className="yz-picker-title">{picker.title}</span>
              <button className="yz-picker-close" onClick={closePicker}><X size={14} /></button>
            </div>
            <div className="yz-picker-body">
              {picker.loading && <div className="yz-hint">Loading seasons…</div>}
              {!picker.loading && picker.seasons.length === 0 && <div className="yz-hint">No seasons available.</div>}
              {!picker.loading && picker.seasons.length > 0 && (
                <>
                  <div className="yz-season-row">
                    <label>Season</label>
                    <select value={picker.season} onChange={(e) => loadEpisodes(picker.id, Number(e.target.value))}>
                      {picker.seasons.map((s) => (
                        <option key={s.season_number} value={s.season_number}>Season {s.season_number}</option>
                      ))}
                    </select>
                  </div>
                  <div className="yz-eps">
                    {picker.loadingEps && <div className="yz-hint">Loading episodes…</div>}
                    {!picker.loadingEps && picker.eps.map((ep) => (
                      <button key={ep.episode_number} className="yz-ep" onClick={() => {
                        const s = picker.season;
                        closePicker();
                        openPlayer('tv', picker.id, picker.title, s, ep.episode_number);
                      }}>
                        <span className="yz-ep-still">
                          {ep.still_path
                            ? <img src={TMDB_STILL + ep.still_path} alt="" loading="lazy" />
                            : <span className="yz-ep-still-fb">{ep.episode_number}</span>}
                          <span className="yz-ep-num">{ep.episode_number}</span>
                        </span>
                        <span className="yz-ep-info">
                          <span className="yz-ep-name">{ep.name || ('Episode ' + ep.episode_number)}</span>
                          <span className="yz-ep-meta">{ep.air_date || ''}</span>
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
        <div className="yz-overlay yz-overlay--player">
          <div className="yz-player">
            <div className="yz-player-bar">
              <span className="yz-player-title">{player.title}</span>
              <button className="yz-picker-close" onClick={closePlayer}>Close</button>
            </div>
            <div className="yz-player-frame">
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
