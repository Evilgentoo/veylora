import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Minus, Square, Search, Settings, UserRound, Gamepad2, Compass, Library, Sparkles, ChevronRight, Play, Check, Grid2X2, Plus, Pencil, LogIn, Power, Star, Image as ImageIcon, Upload, Trash2, SlidersHorizontal } from 'lucide-react';

const PROFILE_KEY = 'veylora.games.profile';
const ENTERED_KEY = 'veylora.games.entered';
const GAME_LIBRARY_KEY = 'veylora.games.owned';
const CUSTOM_GAMES_KEY = 'veylora.games.custom';
const DEFAULT_PROFILE = { name: 'Player', avatar: 'orbit', image: '' };
const DEFAULT_OWNED_IDS = ['astro', 'spider', 'souls', 'returnal', 'lastofus'];
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
const EXTRA_GAMES = [
  { id: 'gran-turismo-7', title: 'GRAN TURISMO 7', kind: 'racing', subtitle: 'Driving · Simulation', description: 'Find your line and build your garage.', art: 'art-racing', category: 'RACING' },
  { id: 'ratchet-clank', title: 'RATCHET & CLANK', kind: 'astro', subtitle: 'Action · Adventure', description: 'A colorful interdimensional adventure.', art: 'art-ratchet', category: 'ACTION' },
  { id: 'god-of-war', title: 'GOD OF WAR RAGNARÖK', kind: 'fantasy', subtitle: 'Action · Adventure', description: 'A mythic journey across the realms.', art: 'art-godofwar', category: 'ADVENTURE' },
  { id: 'final-fantasy-xvi', title: 'FINAL FANTASY XVI', kind: 'fantasy', subtitle: 'Fantasy · RPG', description: 'An epic fantasy story built around powerful summons.', art: 'art-finalfantasy', category: 'ROLE-PLAYING' },
  { id: 'elden-ring', title: 'ELDEN RING', kind: 'fantasy', subtitle: 'Action RPG', description: 'Explore a vast world full of secrets.', art: 'art-eldenring', category: 'ROLE-PLAYING' },
  { id: 'fortnite', title: 'FORTNITE', kind: 'action', subtitle: 'Action · Multiplayer', description: 'Drop into a session with friends.', art: 'art-fortnite', category: 'MULTIPLAYER' },
  { id: 'minecraft', title: 'MINECRAFT', kind: 'builder', subtitle: 'Creative · Survival', description: 'Build, explore, and make your own world.', art: 'art-minecraft', category: 'SANDBOX' },
  { id: 'rocket-league', title: 'ROCKET LEAGUE', kind: 'racing', subtitle: 'Sports · Multiplayer', description: 'A fast game of cars and football.', art: 'art-rocketleague', category: 'SPORTS' },
  { id: 'cyberpunk-2077', title: 'CYBERPUNK 2077', kind: 'sci-fi', subtitle: 'RPG · Open world', description: 'Make your way through a neon-lit city.', art: 'art-cyberpunk', category: 'ROLE-PLAYING' },
  { id: 'hogwarts-legacy', title: 'HOGWARTS LEGACY', kind: 'fantasy', subtitle: 'Action RPG', description: 'Explore a magical world and write your own story.', art: 'art-hogwarts', category: 'ADVENTURE' },
  { id: 'sackboy', title: 'SACKBOY: A BIG ADVENTURE', kind: 'astro', subtitle: 'Platformer · Co-op', description: 'A playful platforming adventure.', art: 'art-sackboy', category: 'PLATFORMER' },
  { id: 'resident-evil-4', title: 'RESIDENT EVIL 4', kind: 'survival', subtitle: 'Horror · Action', description: 'A tense survival adventure.', art: 'art-residentevil', category: 'SURVIVAL HORROR' },
];
function readProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
    if (saved && typeof saved.name === 'string') {
      const image = typeof saved.image === 'string' && saved.image.startsWith('data:image/') && saved.image.length < 500000 ? saved.image : '';
      return { name: saved.name.slice(0, 24) || 'Player', avatar: AVATARS.some(a => a.id === saved.avatar) ? saved.avatar : 'orbit', image };
    }
  } catch {}
  return DEFAULT_PROFILE;
}
function readOwnedIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAME_LIBRARY_KEY) || 'null');
    if (Array.isArray(saved)) return [...new Set(saved.filter(id => typeof id === 'string' && id.length < 100))];
  } catch {}
  return DEFAULT_OWNED_IDS;
}
function readCustomGames() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_GAMES_KEY) || '[]');
    if (Array.isArray(saved)) return saved.filter(item => item && typeof item.id === 'string' && item.id.startsWith('custom-') && typeof item.title === 'string').slice(0, 150).map(item => ({
      id: item.id, title: item.title.slice(0, 48), kind: 'custom', subtitle: 'Personal collection', description: 'A custom title in your Veylora game library.', art: 'art-custom', category: 'YOUR LIBRARY'
    }));
  } catch {}
  return [];
}
function readEntered() { try { return localStorage.getItem(ENTERED_KEY) === 'yes'; } catch { return false; } }
function CoverGlyph({ kind, size = 34 }) {
  if (kind === 'explore') return <Compass size={size} strokeWidth={1.5} />;
  if (kind === 'library') return <Library size={size} strokeWidth={1.6} />;
  if (kind === 'astro') return <Sparkles size={size} strokeWidth={1.5} />;
  if (kind === 'racing') return <SlidersHorizontal size={size} strokeWidth={1.5} />;
  if (kind === 'builder') return <Grid2X2 size={size} strokeWidth={1.5} />;
  return <Gamepad2 size={size} strokeWidth={1.45} />;
}
function Avatar({ avatar, image = '', small = false }) {
  const item = AVATARS.find(a => a.id === avatar) || AVATARS[0];
  return <span className={`games-avatar games-avatar-${item.id} ${small ? 'small' : ''} ${image ? 'has-custom-image' : ''}`} aria-hidden="true">{image ? <img src={image} alt="" /> : item.mark}</span>;
}
function ProfileEditor({ profile, nameDraft, setNameDraft, avatarDraft, setAvatarDraft, imageDraft, setImageDraft, saveProfile, notice, setNotice, onDone }) {
  const handleImage = (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setNotice('Choose an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setNotice('Choose an image smaller than 10 MB.'); return; }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const size = Math.min(image.naturalWidth, image.naturalHeight);
        const sx = Math.max(0, (image.naturalWidth - size) / 2);
        const sy = Math.max(0, (image.naturalHeight - size) / 2);
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 256;
        const context = canvas.getContext('2d');
        context.drawImage(image, sx, sy, size, size, 0, 0, 256, 256);
        const data = canvas.toDataURL('image/jpeg', 0.82);
        if (data.length > 450000) { setNotice('That image could not be reduced enough. Try a smaller image.'); }
        else { setImageDraft(data); setNotice('Custom profile image ready. Save profile to keep it.'); }
      } catch { setNotice('Could not load that image. Try another file.'); }
      URL.revokeObjectURL(url);
    };
    image.onerror = () => { URL.revokeObjectURL(url); setNotice('Could not open that image. Try another file.'); };
    image.src = url;
  };
  return <div className="games-profile-editor-inner">
    <div className="games-editor-heading"><div><span className="games-kicker">PLAYER SETTINGS</span><h2>Profile</h2></div><Avatar avatar={avatarDraft} image={imageDraft} /></div>
    <label className="games-name-label" htmlFor="games-player-name">Display name</label>
    <input id="games-player-name" className="games-name-input" value={nameDraft} maxLength={24} onChange={e => setNameDraft(e.target.value)} placeholder="Your player name" />
    <span className="games-field-hint">Shown on the welcome screen and profile menu.</span>
    <span className="games-name-label">Profile photo</span>
    <div className="games-custom-image-row"><label className="games-upload-button"><Upload size={14} /> Choose image<input type="file" accept="image/*" onChange={handleImage} /></label>{imageDraft && <button type="button" className="games-remove-image" onClick={() => { setImageDraft(''); setNotice('Custom image removed.'); }}><Trash2 size={13} /> Remove</button>}</div>
    <span className="games-field-hint">Square-cropped and saved locally in this browser.</span>
    <span className="games-name-label">Or choose an avatar</span>
    <div className="games-avatar-choices">{AVATARS.map(a => <button type="button" key={a.id} className={`games-avatar-choice ${!imageDraft && avatarDraft === a.id ? 'selected' : ''}`} onClick={() => { setAvatarDraft(a.id); setImageDraft(''); }} aria-label={`Choose ${a.label} avatar`} aria-pressed={!imageDraft && avatarDraft === a.id}><Avatar avatar={a.id} /><span>{a.label}</span>{!imageDraft && avatarDraft === a.id && <Check size={13} />}</button>)}</div>
    {notice && <p className="games-save-notice" role="status">{notice}</p>}
    <div className="games-editor-actions"><button className="games-popover-quiet" onClick={onDone}>Cancel</button><button className="games-primary-action" onClick={() => { saveProfile(); onDone(); }}><Check size={14} /> Save profile</button></div>
  </div>;
}

