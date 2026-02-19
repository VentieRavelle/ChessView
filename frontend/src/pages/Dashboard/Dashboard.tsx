import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import '@styles/dashboard.scss';
import '@/App.css'; 
import '@/index.css';
import Loader from '@components/Loader';
import GameLoader from '@components/GameLoader'; 
import GameModal from '@components/GameModal'; 
import CreateFriendGameModal from '@components/CreateFriendGameModal'; 
import UsersSearch from '@pages/Profile/UsersSearch'; 
import { useMatchmaking } from '@/hooks/useMatchmaking';

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(() => {
    const saved = localStorage.getItem('chess_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!profile);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('blitz');
  const [isSearching, setIsSearching] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [searchSession, setSearchSession] = useState(0); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [uiState, setUiState] = useState({ left: true, right: true });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const matchmaking = useMatchmaking(
    isSearching && userId 
      ? `ws://localhost:8080/ws?userId=${userId}&s=${searchSession}` 
      : ''
  );
const { status, gameStarted, matchData } = matchmaking as any;

useEffect(() => {
  if (gameStarted && matchData) {
    const playerColor = matchData.color || 'white'; 
    navigate(`/game/${selectedMode}?color=${playerColor}`, { 
      state: { matchData } 
    });
  }
}, [gameStarted, matchData, navigate, selectedMode]);

  const fetchUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const uid = session.user.id;
      setUserId(uid);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, rating, rating_blitz, rating_rapid')
        .eq('id', uid)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        localStorage.setItem('chess_profile', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };
  const handleCreateFriendGame = (config: any) => {
    const gameId = Math.random().toString(36).substring(2, 10);
    console.log("Saving game config:", config);
    setShowFriendModal(false);
    navigate(`/waiting/${gameId}`); 
  };

  if (loading) return <Loader />;

  if (showModeModal) {
    return (
      <GameModal 
        onClose={() => setShowModeModal(false)} 
        onSelect={(mode) => {
          setSelectedMode(mode); 
          setShowModeModal(false);
          setSearchSession(Date.now());
          setIsSearching(true);
        }} 
      />
    );
  }

  if (isSearching) {
    return <GameLoader onCancel={() => setIsSearching(false)} />;
  }

  return (
    <div className="db-content">
      {showFriendModal && (
        <CreateFriendGameModal 
          onClose={() => setShowFriendModal(false)} 
          onCreate={handleCreateFriendGame} 
        />
      )}

      <div 
        className={`db-shell ${uiState.left ? 'l-on' : 'l-off'} ${uiState.right ? 'r-on' : 'r-off'}`}
        onMouseMove={handleMouseMove}
        style={{ '--m-x': `${mouse.x}px`, '--m-y': `${mouse.y}px` } as any}
      >
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
              {isSearchOpen && <UsersSearch onClose={() => setIsSearchOpen(false)} />}
              
              <button className="nav-tile" onClick={() => navigate('/tournaments')}>
                <SVG.Tournament /> <span className="tile-label">Leagues</span>
              </button>
              
              <button className="nav-tile" onClick={() => navigate('/analysis')}>
                <SVG.Analysis /> <span className="tile-label">Analysis</span>
              </button>
              
              <button className="nav-tile" onClick={() => navigate('/settings')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span className="tile-label">Settings</span>
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

        <main className="viewport">
          <div className="content-wrap">
            <header className="v-header">
              <div className="header-meta">
                <h1 className="display-title">Control Panel</h1>
                <div className="system-badges">
                  <div className="badge status-online">
                    <span className="dot"></span> Server:is Working
                  </div>
                  <div className="badge-group">
                    <div className="mini-stat">
                      <span className="stat-label">Blitz</span>
                      <span className="stat-value">{profile?.rating_blitz || 1200}</span>
                    </div>
                    <div className="mini-stat">
                      <span className="stat-label">Rapid</span>
                      <span className="stat-value">{profile?.rating_rapid || 1200}</span>
                    </div>
                    <div className="mini-stat">
                      <span className="stat-label">Bullet</span>
                      <span className="stat-value">{profile?.rating_bullet || 1200}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="dashboard-grid">
              <div className="main-column">
                <section className="hero-section">
                  <div className="main-action-card primary" onClick={() => setShowModeModal(true)}>
                    <div className="card-body">
                      <span className="tag">Play now</span>
                      <h2>Find the game</h2>
                      <p>Find opponent in One click</p>
                      
                      <button className="base-button">Start the game</button>
                      
                      <button className="friend-button" onClick={(e) => {
                        e.stopPropagation(); 
                        setShowFriendModal(true);
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Play with friends
                      </button>
                    </div>
                  </div>

                  <div className="sub-actions-grid">
                    <div className="action-tile clickable" onClick={() => navigate('/training')}>
                      <div className="tile-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
                      <div className="tile-info">
                        <h3>Tasks</h3>
                        <p>Solve the studies</p>
                      </div>
                    </div>
                    <div className="action-tile clickable" onClick={() => navigate('/analysis')}>
                      <div className="tile-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 8v8"/></svg></div>
                      <div className="tile-info">
                        <h3>Analyse</h3>
                        <p>Game review</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="recent-games">
                  <div className="section-header">
                    <h3>Last games</h3>
                    <button className="text-link" onClick={() => navigate('/history')}>Show all</button>
                  </div>
                  <div className="games-list">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="game-item">
                        <div className="game-status win">Win</div>
                        <div className="game-opponent">
                          <span className="opp-name">Anek</span>
                          <span className="opp-rating">1488</span>
                        </div>
                        <div className="game-meta">+52 MMR • 5 min ago</div>
                        <button className="analyze-btn-small">Analyze</button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="side-column">
                <div className="info-card tournaments-card">
                  <div className="card-header">
                    <h4>Current tournaments</h4>
                  </div>
                  <div className="tournament-item">
                    <div className="t-time">18:00</div>
                    <div className="t-info">
                      <span>Tournament</span>
                      <small>0 members</small>
                    </div>
                  </div>
                  <button className="secondary-button full-width" onClick={() => navigate('/tournaments')}>All tournaments</button>
                </div>

                <div className="info-card stats-summary">
                  <h4>Sunday progress</h4>
                  <div className="progress-row">
                    <span>Games played</span>
                    <span className="val">0</span>
                  </div>
                  <div className="progress-row">
                    <span>Win percentage</span>
                    <span className="val text-green">0%</span>
                  </div>
                  <div className="mini-chart-placeholder">
                    <div className="bar" style={{height: '40%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                    <div className="bar" style={{height: '50%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className={`side-panel right-panel ${uiState.right ? 'r-on' : 'r-off'}`}>
          <button className="collapse-trigger right" onClick={() => setUiState(s => ({...s, right: !s.right}))}>
            {uiState.right ? '›' : '‹'}
          </button>
          <div className="panel-content">
            <div className="nav-brand-mini">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d1ff" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <div className="brand-info">
                <span className="brand-title">HELP CENTER</span>
                <span className="system-ver">COMMUNITY & SUPPORT</span>
              </div>
            </div>
            
            <div className="nav-grid-minimal">
              <button className="nav-tile" onClick={() => navigate('/support')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="tile-label">Get Help</span>
              </button>
              <button className="nav-tile" onClick={() => navigate('/community')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="tile-label">Social Media</span>
              </button>
            </div>

            <div className="minimal-user-anchor">
              <div className="user-bar static">
                <div className="avatar-wrapper sys"><div className="sys-dot"></div></div>
                <div className="bar-meta">
                  <span className="bar-name">Server Status</span>
                  <span className="bar-status cyan">Online • Stable</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;