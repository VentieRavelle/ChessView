import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import Loader from '@components/Loader';
import UsersSearch from '../Profile/UsersSearch'; 
import '@styles/dashboard.scss';
import '@styles/clubs.scss';

const SVG = {
  Logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="20" height="20" rx="4" stroke="url(#logoGradient)" strokeWidth="2.5"/>
      <path d="M16 10V22M10 16H22" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00D1FF" />
          <stop offset="1" stopColor="#0075FF" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Sword: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.5 17.5L3 6V3H6L17.5 14.5M14.5 17.5L13 19L10 16L11.5 14.5M14.5 17.5L19 22L22 19L17.5 14.5M17.5 14.5L16 13L19 10L20.5 11.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Analysis: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" strokeLinecap="round"/>
      <path d="M12 7V12L15 15" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="6" r="3" stroke="currentColor"/>
    </svg>
  ),
  Tournament: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 9H4.5C3.11929 9 2 7.88071 2 6.5C2 5.11929 3.11929 4 4.5 4H6M18 9H19.5C20.8807 9 22 7.88071 22 6.5C22 5.11929 20.8807 4 19.5 4H18M18 2H6V12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12V2Z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18V22M7 22H17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

const CreateClubModal = ({ onClose, onSuccess }: any) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('club-assets')
      .upload(filePath, file);

    if (!uploadError) {
      const { data } = supabase.storage.from('club-assets').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (name.length < 3 || tag.length < 2) return alert("Please fill in the data correctly");
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc('create_club_with_owner', {
      club_name: name.trim(),
      club_tag: tag.trim().toUpperCase(),
      club_icon: avatarUrl || '🛡️',
      owner_id: user.id,
      club_banner: banner.trim() || null
    });

    if (error) alert(error.message);
    else { onSuccess(); onClose(); }
    setLoading(false);
  };

  return (
    <div className="gamemodal-page">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-premium club-create-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-glow"></div>
          <button className="modal-close-icon" onClick={onClose}>×</button>
          
          <div className="modal-header-clean">
            <h2>Create Club</h2>
            <p>Create a community</p>
          </div>

          <div className="modal-body">
            <div className="club-card-preview">
              <div className="preview-banner" style={{ backgroundImage: banner ? `url(${banner})` : 'none' }}>
                <div className="preview-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                  {avatarUrl ? <img src={avatarUrl} alt="Club Logo" /> : <div className="avatar-placeholder">+</div>}
                </div>
              </div>
              <div className="preview-info">
                <span className="p-tag">{tag ? `[${tag.toUpperCase()}]` : '[TAG]'}</span>
                <span className="p-name">{name || 'Club Name'}</span>
              </div>
            </div>

            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />

            <div className="input-row">
              <div className="input-group-premium">
                <label>Club Name</label>
                <input type="text" placeholder="Например: Royal" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="input-group-premium short">
                <label>Tag</label>
                <input type="text" maxLength={4} placeholder="TAG" value={tag} onChange={(e) => setTag(e.target.value)} />
              </div>
            </div>

            <div className="input-group-premium">
              <label>Icon URL</label>
              <input type="text" placeholder="https://..." value={banner} onChange={(e) => setBanner(e.target.value)} />
            </div>

            <button className="base-button primary full-width create-btn" onClick={handleCreate} disabled={loading}>
              {loading ? 'Registering...' : 'Register Club'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Clubs = () => {
  const navigate = useNavigate();
  const [uiState, setUiState] = useState({ left: true, right: true });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [view, setView] = useState<'browse' | 'manage'>('browse');
  const [manageTab, setManageTab] = useState<'members' | 'settings'>('members');
  const [profile] = useState(() => JSON.parse(localStorage.getItem('chess_profile') || '{}'));
  const [clubs, setClubs] = useState<any[]>(() => JSON.parse(localStorage.getItem('chess_clubs_list') || '[]'));
  const [myClub, setMyClub] = useState<any>(() => JSON.parse(localStorage.getItem('chess_my_club') || 'null'));
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(clubs.length === 0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', tag: '', banner_url: '', icon_emoji: '' });
  const init = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return navigate('/login');
    const [clubsRes, membershipRes] = await Promise.all([
      supabase.from('clubs').select('*, club_members(count)').order('level', { ascending: false }),
      supabase.from('club_members').select('*, clubs(*)').eq('user_id', session.user.id).maybeSingle()
    ]);
    if (clubsRes.data) {
      setClubs(clubsRes.data);
      localStorage.setItem('chess_clubs_list', JSON.stringify(clubsRes.data));
    }
    if (membershipRes.data) {
      const club = membershipRes.data.clubs;
      setMyClub(club);
      setEditData({ 
        name: club.name, 
        tag: club.tag, 
        banner_url: club.banner_url || '', 
        icon_emoji: club.icon_emoji 
      });
      localStorage.setItem('chess_my_club', JSON.stringify(club));
      const { data: mems } = await supabase
        .from('club_members')
        .select('*, profiles(username, rating, avatar_url)')
        .eq('club_id', club.id)
        .order('rank_name');
      if (mems) setMembers(mems);
      setView('manage'); 
    } else {
      setMyClub(null);
      setView('browse');
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => { init(); }, [init]);

  const handleUpdateClub = async () => {
    const { error } = await supabase.from('clubs').update({
      name: editData.name,
      tag: editData.tag.toUpperCase(),
      banner_url: editData.banner_url,
      icon_emoji: editData.icon_emoji
    }).eq('id', myClub.id);

    if (error) alert(error.message);
    else { alert('Settings saved!'); init(); }
  };

  const handleDeleteClub = async () => {
    if (!window.confirm("Delete? All members will be excluded.")) return;
    const { error } = await supabase.from('clubs').delete().eq('id', myClub.id);
    if (error) alert(error.message);
    else {
      localStorage.removeItem('chess_my_club');
      window.location.reload();
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="db-content clubs-page">
      {showCreateModal && <CreateClubModal onClose={() => setShowCreateModal(false)} onSuccess={init} />}
      
      <div className={`db-shell ${uiState.left ? 'l-on' : 'l-off'}`}>
        <div className="bg-fx"></div>

        <aside className={`side-panel left-panel ${uiState.left ? 'l-on' : 'l-off'}`}>
          <button className="collapse-trigger left" onClick={() => setUiState(s => ({...s, left: !s.left}))}>
            {uiState.left ? '‹' : '›'}
          </button>
          <div className="panel-content">
            <div className="nav-brand-mini" onClick={() => navigate('/dashboard')}>
              <SVG.Logo />
              <div className="brand-info">
                <span className="brand-title">ChessView</span>
                <span className="system-ver">v1.0.0</span>
              </div>
            </div>

            <nav className="nav-grid-minimal">
              <button className={`nav-tile ${window.location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
                <SVG.Sword /> <span className="tile-label">Dashboard</span>
              </button>
              <button className={`nav-tile ${window.location.pathname === '/clubs' ? 'active' : ''}`} onClick={() => navigate('/clubs')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="tile-label">Clubs</span>
              </button>
              <button className={`nav-tile ${window.location.pathname === '/friends' ? 'active' : ''}`} onClick={() => navigate('/friends')}>
                <div className="tile-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span className="online-indicator-dot"></span>
                </div>
                <span className="tile-label">Friends</span>
              </button>
              <button className={`nav-tile ${window.location.pathname === '/shop' ? 'active' : ''}`} onClick={() => navigate('/shop')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span className="tile-label">Market</span>
              </button>
              <button className={`nav-tile ${isSearchOpen ? 'active' : ''}`} onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span className="tile-label">Search</span>
              </button>
              <button className="nav-tile" onClick={() => navigate('/tournaments')}>
                <SVG.Tournament /> <span className="tile-label">Leagues</span>
              </button>
              <button className="nav-tile" onClick={() => navigate('/analysis')}>
                <SVG.Analysis /> <span className="tile-label">Analysis</span>
              </button>
            </nav>

            <div className="minimal-user-anchor">
              <div className="user-bar-compact" onClick={() => navigate('/profile')}>
                <div className="avatar-container"> 
                  <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} className="bar-avatar" alt="User" />
                </div>
                <div className="profile-arrow-mini">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="viewport club-viewport">
          <div className="content-wrap full-width">
            <header className="v-header club-header">
              <div className="header-meta">
                <div className="title-area">
                  <h1 className="display-title">{view === 'browse' ? 'Global Clubs' : 'Syndicate'}</h1>
                  <p className="subtitle">Join the best or create your own</p>
                </div>
                <div className="view-switcher-premium">
                  <button className={view === 'browse' ? 'active' : ''} onClick={() => setView('browse')}>Club Ranking</button>
                  {myClub && <button className={view === 'manage' ? 'active' : ''} onClick={() => setView('manage')}>My Club</button>}
                  {!myClub && <button className="cta-button" onClick={() => setShowCreateModal(true)}>Create Club</button>}
                </div>
              </div>
            </header>

            <div className="club-main-container">
              {view === 'browse' ? (
                <div className="clubs-ranking-list">
                  <div className="list-header">
                    <span># Club</span>
                    <span>Rank</span>
                    <span>Members</span>
                    <span>Action</span>
                  </div>
                  {clubs.map((club, index) => (
                    <div key={club.id} className="club-row-card">
                      <div className="club-main-info">
                        <span className="rank-num">{index + 1}</span>
                        <div className="club-logo-mini">
                          {club.icon_emoji?.startsWith('http') ? <img src={club.icon_emoji} alt="" /> : club.icon_emoji}
                        </div>
                        <div className="club-text">
                          <span className="name">{club.name}</span>
                          <span className="tag">[{club.tag}]</span>
                        </div>
                      </div>
                      <div className="club-level-cell">
                        <div className="lvl-badge">Level {club.level}</div>
                      </div>
                      <div className="club-members-cell">
                        {club.club_members?.[0]?.count || 0} / 50
                      </div>
                      <div className="club-action-cell">
                        <button className="base-button ghost-sm">Info</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="my-club-workspace">
                  <div className="club-hero-card-v2" style={{ backgroundImage: `url(${myClub?.banner_url || 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071'})` }}>
                    <div className="hero-overlay"></div>
                    <div className="hero-content-inner">
                      <div className="hero-emoji-v2">
                        {myClub?.icon_emoji?.startsWith('http') ? <img src={myClub.icon_emoji} alt="" className="hero-img-icon" /> : myClub?.icon_emoji}
                      </div>
                      <div className="hero-text-v2">
                        <span className="hero-tag">[{myClub?.tag}]</span>
                        <h2>{myClub?.name}</h2>
                        <div className="hero-stats-mini">
                          <span>Level {myClub?.level}</span> • <span>{members.length} Members</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="club-manage-tabs">
                    <button className={manageTab === 'members' ? 'active' : ''} onClick={() => setManageTab('members')}>Участники</button>
                    <button className={manageTab === 'settings' ? 'active' : ''} onClick={() => setManageTab('settings')}>Настройки</button>
                  </div>

                  <div className="club-grid-layout">
                    {manageTab === 'members' ? (
                      <div className="members-section-full">
                        <div className="members-table-premium">
                          {members.map((m, i) => (
                            <div key={i} className="member-row-card">
                              <img src={m.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.profiles?.username}`} alt="" />
                              <div className="m-info">
                                <span className="m-name">{m.profiles?.username}</span>
                                <span className="m-rank">{m.rank_name}</span>
                              </div>
                              <div className="m-rating">{m.profiles?.rating} MMR</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="settings-section-premium">
                        <div className="settings-form">
                          <div className="input-group-premium">
                            <label>Club Name</label>
                            <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                          </div>
                          <div className="input-group-premium">
                            <label>Tag (4 characters)</label>
                            <input type="text" maxLength={4} value={editData.tag} onChange={e => setEditData({...editData, tag: e.target.value})} />
                          </div>
                          <div className="input-group-premium">
                            <label>Background Image URL</label>
                            <input type="text" placeholder="https://image-url.com/img.jpg" value={editData.banner_url} onChange={e => setEditData({...editData, banner_url: e.target.value})} />
                          </div>
                          <div className="settings-footer">
                            <button className="base-button primary" onClick={handleUpdateClub}>Save All</button>
                            <button className="base-button danger ghost" onClick={handleDeleteClub}>Delete Club</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {isSearchOpen && <UsersSearch onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
};

export default Clubs;