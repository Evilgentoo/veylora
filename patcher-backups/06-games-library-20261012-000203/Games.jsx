import { useEffect, useMemo, useState } from 'react';
import { X, Minus, Square, Search, Settings, UserRound, Gamepad2, Compass, Library, Clapperboard, Sparkles, ChevronRight, Play, ArrowLeft, Check, Clock3, Grid2X2, Film, Image as ImageIcon, MonitorPlay, Plus, Pencil, LogIn, Power, Star } from 'lucide-react';

const PROFILE_KEY = 'veylora.games.profile';
const ENTERED_KEY = 'veylora.games.entered';
const DEFAULT_PROFILE = { name: 'Player', avatar: 'orbit' };
const AVATARS = [
  { id: 'orbit', label: 'Orbit', mark: '◉' },
  { id: 'fox', label: 'Fox', mark: '狐' },
  { id: 'moon', label: 'Moon', mark: '☾' },
  { id: 'bolt', label: 'Bolt', mark: 'ϟ' },
  { id: 'pixel', label: 'Pixel', mark: '▦' },
  { id: 'flower', label: 'Flower', mark: '✿' },
];
const GAMES = [
  { id: 'explore', title: 'Explore', kind: 'explore', subtitle: 'Find your next game', description: 'A little inspiration for your next session.', art: 'art-explore', category: 'FEATURED' },
  { id: 'astro', title: "ASTRO'S PLAYROOM", kind: 'astro', subtitle: 'Ready to play', description: 'A bright, playful platforming adventure.', art: 'art-astro', category: 'PLATFORMER' },
  { id: 'spider', title: 'MARVEL’S SPIDER-MAN 2', kind: 'action', subtitle: 'Action · Adventure', description: 'Swing through the city as two legendary heroes.', art: 'art-spider', category: 'ACTION' },
  { id: 'souls', title: "DEMON'S SOULS", kind: 'fantasy', subtitle: 'Action RPG', description: 'A demanding journey through a dark fantasy world.', art: 'art-souls', category: 'ROLE-PLAYING' },
  { id: 'returnal', title: 'RETURNAL', kind: 'sci-fi', subtitle: 'Roguelike · Sci-fi', description: 'Break the cycle on a world that keeps changing.', art: 'art-returnal', category: 'SCI-FI' },
  { id: 'lastofus', title: 'THE LAST OF US', kind: 'survival', subtitle: 'Story · Adventure', description: 'A story of survival in a changed world.', art: 'art-lastofus', category: 'ADVENTURE' },
  { id: 'ghost', title: 'GHOST OF TSUSHIMA', kind: 'samurai', subtitle: 'Action · Open world', description: 'Explore a windswept island and its stories.', art: 'art-ghost', category: 'OPEN WORLD' },
  { id: 'horizon', title: 'HORIZON', kind: 'sci-fi', subtitle: 'Action RPG', description: 'Explore a world reclaimed by nature.', art: 'art-horizon', category: 'ADVENTURE' },
  { id: 'cities', title: 'CITIES: SKYLINES', kind: 'builder', subtitle: 'City builder', description: 'Build a city that reflects your imagination.', art: 'art-cities', category: 'SIMULATION' },
];
const MEDIA_GROUPS = [
  { id: 'recent', title: 'Recently added', subtitle: 'Your latest media', items: [
    { id: 'capture-1', title: 'Game captures', detail: 'Screenshots & clips', icon: 'image', art: 'media-capture' },
    { id: 'gallery', title: 'Media Gallery', detail: 'Your capture collection', icon: 'gallery', art: 'media-gallery' },
    { id: 'clips', title: 'Video clips', detail: 'Gameplay recordings', icon: 'film', art: 'media-clips' },
  ]},
  { id: 'entertainment', title: 'Entertainment', subtitle: 'Media apps', items: [
    { id: 'music', title: 'Music', detail: 'Listen while you play', icon: 'music', art: 'media-music' },
    { id: 'video', title: 'Video services', detail: 'Your streaming apps', icon: 'video', art: 'media-video' },
    { id: 'browser', title: 'Discover', detail: 'Explore the web', icon: 'discover', art: 'media-discover' },
  ]},
  { id: 'collections', title: 'Your collections', subtitle: 'Keep things together', items: [
    { id: 'favorites', title: 'Favorites', detail: 'Things you saved', icon: 'star', art: 'media-favorites' },
    { id: 'downloads', title: 'Downloads', detail: 'Locally available items', icon: 'download', art: 'media-downloads' },
    { id: 'all-media', title: 'All media', detail: 'Browse every category', icon: 'grid', art: 'media-all' },
  ]},
];
function readProfile() {
  try { const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); if (saved && typeof saved.name === 'string') return { name: saved.name.slice(0, 24) || 'Player', avatar: AVATARS.some(a => a.id === saved.avatar) ? saved.avatar : 'orbit' }; } catch {}
  return DEFAULT_PROFILE;
}
function CoverGlyph({ kind, size = 34 }) {
  if (kind === 'explore') return <Compass size={size} strokeWidth={1.5} />;
  if (kind === 'library') return <Library size={size} strokeWidth={1.6} />;
  if (kind === 'media' || kind === 'gallery') return <Clapperboard size={size} strokeWidth={1.5} />;
  if (kind === 'image') return <ImageIcon size={size} strokeWidth={1.5} />;
  if (kind === 'film' || kind === 'video') return <Film size={size} strokeWidth={1.5} />;
  if (kind === 'music') return <MonitorPlay size={size} strokeWidth={1.5} />;
  if (kind === 'discover') return <Compass size={size} strokeWidth={1.5} />;
  if (kind === 'star') return <Star size={size} strokeWidth={1.5} />;
  if (kind === 'grid' || kind === 'download') return <Grid2X2 size={size} strokeWidth={1.5} />;
  if (kind === 'astro') return <Sparkles size={size} strokeWidth={1.5} />;
  return <Gamepad2 size={size} strokeWidth={1.45} />;
}
function Avatar({ avatar, small = false }) {
  const item = AVATARS.find(a => a.id === avatar) || AVATARS[0];
  return <span className={`games-avatar games-avatar-${item.id} ${small ? 'small' : ''}`} aria-hidden="true">{item.mark}</span>;
}
function readEntered() { try { return localStorage.getItem(ENTERED_KEY) === 'yes'; } catch { return false; } }

