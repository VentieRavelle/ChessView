import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import '@styles/profile.scss';
import '@/App.css';

import Loader from '@components/Loader';

interface ProfileData {
  id: string;
  username: string;
  avatar_url: string;
  banner_url: string;
  banner_zoom?: number;
  tag: string;
  fide_rating: number;
  fide_title: string;
  is_verified: boolean;
  is_staff: boolean;
  is_pro: boolean;
  suspicion_score: number;
  bio: string;
  joined_date: string;
  rating_rapid: number;
  rating_blitz: number;
  rating_bullet: number;
  stat_winrate: string;
  stat_rank: string;
  stat_intuition: string;
  stat_creativity: string;
  stat_accuracy: string;
  credits: number;
  active_theme: string;
  board_style: string;
  location: string;
  social_github: string;
  website_url: string;
  telegram_link: string;
  chess_com_username: string;
  lichess_username: string;
  fide_id: string;
  age: string;
  specialization: string;
  preferred_opening: string;
  play_style: string;
  coach_status: boolean;
  achievements_showcase: string;
  neural_link_id: string;
  system_rank: string;
}
const Profile = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isModer, setIsModer] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ProfileData>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [uploadType, setUploadType] = useState<'avatar_url' | 'banner_url' | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ProfileData | null>(() => {
    const saved = localStorage.getItem('full_profile_cache');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!user);
  const updateRoleStates = (rank: string) => {
    const normalizedRank = (rank || '').toLowerCase();
    setIsOwner(normalizedRank === 'owner');
    setIsAdmin(normalizedRank === 'admin' || normalizedRank === 'administrator');
    setIsModer(normalizedRank === 'moder' || normalizedRank === 'moderator');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate('/login');
          return;
        }

        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const newProfile = {
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'NewPlayer',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            rating_blitz: 1200,
            rating_rapid: 1200,
            rating_bullet: 1200,
            joined_date: new Date().toISOString(),
            system_rank: 'Casual Player'
          };

          const { data: created, error: cErr } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();
          
          if (cErr) throw cErr;
          data = created;
        }

        if (data) {
          const profile = data as ProfileData;
          setUser(profile);
          updateRoleStates(profile.system_rank);
          localStorage.setItem('full_profile_cache', JSON.stringify(profile));
        }
      } catch (err) {
        console.error("Profile loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const updateProfileField = async (updatedFields: Partial<ProfileData>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedFields)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser(prev => {
        if (!prev) return null;
        const newUser = { ...prev, ...updatedFields };
        if (updatedFields.system_rank) {
          updateRoleStates(updatedFields.system_rank);
        }
        return newUser;
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: 'avatar_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setUploadType(type);
        setZoom(1);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);   
      e.target.value = ''; 
    }
  };

  const handleSaveCropped = async () => {
    if (tempImage && uploadType) {
      try {
        const updateData: Partial<ProfileData> = { [uploadType]: tempImage };
        if (uploadType === 'banner_url') {
          updateData.banner_zoom = zoom;
        }
        await updateProfileField(updateData);
        setIsModalOpen(false);
        setTempImage(null);
      } catch (err) {
        console.error("Image saving error:", err);
        alert("Failed to save image. Please try again.");
      }
    }
  };

  if (loading) return <Loader />;
  if (!user) return <div className="system-loader">ERROR: ACCESS DENIED</div>;

  return (
    <div className='profile-page'>
      <div className="dashboard-root profile-view scrollable-page">
        <div className="ambient-glow"></div>

        <input type="file" ref={avatarInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar_url')} />
        <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'banner_url')} />

        <button className="back-to-dash-btn" onClick={() => navigate('/dashboard')}>
          <span className="arrow-icon">←</span>
          <span className="back-text">Dashboard</span>
        </button>

        <section className="profile-hero-section">
          <div
            className="profile-banner"
            onClick={() => bannerInputRef.current?.click()}
            style={{
              backgroundImage: user.banner_url ? `url(${user.banner_url})` : 'none',
              backgroundSize: user.banner_url ? `${100 * (user.banner_zoom || 1)}%` : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              cursor: 'pointer',
              backgroundColor: '#0a0a0a',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="banner-visual-fx"></div>
            <div className="banner-grid-overlay"></div>
            <div className="banner-edit-hint">Click to update system banner</div>
          </div>

          <div className="profile-identity-bar">
            <div className="avatar-container" onClick={() => avatarInputRef.current?.click()}>
              <div className="avatar-frame animated-neon-border">
                <img src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt="Avatar" className="main-avatar-img" />
                <div className="pro-status-badge">
                  {isOwner ? 'SYSTEM OWNER' : isAdmin ? 'ADMINISTRATOR' : isModer ? 'MODERATOR' : (user.system_rank || (user.is_pro ? 'PREMIUM' : 'PLAYER'))}
                </div>
              </div>
            </div>

            <div className="identity-meta">
              <div className="identity-top-row">
                {isEditing ? (
                  <input 
                    className="edit-input-username"
                    value={editForm.username ?? user.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  />
                ) : (
                  <div className="username-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h1 className="display-username">{user.username}</h1>
                    {user.is_verified && (
                      <div className="verification-glyph" title="Verified User">
                       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"></polygon><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"></polygon>
</svg>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="badge-cloud">
                  {isOwner && (
                    <div className="badge-wrapper">
                      <span className="system-badge owner">OWNER</span>
                      <div className="tooltip-portal">
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            <span className="role-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L19 7V17L12 22L5 17V7L12 2Z"/><polyline points="12 22 12 12 19 7"/><polyline points="12 12 5 7"/></svg>
                            </span>
                            <strong>System Owner</strong>
                          </div>
                          <p className="tooltip-desc">Full root access and core infrastructure management authority.</p>
                          <a href="https://docs.chessview.org/roles" target="_blank" rel="noreferrer" className="tooltip-link">
                            Documentation <span className="arrow">→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="badge-wrapper">
                      <span className="system-badge admin">ADMIN</span>
                      <div className="tooltip-portal">
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            <span className="role-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </span>
                            <strong>Administrator</strong>
                          </div>
                          <p className="tooltip-desc">User management, system configuration and global policy control.</p>
                          <a href="https://docs.chessview.org/roles" target="_blank" rel="noreferrer" className="tooltip-link">
                            Documentation <span className="arrow">→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {isModer && (
                    <div className="badge-wrapper">
                      <span className="system-badge moder">MODER</span>
                      <div className="tooltip-portal">
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            <span className="role-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            </span>
                            <strong>Moderator</strong>
                          </div>
                          <p className="tooltip-desc">Community integrity, fair play monitoring and dispute resolution.</p>
                          <a href="https://docs.chessview.org/roles" target="_blank" rel="noreferrer" className="tooltip-link">
                            Moderator Guide <span className="arrow">→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {user.is_staff && (
                    <div className="badge-wrapper">
                      <span className="system-badge staff">STAFF</span>
                      <div className="tooltip-portal">
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            <span className="role-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                            </span>
                            <strong>Staff Member</strong>
                          </div>
                          <p className="tooltip-desc">Verified ChessView employee. Core development and support team.</p>
                          <a href="https://docs.chessview.org/about" target="_blank" rel="noreferrer" className="tooltip-link">
                            Our Team <span className="arrow">→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {user.fide_title && (
                    <div className="badge-wrapper">
                      <span className="system-badge title-fide">{user.fide_title}</span>
                      <div className="tooltip-portal">
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            <span className="role-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                            </span>
                            <strong>FIDE Title</strong>
                          </div>
                          <p className="tooltip-desc">Official rank confirmed via international chess federation database.</p>
                          {user.fide_id && (
                            <a href={`https://ratings.fide.com/profile/${user.fide_id}`} target="_blank" rel="noreferrer" className="tooltip-link">
                              FIDE Profile <span className="arrow">→</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {user.fide_rating > 0 && (
                    <div className="badge-wrapper">
                      <span className="system-badge verified-fide">FIDE {user.fide_rating}</span>
                      <div className="tooltip-portal">
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            <span className="role-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            </span>
                            <strong>Verified Rating</strong>
                          </div>
                          <p className="tooltip-desc">Global FIDE rating. Synchronized with the official registry.</p>
                          <span className="sync-status">Status: Active</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="user-status-bio">
                {isEditing ? (
                  <div className="edit-bio-group">
                    <input 
                      placeholder="Location"
                      value={editForm.location ?? user.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    />
                    <input 
                      placeholder="Age"
                      type="number"
                      value={editForm.age ?? user.age}
                      onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    />
                    <textarea 
                      placeholder="Your bio..."
                      value={editForm.bio ?? user.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    />
                    <div className="edit-actions">
                      <button className="save-mini-btn" onClick={async () => {
                        await updateProfileField(editForm);
                        setIsEditing(false);
                      }}>SAVE SYSTEM DATA</button>
                      <button className="cancel-mini-btn" onClick={() => setIsEditing(false)}>ABORT</button>
                    </div>
                  </div>
                ) : (
                  <p>
                    📍 {user.location || 'Unknown Location'} • {user.age || '??'} y.o. <br />
                    {user.bio || "No bio record found."}
                  </p>
                )}
              </div>
            </div>

            <div className="quick-access-metrics">
              <div className="metric-box rapid">
                <div className="metric-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" opacity="0.3" />
                    <polyline points="12 7 12 12 15 15" />
                  </svg>
                </div>
                <div className="metric-data">
                  <span className="label">RAPID</span>
                  <span className="value">{user.rating_rapid}</span>
                </div>
              </div>
              <div className="metric-box blitz">
                <div className="metric-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 512 512">
    <g>
      <polygon fill="#FAC917" points="320.557,215.066 203.181,512 246.321,215.066" />
      <polygon fill="#FAC917" points="351.806,0 234.43,296.934 160.194,296.934 203.339,0" />
    </g>
  </svg>
                </div>
                <div className="metric-data">
                  <span className="label">BLITZ</span>
                  <span className="value">{user.rating_blitz}</span>
                </div>
              </div>
       <div className="metric-box bullet">
  <div className="metric-icon-wrap">
    <svg 
      viewBox="0 0 512 512" 
      width="20" 
      height="20" 
      className="bullet-svg-icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M495.212,16.785c-44.125-44.141-188.297,5.875-250.078,67.656S61.79,267.8,61.79,267.8l182.406,182.407 c0,0,121.563-121.579,183.359-183.36C489.321,205.082,539.337,60.91,495.212,16.785z"/>
        <polygon points="0.009,329.597 182.399,512.004 217.712,476.691 35.306,294.285"/>
      </g>
    </svg>
  </div>
  <div className="metric-data">
    <span className="label">BULLET</span>
    <span className="value">{user.rating_bullet}</span>
  </div>
</div>
</div>
            
            <button className="config-trigger-btn" onClick={() => navigate('/settings')} style={{ marginLeft: '10px' }}>
              Edit Profile
            </button>
          </div>
        </section>

        <div className="profile-layout-grid">
          <aside className="profile-aside-panel">
            <div className="matrix-card">
              <h3>Chess Identity</h3>
              <div className="detail-row"><span>Spec:</span><b>{user.specialization}</b></div>
              <div className="detail-row"><span>Opening:</span><b>{user.preferred_opening || 'N/A'}</b></div>
              <div className="detail-row"><span>Style:</span><b>{user.play_style || 'Universal'}</b></div>
              <div className="detail-row"><span>FIDE ID:</span><b>{user.fide_id || 'None'}</b></div>
            </div>

            <div className="matrix-card">
              <h3>Networks</h3>
              <div className="detail-row">
                <span>Lichess:</span>
                {user.lichess_username ? (
                  <a href={`https://lichess.org/@/${user.lichess_username}`} target="_blank" rel="noreferrer" className="pill link">
                    {user.lichess_username}
                  </a>
                ) : <b className="pill">---</b>}
              </div>

              <div className="detail-row">
                <span>Chess.com:</span>
                {user.chess_com_username ? (
                  <a href={`https://www.chess.com/member/${user.chess_com_username}`} target="_blank" rel="noreferrer" className="pill link">
                    {user.chess_com_username}
                  </a>
                ) : <b className="pill">---</b>}
              </div>

              <div className="detail-row">
                <span>Telegram:</span>
                {user.telegram_link ? (
                  <a href={`https://t.me/${user.telegram_link.replace('@', '')}`} target="_blank" rel="noreferrer" className="pill link">
                    {user.telegram_link.startsWith('@') ? user.telegram_link : `@${user.telegram_link}`}
                  </a>
                ) : <b className="pill">---</b>}
              </div>

              <div className="detail-row">
                <span>GitHub:</span>
                {user.social_github ? (
                  <a href={`https://github.com/${user.social_github}`} target="_blank" rel="noreferrer" className="pill link">
                    {user.social_github}
                  </a>
                ) : <b className="pill">---</b>}
              </div>
            </div>

            <div className="matrix-card wallet-card">
              <h3>System Storage</h3>
              <div className="vault-stats">
                <div className="vault-item"><span>Credits:</span><b>💎 {user.credits}</b></div>
                <div className="vault-item"><span>Theme:</span><b>{user.active_theme}</b></div>
                <div className="vault-item"><span>Board:</span><b>{user.board_style}</b></div>
              </div>
            </div>
          </aside>

          <main className="profile-main-content">
            <nav className="content-tabs-nav">
              {[
                { id: 'overview', label: 'OVERVIEW' },
                { id: 'achievements', label: 'ACHIEVEMENTS' },
                { id: 'security', label: 'SECURITY' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`nav-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="tab-render-area">
              {(() => {
                switch (activeTab) {
                  case 'overview':
                    return (
                      <div className="tab-pane-fade-in overview-pane">
                        <div className="stats-expanded-grid">
                          <div className="stat-card-detailed">
                            <div className="det-header">INTUITION</div>
                            <div className="value-large">{user.stat_intuition || '0%'}</div>
                          </div>
                          <div className="stat-card-detailed">
                            <div className="det-header">ACCURACY</div>
                            <div className="value-large">{user.stat_accuracy || '0%'}</div>
                          </div>
                          <div className="stat-card-detailed">
                            <div className="det-header">WINRATE</div>
                            <div className="value-large">{user.stat_winrate || '0%'}</div>
                          </div>
                        </div>

                        <div className="matrix-card" style={{ marginTop: '20px' }}>
                          <h3>SYSTEM STATUS</h3>
                          <p style={{ color: '#888', lineHeight: '1.6' }}>
                            User {user.username} is currently active in the network. 
                            All biometric and chess metrics are synchronized.
                          </p>
                        </div>
                      </div>
                    );

                  case 'achievements':
                    return (
                      <div className="tab-pane-fade-in">
                        <div className="matrix-card">
                          <h3>ACHIEVEMENTS SHOWCASE</h3>
                          <div className="achievements-list" style={{ marginTop: '15px' }}>
                            {user.achievements_showcase ? (
                              <div className="achievement-item active">
                                <p style={{ color: '#00f2ff' }}>{user.achievements_showcase}</p>
                              </div>
                            ) : (
                              <p style={{ color: '#555', textAlign: 'center', padding: '20px' }}>
                                NO DATA RECOVERED
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );

                  case 'security':
                    return (
                      <div className="tab-pane-fade-in">
                        <div className="matrix-card">
                          <h3>TECHNICAL DOSSIER</h3>
                          <div className="detail-row">
                            <span>Neural Link ID:</span>
                            <b style={{ color: '#22d3ee', fontFamily: 'monospace' }}>
                              {user.neural_link_id || 'UNLINKED'}
                            </b>
                          </div>
                          <div className="detail-row">
                            <span>System Rank:</span>
                            <b style={{ textTransform: 'uppercase' }}>
                              {isOwner ? 'OWNER' : isAdmin ? 'ADMINISTRATOR' : isModer ? 'MODERATOR' : user.system_rank}
                            </b>
                          </div>
                          <div className="detail-row">
                            <span>Integrity Score:</span>
                            <b style={{ color: user.suspicion_score > 50 ? '#ff4e4e' : '#4ade80' }}>
                              {user.suspicion_score} / 100
                            </b>
                          </div>
                          <div className="detail-row">
                            <span>Registration:</span>
                            <b>{new Date(user.joined_date).toLocaleDateString()}</b>
                          </div>
                        </div>
                      </div>
                    );

                  default:
                    return null;
                }
              })()}
            </div>
          </main>
        </div>

        <footer className="profile-footer-data">
          <div className="footer-left">ChessView Core • {user.website_url || 'chessview.app'}</div>
          <div className="footer-right">OPERATIVE_ID: {user.id.slice(0, 12).toUpperCase()}</div>
        </footer>

        {isModalOpen && (
          <div className="image-editor-modal" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>ADJUST {uploadType === 'avatar_url' ? 'AVATAR' : 'BANNER'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
              </div>

              <div className="preview-container">
                <div className={`image-preview-mask ${uploadType === 'avatar_url' ? 'circle' : 'rect'}`}>
                  <img
                    src={tempImage || ''}
                    alt="Preview"
                    style={{ transform: `scale(${zoom})`, transition: 'transform 0.1s ease' }}
                  />
                </div>
              </div>

              <div className="editor-controls">
                <div className="zoom-slider">
                  <span>-</span>
                  <input
                    type="range"
                    min="1" max="3" step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                  />
                  <span>+</span>
                </div>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                  <button className="save-btn" onClick={handleSaveCropped}>APPLY CHANGES</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;