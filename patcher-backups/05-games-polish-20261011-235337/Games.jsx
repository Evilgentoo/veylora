import { useMemo, useState } from 'react';
import { X, Minus, Square, Search, Settings, UserRound, Gamepad2, Compass, Library, Clapperboard, Sparkles, ChevronRight, Play } from 'lucide-react';

const GAMES = [
  { id: 'explore', title: 'Explore', type: 'games', kind: 'explore', subtitle: 'Discover something new', description: 'Your next gaming session starts here.', art: 'art-explore' },
  { id: 'astro', title: "ASTRO'S PLAYROOM", type: 'games', kind: 'astro', subtitle: 'Ready to play', description: 'A bright little adventure through the worlds of PlayStation.', art: 'art-astro' },
  { id: 'spider', title: 'MARVEL’S SPIDER-MAN 2', type: 'games', kind: 'action', subtitle: 'Action · Adventure', description: 'Swing into a city full of possibilities.', art: 'art-spider' },
  { id: 'souls', title: "DEMON'S SOULS", type: 'games', kind: 'fantasy', subtitle: 'Action RPG', description: 'A dark fantasy challenge awaits.', art: 'art-souls' },
  { id: 'returnal', title: 'RETURNAL', type: 'games', kind: 'sci-fi', subtitle: 'Roguelike · Sci-fi', description: 'Break the cycle on an unfamiliar world.', art: 'art-returnal' },
  { id: 'lastofus', title: 'THE LAST OF US', type: 'games', kind: 'survival', subtitle: 'Story · Adventure', description: 'A journey through a changed world.', art: 'art-lastofus' },
  { id: 'ghost', title: 'GHOST OF TSUSHIMA', type: 'games', kind: 'samurai', subtitle: 'Action · Open world', description: 'Explore a windswept island and its stories.', art: 'art-ghost' },
  { id: 'library', title: 'Game Library', type: 'games', kind: 'library', subtitle: 'Your collection', description: 'Browse your games in one place.', art: 'art-library' },
  { id: 'media', title: 'Media Gallery', type: 'media', kind: 'media', subtitle: 'Your captures', description: 'A place for screenshots and clips.', art: 'art-media' },
  { id: 'streaming', title: 'Media', type: 'media', kind: 'streaming', subtitle: 'Entertainment', description: 'Your entertainment apps and services.', art: 'art-streaming' },
];
function CoverGlyph({ kind }) {
  if (kind === 'explore') return <Compass size={43} strokeWidth={1.55} />;
  if (kind === 'library') return <Library size={36} strokeWidth={1.6} />;
  if (kind === 'media') return <Clapperboard size={36} strokeWidth={1.6} />;
  if (kind === 'streaming') return <Play size={34} strokeWidth={1.7} />;
  if (kind === 'astro') return <Sparkles size={36} strokeWidth={1.5} />;
  return <Gamepad2 size={34} strokeWidth={1.45} />;
}
export default function Games({ onClose, onMinimize, onToggleMaximize, maximized }) {
  const [tab, setTab] = useState('games');
  const [selectedId, setSelectedId] = useState('explore');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [time] = useState(() => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
  const items = useMemo(() => GAMES.filter(item => item.type === tab && item.title.toLowerCase().includes(query.trim().toLowerCase())), [tab, query]);
  const selected = GAMES.find(item => item.id === selectedId) || GAMES[0];
  return <section className={`window games-window ${maximized ? 'maximized' : ''}`} aria-label="Games">
    <header className="window-titlebar games-titlebar"><div className="window-controls">
      <button className="window-control close" aria-label="Close Games" onClick={onClose}><X size={12} /></button>
      <button className="window-control minimize" aria-label="Minimize Games" onClick={onMinimize}><Minus size={12} /></button>
      <button className="window-control maximize" aria-label="Toggle maximize" onClick={onToggleMaximize}><Square size={10} /></button>
    </div><span className="window-title">VEYLORA GAMES</span><span className="titlebar-spacer" /></header>
    <div className="games-shell"><div className="games-ambient" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <header className="games-topbar"><nav className="games-primary-nav" aria-label="Games sections">
        <button className={tab === 'games' ? 'is-active' : ''} onClick={() => { setTab('games'); setSelectedId('explore'); }}>Games</button>
        <button className={tab === 'media' ? 'is-active' : ''} onClick={() => { setTab('media'); setSelectedId('media'); }}>Media</button>
      </nav><div className="games-wordmark" aria-label="Veylora Games"><span className="games-mark"><Gamepad2 size={28} strokeWidth={1.6} /></span><span>VEYLORA</span></div>
      <div className="games-top-actions">{searchOpen && <input className="games-search-input" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search library" aria-label="Search games" />}
        <button aria-label="Search" title="Search" className={searchOpen ? 'is-active' : ''} onClick={() => { setSearchOpen(v => !v); setQuery(''); }}><Search size={21} /></button>
        <button aria-label="Games settings" title="Settings" className={settingsOpen ? 'is-active' : ''} onClick={() => { setSettingsOpen(v => !v); setProfileOpen(false); }}><Settings size={22} /></button>
        <button aria-label="Profile" title="Profile" className={profileOpen ? 'is-active games-profile' : 'games-profile'} onClick={() => { setProfileOpen(v => !v); setSettingsOpen(false); }}><UserRound size={19} /><span className="games-online-dot" /></button><time>{time}</time>
      </div></header>
      {(settingsOpen || profileOpen) && <div className="games-popover"><strong>{settingsOpen ? 'Quick settings' : 'Local profile'}</strong>
        <p>{settingsOpen ? 'Games follows Veylora’s current light/dark mode and accent color.' : 'This first dashboard is local-only. Profile switching can be added in a later stage.'}</p>
        <button onClick={() => { setSettingsOpen(false); setProfileOpen(false); }}>Done <ChevronRight size={14} /></button></div>}
      <div className="games-content"><div className="games-library-heading"><span>{tab === 'games' ? 'YOUR GAMES' : 'MEDIA & CAPTURES'}</span><span className="games-count">{items.length} ITEMS</span></div>
        <div className="games-carousel" role="list" aria-label={tab === 'games' ? 'Game carousel' : 'Media carousel'}>
          {items.map(item => <button key={item.id} role="listitem" className={`games-tile ${item.art} ${selectedId === item.id ? 'is-selected' : ''}`} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}>
            <span className="games-tile-art"><CoverGlyph kind={item.kind} /></span><span className="games-tile-title">{item.title}</span>{selectedId === item.id && <span className="games-tile-indicator" />}
          </button>)}{!items.length && <div className="games-empty">No matches in this section.</div>}</div>
        <section className="games-feature" aria-live="polite"><div className="games-feature-copy">
          <span className="games-eyebrow">{selected.id === 'explore' ? 'PLAY YOUR WAY' : selected.type === 'media' ? 'CAPTURE · WATCH · SHARE' : 'READY WHEN YOU ARE'}</span>
          <h1>{selected.title}</h1><p className="games-feature-subtitle">{selected.subtitle}</p><p className="games-feature-description">{selected.description}</p>
          <div className="games-feature-actions"><button className="games-primary-action" onClick={() => { if (selected.id === 'library') { setQuery(''); setSearchOpen(true); } else if (selected.id === 'explore') { setQuery(''); setTab('games'); setSelectedId('astro'); } else { setSettingsOpen(false); } }}><Play size={15} fill="currentColor" /> {selected.id === 'explore' ? 'Explore games' : selected.id === 'library' ? 'Browse library' : selected.type === 'media' ? 'Open collection' : 'View details'}</button>
            <button className="games-secondary-action" onClick={() => { setTab('games'); setSelectedId('library'); }}><Library size={16} /> Game library</button></div></div>
          <div className={`games-feature-art ${selected.art}`} aria-hidden="true"><div className="games-feature-ring" /><div className="games-feature-symbol"><CoverGlyph kind={selected.kind} /></div><span className="games-feature-art-label">{selected.kind === 'explore' ? 'DISCOVER' : selected.kind.toUpperCase()}</span></div>
        </section><footer className="games-footer"><span><span className="games-footer-dot" /> VEYLORA GAMES</span><span>Choose a tile to explore</span></footer>
      </div>
    </div>
  </section>;
}