export default function Games({ onClose, onMinimize, onToggleMaximize, maximized }) {
  const [entered, setEntered] = useState(readEntered);
  const [profile, setProfile] = useState(readProfile);
  const [tab, setTab] = useState('games');
  const [selectedId, setSelectedId] = useState('explore');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);
  const [avatarDraft, setAvatarDraft] = useState(profile.avatar);
  const [notice, setNotice] = useState('');
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
  useEffect(() => { const id = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })), 30000); return () => clearInterval(id); }, []);
  const items = useMemo(() => GAMES.filter(item => item.title.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const selected = GAMES.find(item => item.id === selectedId) || GAMES[0];
  const enter = () => { try { localStorage.setItem(ENTERED_KEY, 'yes'); } catch {} setEntered(true); setTab('games'); setSelectedId('explore'); };
  const saveProfile = () => {
    const next = { name: nameDraft.trim().slice(0, 24) || 'Player', avatar: AVATARS.some(a => a.id === avatarDraft) ? avatarDraft : 'orbit' };
    setProfile(next); setNameDraft(next.name); setAvatarDraft(next.avatar);
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch {}
    setNotice('Profile saved on this device.');
  };
  const chooseTab = next => { setTab(next); setQuery(''); setSearchOpen(false); setSettingsOpen(false); setProfileOpen(false); if (next === 'games') setSelectedId('explore'); };
  const openSettings = () => { setNameDraft(profile.name); setAvatarDraft(profile.avatar); setNotice(''); setSettingsOpen(v => !v); setProfileOpen(false); };
  const openProfile = () => { setProfileOpen(v => !v); setSettingsOpen(false); };

  return <section className={`window games-window ${maximized ? 'maximized' : ''}`} aria-label="Games">
    <header className="window-titlebar games-titlebar"><div className="window-controls">
      <button className="window-control close" aria-label="Close Games" onClick={onClose}><X size={12} /></button>
      <button className="window-control minimize" aria-label="Minimize Games" onClick={onMinimize}><Minus size={12} /></button>
      <button className="window-control maximize" aria-label="Toggle maximize" onClick={onToggleMaximize}><Square size={10} /></button>
    </div><span className="window-title">VEYLORA GAMES</span><span className="titlebar-spacer" /></header>
    {!entered ? <div className="games-welcome"><div className="games-welcome-grain" aria-hidden="true" /><div className="games-welcome-time">{time}</div><div className="games-welcome-content"><span className="games-welcome-overline">VEYLORA GAMES</span><h1>Welcome back</h1><p>Who's playing today?</p><button className="games-welcome-profile" onClick={enter}><Avatar avatar={profile.avatar} /><span className="games-welcome-name">{profile.name}</span><span className="games-welcome-hint">Continue as player</span><ChevronRight size={18} /></button><button className="games-welcome-options" onClick={openSettings}><Settings size={15} /> Profile options</button><button className="games-welcome-enter" onClick={enter}><LogIn size={16} /> Continue <ChevronRight size={16} /></button></div><div className="games-welcome-bottom"><span><Power size={14} /> LOCAL PROFILE</span><span>NO ACCOUNT REQUIRED</span></div>{settingsOpen && <div className="games-profile-editor welcome-editor"><ProfileEditor profile={profile} nameDraft={nameDraft} setNameDraft={setNameDraft} avatarDraft={avatarDraft} setAvatarDraft={setAvatarDraft} saveProfile={saveProfile} notice={notice} onDone={() => setSettingsOpen(false)} /></div>}</div> : <div className="games-shell">
      <div className="games-ambient" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <header className="games-topbar"><nav className="games-primary-nav" aria-label="Games sections">
        <button className={tab === 'games' ? 'is-active' : ''} onClick={() => chooseTab('games')}>Games</button>
        <button className={tab === 'media' ? 'is-active' : ''} onClick={() => chooseTab('media')}>Media</button>
      </nav><div className="games-wordmark" aria-label="Veylora Games"><span className="games-mark"><Gamepad2 size={26} strokeWidth={1.6} /></span><span>VEYLORA</span></div>
      <div className="games-top-actions">{searchOpen && <input className="games-search-input" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder={tab === 'games' ? 'Search games' : 'Search media'} aria-label="Search library" />}
        <button aria-label="Search" title="Search" className={searchOpen ? 'is-active' : ''} onClick={() => { setSearchOpen(v => !v); setQuery(''); }}><Search size={20} /></button>
        <button aria-label="Games settings" title="Settings" className={settingsOpen ? 'is-active' : ''} onClick={openSettings}><Settings size={21} /></button>
        <button aria-label="Profile" title={profile.name} className={profileOpen ? 'is-active games-profile' : 'games-profile'} onClick={openProfile}><Avatar avatar={profile.avatar} small /><span className="games-online-dot" /></button><time>{time}</time>
      </div></header>
      {(settingsOpen || profileOpen) && <div className="games-popover">{settingsOpen ? <ProfileEditor profile={profile} nameDraft={nameDraft} setNameDraft={setNameDraft} avatarDraft={avatarDraft} setAvatarDraft={setAvatarDraft} saveProfile={saveProfile} notice={notice} onDone={() => setSettingsOpen(false)} /> : <><div className="games-popover-profile"><Avatar avatar={profile.avatar} /><div><strong>{profile.name}</strong><span>Local player profile</span></div></div><p>Your profile is stored only in this browser. No sign-in or account is needed.</p><button className="games-popover-action" onClick={() => { setProfileOpen(false); openSettings(); }}><Pencil size={14} /> Edit profile <ChevronRight size={14} /></button><button className="games-popover-quiet" onClick={() => { setEntered(false); setProfileOpen(false); }}>Switch player screen</button></>}</div>}
      <main className={`games-content ${tab === 'media' ? 'media-mode' : ''}`}>
        {tab === 'games' ? <>
          <div className="games-section-head"><div><span className="games-kicker">YOUR COLLECTION</span><h2>Games</h2></div><span className="games-count">{items.length} TITLES</span></div>
          <div className="games-carousel" role="list" aria-label="Game carousel">{items.map(item => <button key={item.id} role="listitem" className={`games-tile ${item.art} ${selectedId === item.id ? 'is-selected' : ''}`} onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id}><span className="games-tile-art"><CoverGlyph kind={item.kind} /></span><span className="games-tile-title">{item.title}</span>{selectedId === item.id && <span className="games-tile-indicator" />}</button>)}{!items.length && <div className="games-empty">No games match that search.</div>}</div>
          <section className="games-feature" aria-live="polite"><div className="games-feature-copy"><span className="games-eyebrow">{selected.category}</span><h1>{selected.title}</h1><p className="games-feature-subtitle">{selected.subtitle}</p><p className="games-feature-description">{selected.description}</p><div className="games-feature-actions"><button className="games-primary-action" onClick={() => { if (selected.id === 'explore') setSelectedId('astro'); else setNotice(`${selected.title} selected.`); }}><Play size={14} fill="currentColor" /> {selected.id === 'explore' ? 'Explore games' : 'Select game'}</button><button className="games-secondary-action" onClick={() => { setQuery(''); setSearchOpen(true); }}><Search size={15} /> Search library</button></div>{notice && <span className="games-inline-notice">{notice}</span>}</div><div className={`games-feature-art ${selected.art}`} aria-hidden="true"><div className="games-feature-ring" /><div className="games-feature-symbol"><CoverGlyph kind={selected.kind} size={45} /></div><span className="games-feature-art-label">{selected.category}</span></div></section>
          <section className="games-lower-library"><div className="games-section-head compact"><div><span className="games-kicker">KEEP PLAYING</span><h2>Recently played</h2></div><button className="games-text-button" onClick={() => { setQuery(''); setSearchOpen(true); }}>View all <ChevronRight size={14} /></button></div><div className="games-recent-row">{GAMES.filter(g => g.id !== 'explore').slice(0, 5).map(g => <button key={g.id} className="games-recent-card" onClick={() => setSelectedId(g.id)}><span className={`games-recent-art ${g.art}`}><CoverGlyph kind={g.kind} size={25} /></span><span><strong>{g.title}</strong><small>{g.subtitle}</small></span><ChevronRight size={15} /></button>)}</div></section>
        </> : <div className="games-media-library"><div className="games-media-intro"><div><span className="games-kicker">YOUR SPACE</span><h1>Media library</h1><p>Captures, clips, and entertainment in one place.</p></div><div className="games-media-summary"><span><ImageIcon size={16} /> Captures</span><span><Film size={16} /> Video</span><span><Grid2X2 size={16} /> Collections</span></div></div>
          {MEDIA_GROUPS.map(group => <section className="games-media-group" key={group.id}><div className="games-section-head compact"><div><span className="games-kicker">{group.subtitle}</span><h2>{group.title}</h2></div><button className="games-text-button" onClick={() => setNotice(`${group.title} opened.`)}>View all <ChevronRight size={14} /></button></div><div className="games-media-grid">{group.items.filter(item => item.title.toLowerCase().includes(query.trim().toLowerCase()) || item.detail.toLowerCase().includes(query.trim().toLowerCase())).map(item => <button key={item.id} className={`games-media-card ${item.art}`} onClick={() => setNotice(`${item.title}: this local demo collection is ready to connect to Veylora files.`)}><span className="games-media-card-art"><CoverGlyph kind={item.icon} size={29} /><span className="games-media-card-corner"><ChevronRight size={14} /></span></span><span className="games-media-card-copy"><strong>{item.title}</strong><small>{item.detail}</small></span></button>)}</div></section>)}{notice && <div className="games-media-notice">{notice}</div>}<div className="games-library-note"><Clock3 size={14} /> This is a local library interface. Real screenshots and clips can be connected in a later step.</div>
        </div>}
        <footer className="games-footer"><span><span className="games-footer-dot" /> VEYLORA GAMES</span><span>{tab === 'games' ? 'Select a title to explore' : 'Your media, organized'}</span></footer>
      </main>
    </div>}
  </section>;
}
function ProfileEditor({ profile, nameDraft, setNameDraft, avatarDraft, setAvatarDraft, saveProfile, notice, onDone }) {
  return <div className="games-profile-editor-inner"><div className="games-editor-heading"><div><span className="games-kicker">PLAYER SETTINGS</span><h2>Profile</h2></div><Avatar avatar={avatarDraft} /></div><label className="games-name-label" htmlFor="games-player-name">Display name</label><input id="games-player-name" className="games-name-input" value={nameDraft} maxLength={24} onChange={e => setNameDraft(e.target.value)} placeholder="Your player name" /><span className="games-field-hint">Shown on the welcome screen and profile menu.</span><span className="games-name-label">Choose an avatar</span><div className="games-avatar-choices">{AVATARS.map(a => <button type="button" key={a.id} className={`games-avatar-choice ${avatarDraft === a.id ? 'selected' : ''}`} onClick={() => setAvatarDraft(a.id)} aria-label={`Choose ${a.label} avatar`} aria-pressed={avatarDraft === a.id}><Avatar avatar={a.id} /><span>{a.label}</span>{avatarDraft === a.id && <Check size={13} />}</button>)}</div>{notice && <p className="games-save-notice">{notice}</p>}<div className="games-editor-actions"><button className="games-popover-quiet" onClick={onDone}>Cancel</button><button className="games-primary-action" onClick={() => { saveProfile(); onDone(); }}><Check size={14} /> Save profile</button></div></div>;
}