export default function Games({ onClose, onMinimize, onToggleMaximize, maximized }) {
  const [entered, setEntered] = useState(readEntered);
  const [profile, setProfile] = useState(readProfile);
  const [ownedIds, setOwnedIds] = useState(readOwnedIds);
  const [customGames, setCustomGames] = useState(readCustomGames);
  const [tab, setTab] = useState('games');
  const [selectedId, setSelectedId] = useState('explore');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);
  const [avatarDraft, setAvatarDraft] = useState(profile.avatar);
  const [imageDraft, setImageDraft] = useState(profile.image || '');
  const [notice, setNotice] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [windowOffset, setWindowOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef(null);
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));

  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })), 30000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!dragging) return undefined;
    const move = event => {
      if (!dragOrigin.current) return;
      const rawX = event.clientX - dragOrigin.current.pointerX + dragOrigin.current.startX;
      const rawY = event.clientY - dragOrigin.current.pointerY + dragOrigin.current.startY;
      const limitX = Math.max(0, (window.innerWidth - 180) / 2);
      const limitY = Math.max(0, (window.innerHeight - 72) / 2);
      setWindowOffset({ x: Math.max(-limitX, Math.min(limitX, rawX)), y: Math.max(-limitY, Math.min(limitY, rawY)) });
    };
    const stop = () => { setDragging(false); dragOrigin.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [dragging]);

  const allGames = useMemo(() => [...GAMES.filter(game => game.id !== 'explore'), ...EXTRA_GAMES, ...customGames], [customGames]);
  const selected = allGames.find(game => game.id === selectedId) || GAMES[0];
  const gameItems = useMemo(() => {
    const text = query.trim().toLowerCase();
    const explore = GAMES[0];
    const exploreMatches = explore.title.toLowerCase().includes(text);
    return [...(exploreMatches ? [explore] : []), ...allGames.filter(game => ownedIds.includes(game.id) && game.title.toLowerCase().includes(text))];
  }, [allGames, ownedIds, query]);
  const catalogItems = useMemo(() => {
    const text = query.trim().toLowerCase();
    return allGames.filter(game => {
      const matchesText = `${game.title} ${game.subtitle} ${game.category}`.toLowerCase().includes(text);
      const matchesFilter = libraryFilter === 'all' || (libraryFilter === 'added' ? ownedIds.includes(game.id) : !ownedIds.includes(game.id));
      return matchesText && matchesFilter;
    });
  }, [allGames, ownedIds, query, libraryFilter]);

  const enter = () => { try { localStorage.setItem(ENTERED_KEY, 'yes'); } catch {} setEntered(true); setTab('games'); setSelectedId('explore'); };
  const openSettings = () => {
    setNameDraft(profile.name); setAvatarDraft(profile.avatar); setImageDraft(profile.image || ''); setNotice('');
    setSettingsOpen(value => !value); setProfileOpen(false);
  };
  const openProfile = () => { setProfileOpen(value => !value); setSettingsOpen(false); };
  const saveProfile = () => {
    const next = { name: nameDraft.trim().slice(0, 24) || 'Player', avatar: AVATARS.some(a => a.id === avatarDraft) ? avatarDraft : 'orbit', image: imageDraft || '' };
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); setProfile(next); setNameDraft(next.name); setAvatarDraft(next.avatar); setImageDraft(next.image); setNotice('Profile saved on this device.'); }
    catch { setNotice('Could not save this profile. Try a smaller image.'); }
  };
  const chooseTab = next => { setTab(next); setQuery(''); setSearchOpen(false); setSettingsOpen(false); setProfileOpen(false); setNotice(''); if (next === 'games') setSelectedId('explore'); };
  const beginDrag = event => {
    if (maximized || event.target.closest('button, input, label, a')) return;
    event.preventDefault();
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, startX: windowOffset.x, startY: windowOffset.y };
    setDragging(true);
  };
  const toggleOwned = game => {
    const removing = ownedIds.includes(game.id);
    const next = removing ? ownedIds.filter(id => id !== game.id) : [...ownedIds, game.id];
    setOwnedIds(next);
    let saved = true;
    try { localStorage.setItem(GAME_LIBRARY_KEY, JSON.stringify(next)); }
    catch { saved = false; }
    setNotice(saved ? (removing ? `${game.title} removed from Games.` : `${game.title} added to Games.`) : 'Could not save the collection in this browser.');
    if (removing && selectedId === game.id) setSelectedId('explore');
  };
  const addCustomGame = event => {
    event.preventDefault();
    const title = newGameTitle.trim().slice(0, 48);
    if (!title) { setNotice('Enter a game title first.'); return; }
    const id = `custom-${Date.now()}`;
    const nextGame = { id, title, kind: 'custom', subtitle: 'Personal collection', description: 'A custom title in your Veylora game library.', art: 'art-custom', category: 'YOUR LIBRARY' };
    const nextCustom = [...customGames, nextGame];
    const nextOwned = [...new Set([...ownedIds, id])];
    try {
      localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(nextCustom.map(game => ({ id: game.id, title: game.title }))));
      localStorage.setItem(GAME_LIBRARY_KEY, JSON.stringify(nextOwned));
    } catch { setNotice('Could not save that game. Browser storage may be full.'); return; }
    setCustomGames(nextCustom); setOwnedIds(nextOwned); setNewGameTitle(''); setShowAddForm(false); setSelectedId(id); setTab('games'); setSearchOpen(false); setQuery(''); setNotice(`${title} added to Games.`);
  };

  return <section className={`window games-window ${maximized ? 'maximized' : ''} ${dragging ? 'is-dragging' : ''}`} style={!maximized ? { transform: `translate(calc(-50% + ${windowOffset.x}px), calc(-50% + ${windowOffset.y}px))` } : undefined} aria-label="Games">
    <header className="window-titlebar games-titlebar" onPointerDown={beginDrag}>
      <div className="window-controls">
        <button className="window-control close" aria-label="Close Games" onClick={onClose}><X size={12} /></button>
        <button className="window-control minimize" aria-label="Minimize Games" onClick={onMinimize}><Minus size={12} /></button>
        <button className="window-control maximize" aria-label="Toggle maximize" onClick={onToggleMaximize}><Square size={10} /></button>
      </div><span className="window-title">VEYLORA GAMES</span><span className="titlebar-spacer" />
    </header>
    {!entered ? <div className="games-welcome">
      <div className="games-welcome-grain" aria-hidden="true" /><div className="games-welcome-time">{time}</div>
      <div className="games-welcome-content"><span className="games-welcome-overline">VEYLORA GAMES</span><h1>Welcome back</h1><p>Who's playing today?</p>
        <button className="games-welcome-profile" onClick={enter}><Avatar avatar={profile.avatar} image={profile.image} /><span className="games-welcome-name">{profile.name}</span><span className="games-welcome-hint">Continue as player</span><ChevronRight size={18} /></button>
        <button className="games-welcome-options" onClick={openSettings}><Settings size={15} /> Profile options</button>
        <button className="games-welcome-enter" onClick={enter}><LogIn size={16} /> Continue <ChevronRight size={16} /></button>
      </div><div className="games-welcome-bottom"><span><Power size={14} /> LOCAL PROFILE</span><span>NO ACCOUNT REQUIRED</span></div>
      {settingsOpen && <div className="games-profile-editor welcome-editor"><ProfileEditor profile={profile} nameDraft={nameDraft} setNameDraft={setNameDraft} avatarDraft={avatarDraft} setAvatarDraft={setAvatarDraft} imageDraft={imageDraft} setImageDraft={setImageDraft} saveProfile={saveProfile} notice={notice} setNotice={setNotice} onDone={() => setSettingsOpen(false)} /></div>}
    </div> : <div className="games-shell">
      <div className="games-ambient" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <header className="games-topbar"><nav className="games-primary-nav" aria-label="Games sections">
        <button className={tab === 'games' ? 'is-active' : ''} onClick={() => chooseTab('games')}>Games</button>
        <button className={tab === 'library' ? 'is-active' : ''} onClick={() => chooseTab('library')}>Game Library</button>
      </nav><div className="games-wordmark" aria-label="Veylora Games"><span className="games-mark"><Gamepad2 size={26} strokeWidth={1.6} /></span><span>VEYLORA</span></div>
      <div className="games-top-actions">{searchOpen && <input className="games-search-input" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder={tab === 'games' ? 'Search your games' : 'Search game library'} aria-label="Search games" />}
        <button aria-label="Search" title="Search" className={searchOpen ? 'is-active' : ''} onClick={() => { setSearchOpen(value => !value); setQuery(''); }}><Search size={20} /></button>
        <button aria-label="Games settings" title="Profile settings" className={settingsOpen ? 'is-active' : ''} onClick={openSettings}><Settings size={21} /></button>
        <button aria-label="Profile" title={profile.name} className={profileOpen ? 'is-active games-profile' : 'games-profile'} onClick={openProfile}><Avatar avatar={profile.avatar} image={profile.image} small /><span className="games-online-dot" /></button><time>{time}</time>
      </div></header>
      {(settingsOpen || profileOpen) && <div className="games-popover">{settingsOpen ? <ProfileEditor profile={profile} nameDraft={nameDraft} setNameDraft={setNameDraft} avatarDraft={avatarDraft} setAvatarDraft={setAvatarDraft} imageDraft={imageDraft} setImageDraft={setImageDraft} saveProfile={saveProfile} notice={notice} setNotice={setNotice} onDone={() => setSettingsOpen(false)} /> : <><div className="games-popover-profile"><Avatar avatar={profile.avatar} image={profile.image} /><div><strong>{profile.name}</strong><span>Local player profile</span></div></div><p>Your profile is stored only in this browser. No account is needed.</p><button className="games-popover-action" onClick={() => { setProfileOpen(false); setNameDraft(profile.name); setAvatarDraft(profile.avatar); setImageDraft(profile.image || ''); setNotice(''); setSettingsOpen(true); }}><Pencil size={14} /> Edit profile <ChevronRight size={14} /></button><button className="games-popover-quiet" onClick={() => { setEntered(false); setProfileOpen(false); }}>Switch player screen</button></>}</div>}
      <main className={`games-content ${tab === 'library' ? 'game-library-mode' : ''}`}>
        {tab === 'games' ? <>
          <div className="games-section-head"><div><span className="games-kicker">YOUR COLLECTION</span><h2>Games</h2></div><span className="games-count">{ownedIds.length} TITLES</span></div>
          <div className="games-carousel" role="list" aria-label="Your games">{gameItems.map(game => <button key={game.id} role="listitem" className={`games-tile ${game.art} ${selectedId === game.id ? 'is-selected' : ''}`} onClick={() => setSelectedId(game.id)} aria-pressed={selectedId === game.id}><span className="games-tile-art"><CoverGlyph kind={game.kind} /></span><span className="games-tile-title">{game.title}</span>{selectedId === game.id && <span className="games-tile-indicator" />}</button>)}{!gameItems.length && <div className="games-empty">No games match that search. Open Game Library to add titles.</div>}</div>
          <section className="games-feature" aria-live="polite"><div className="games-feature-copy"><span className="games-eyebrow">{selected.category || 'YOUR LIBRARY'}</span><h1>{selected.title}</h1><p className="games-feature-subtitle">{selected.subtitle}</p><p className="games-feature-description">{selected.description}</p><div className="games-feature-actions"><button className="games-primary-action" onClick={() => { if (selected.id === 'explore') { chooseTab('library'); setSelectedId('explore'); } else setNotice(`${selected.title} selected.`); }}><Play size={14} fill="currentColor" /> {selected.id === 'explore' ? 'Browse games' : 'Select game'}</button><button className="games-secondary-action" onClick={() => chooseTab('library')}><Library size={15} /> Game Library</button></div>{notice && <span className="games-inline-notice" role="status">{notice}</span>}</div><div className={`games-feature-art ${selected.art}`} aria-hidden="true"><div className="games-feature-ring" /><div className="games-feature-symbol"><CoverGlyph kind={selected.kind} size={45} /></div><span className="games-feature-art-label">{selected.category}</span></div></section>
          <section className="games-lower-library"><div className="games-section-head compact"><div><span className="games-kicker">IN YOUR COLLECTION</span><h2>Recently added</h2></div><button className="games-text-button" onClick={() => chooseTab('library')}>Manage games <ChevronRight size={14} /></button></div><div className="games-recent-row">{allGames.filter(game => ownedIds.includes(game.id)).slice(0, 5).map(game => <button key={game.id} className="games-recent-card" onClick={() => setSelectedId(game.id)}><span className={`games-recent-art ${game.art}`}><CoverGlyph kind={game.kind} size={25} /></span><span><strong>{game.title}</strong><small>{game.subtitle}</small></span><ChevronRight size={15} /></button>)}{ownedIds.length === 0 && <button className="games-primary-action" onClick={() => chooseTab('library')}><Plus size={14} /> Add your first game</button>}</div></section>
        </> : <section className="games-game-library">
          <div className="games-library-intro"><div><span className="games-kicker">YOUR COLLECTION, YOUR CHOICE</span><h1>Game Library</h1><p>Add the games you want to show on the Games home screen. Your selection is saved on this device.</p></div><button className="games-primary-action games-add-custom-trigger" onClick={() => setShowAddForm(value => !value)}><Plus size={15} /> Add a game</button></div>
          {showAddForm && <form className="games-add-game-form" onSubmit={addCustomGame}><div><label htmlFor="games-custom-title">Game title</label><input id="games-custom-title" value={newGameTitle} onChange={event => setNewGameTitle(event.target.value)} maxLength={48} placeholder="Enter a game name" autoFocus /></div><button type="submit" className="games-primary-action"><Plus size={14} /> Add to Games</button><button type="button" className="games-form-cancel" onClick={() => { setShowAddForm(false); setNewGameTitle(''); }}>Cancel</button></form>}
          <div className="games-library-toolbar"><div className="games-library-filters" role="group" aria-label="Filter game library"><button className={libraryFilter === 'all' ? 'active' : ''} onClick={() => setLibraryFilter('all')}>All games <span>{allGames.length}</span></button><button className={libraryFilter === 'added' ? 'active' : ''} onClick={() => setLibraryFilter('added')}>In Games <span>{ownedIds.length}</span></button><button className={libraryFilter === 'not-added' ? 'active' : ''} onClick={() => setLibraryFilter('not-added')}>Not added <span>{allGames.length - allGames.filter(game => ownedIds.includes(game.id)).length}</span></button></div><span className="games-library-result-count">{catalogItems.length} RESULTS</span></div>
          <div className="games-catalog-grid">{catalogItems.map(game => { const isOwned = ownedIds.includes(game.id); return <article className={`games-catalog-card ${game.art}`} key={game.id}><button type="button" className={`games-catalog-cover ${game.art}`} onClick={() => { if (isOwned) { setTab('games'); setQuery(''); setSearchOpen(false); setSettingsOpen(false); setProfileOpen(false); setSelectedId(game.id); } else toggleOwned(game); }} aria-label={isOwned ? `View ${game.title} in Games` : `Add ${game.title} to Games`}><span className="games-catalog-symbol"><CoverGlyph kind={game.kind} size={31} /></span><span className="games-catalog-cover-title">{game.title}</span></button><div className="games-catalog-copy"><strong>{game.title}</strong><span>{game.subtitle}</span><small>{game.category || 'CUSTOM TITLE'}</small></div><button type="button" className={`games-catalog-toggle ${isOwned ? 'added' : ''}`} onClick={() => toggleOwned(game)}>{isOwned ? <><Check size={13} /> In Games</> : <><Plus size={13} /> Add to Games</>}</button></article>; })}</div>
          {!catalogItems.length && <div className="games-empty games-library-empty">No games found with this search and filter.</div>}
          {notice && <p className="games-library-notice" role="status">{notice}</p>}
        </section>}
        <footer className="games-footer"><span><span className="games-footer-dot" /> VEYLORA GAMES</span><span>{tab === 'games' ? 'Select a title to explore' : 'Manage the games shown on your home screen'}</span></footer>
      </main>
    </div>}
  </section>;
}
