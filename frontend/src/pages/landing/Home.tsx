import React, { useState, useEffect, useCallback } from 'react'; 
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import '@styles/Home.scss';
import '@/App.css'; 
import '@/index.css';
import { 
  Github, 
  Send, 
  Twitter, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  LayoutDashboard, 
  LogOut, 
  UserCircle, 
  Settings,
  ChevronDown,
  Search,
  Zap,
  ShieldCheck,
  Trophy
} from 'lucide-react';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // --- States ---
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // --- Logic ---
  const fetchUserSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, rating')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchUserSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserSession();
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserSession]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('chess_profile');
    setUser(null);
    setProfile(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangModalOpen(false); 
  };

  return (
    <div className="home-page">
      <div className="top-loader"></div>

      <nav className="navbar">
        {/* --- Utility Bar --- */}
        <div className="nav-utility">
          <div className="utility-container">
            <div className="utility-left">
              <div className="system-status-item">
                <span className="ping-dot"></span>
                <span className="utility-text">{t('nav.live_players')}</span>
              </div>
              <div className="system-status-item">
                <span className="utility-label">{t('nav.latency')}</span>
                <span className="utility-value">1ms</span>
              </div>
            </div>

            <div className="utility-right">
              <a href="#market" className="utility-link">{t('nav.marketplace')}</a>
              <div className="token-stats" onClick={() => setIsTokenModalOpen(true)} style={{ cursor: 'pointer' }}>
                <span className="token-network-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#0052FF"/>
                  </svg>
                </span>
                <span className="token-value">$VENTIE</span>
                <span className="token-trend positive">Live</span>
              </div>
              <div className="lang-section">
                <button className="lang-trigger-btn" onClick={() => setIsLangModalOpen(true)}>
                  <Globe size={14} />
                  <span>{i18n.language.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Main Navigation Content --- */}
        <div className="nav-content">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon-wrapper"><div className="logo-shape"></div></div>
            <div className="logo-text">
              Chess<span className="logo-accent">View</span>
              <span className="startup-tag">StartUp v1.0.0</span>
            </div>
          </div>

          <div className="nav-main-wrapper">
            <div className="nav-links">
              {/* Mega Menu Item 1: Platform */}
              <div className="nav-item">
                <a href="#experience" className="nav-link">
                  {t('nav.platform')} <ChevronDown size={14} className="chevron" />
                </a>
                <div className="mega-menu">
                  <div className="mega-menu-content">
                    <div className="mega-column-info">
                      <span className="mega-tag">{t('mega_menu.core_engine')}</span>
                      <h2>{t('mega_menu.platform_title')}</h2>
                      <p>{t('mega_menu.platform_desc')}</p>
                      <button className="mega-btn">{t('mega_menu.explore_stack')}</button>
                    </div>
                    <div className="mega-column-links">
                      <h4>{t('mega_menu.modules_title')}</h4>
                      <div className="mega-grid">
                        <div className="mega-link-card">
                          <span className="icon"><Zap size={18} /></span>
                          <div>
                            <h5>{t('mega_menu.low_latency')}</h5>
                            <p>{t('mega_menu.low_latency_desc')}</p>
                          </div>
                        </div>
                        <div className="mega-link-card">
                          <span className="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                              <line x1="12" y1="18" x2="12.01" y2="18"/>
                            </svg>
                          </span>
                          <div>
                            <h5>{t('mega_menu.cross_platform')}</h5>
                            <p>{t('mega_menu.cross_platform_desc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mega Menu Item 2: Security */}
              <div className="nav-item">
                <a href="#tech" className="nav-link">
                  {t('nav.security')} <ChevronDown size={14} className="chevron" />
                </a>
                <div className="mega-menu">
                  <div className="mega-menu-content">
                    <div className="mega-column-info">
                      <span className="mega-tag">{t('mega_menu.shield')}</span>
                      <h2>{t('mega_menu.anti_trust_title')}</h2>
                      <p>{t('mega_menu.anti_trust_desc')}</p>
                      <button className="mega-btn">{t('mega_menu.security_report')}</button>
                    </div>
                    <div className="mega-column-links">
                      <h4>{t('mega_menu.tech_title')}</h4>
                      <div className="mega-grid">
                        <div className="mega-link-card">
                          <span className="icon"><ShieldCheck size={18} /></span>
                          <div>
                            <h5>{t('mega_menu.neural_guard')}</h5>
                            <p>{t('mega_menu.neural_guard_desc')}</p>
                          </div>
                        </div>
                        <div className="mega-link-card">
                          <span className="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          </span>
                          <div>
                            <h5>{t('mega_menu.data_privacy')}</h5>
                            <p>{t('mega_menu.data_privacy_desc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mega Menu Item 3: FIDE Sync */}
              <div className="nav-item">
                <a href="#fide" className="nav-link">
                  {t('nav.fide_sync')} <ChevronDown size={14} className="chevron" />
                </a>
                <div className="mega-menu">
                  <div className="mega-menu-content">
                    <div className="mega-column-info">
                      <span className="mega-tag">{t('mega_menu.official')}</span>
                      <h2>{t('mega_menu.global_id_title')}</h2>
                      <p>{t('mega_menu.global_id_desc')}</p>
                      <button className="mega-btn">{t('mega_menu.verify_now')}</button>
                    </div>
                    <div className="mega-column-links">
                      <h4>{t('mega_menu.features')}</h4>
                      <div className="mega-grid">
                        <div className="mega-link-card">
                          <span className="icon"><Trophy size={18} /></span>
                          <div>
                            <h5>{t('mega_menu.elo_int')}</h5>
                            <p>{t('mega_menu.elo_desc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-item">
                <a href="#tournaments" className="nav-link-simple">{t('nav.tournaments')}</a>
              </div>
            </div>
          </div>

          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="search-command-wrapper">
              <button className="btn-search-trigger">
                <Search size={16} />
                <span className="search-text">{t('nav.search')}</span>
              </button>
            </div>
            
            <div className="user-actions">
              {user ? (
                <div className="user-profile-nav">
                  <button 
                    className={`avatar-btn ${isUserMenuOpen ? 'active' : ''}`} 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="avatar-wrapper">
                      <img 
                        src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                        alt="Avatar" 
                        className="nav-avatar"
                        onError={(e) => {
                           (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile?.username || 'User'}&background=00D1FF&color=fff`;
                        }}
                      />
                      <div className="online-badge"></div>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <span className="user-name">{profile?.username || user.email.split('@')[0]}</span>
                        <span className="user-status">Online</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <UserCircle size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/register">
                  <button className="btn-join-premium">{t('nav.create_profile')}</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {isLangModalOpen && (
          <div className="modal-overlay" onClick={() => setIsLangModalOpen(false)}>
            <div className="lang-modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header-simple">
                <h3>{t('nav.select_language')}</h3>
                <button className="close-minimal" onClick={() => setIsLangModalOpen(false)}>&times;</button>
              </div>
              <div className="lang-list">
                {['en', 'ru'].map((lng) => (
                  <button 
                    key={lng}
                    className={`lang-option-btn ${i18n.language === lng ? 'active' : ''}`}
                    onClick={() => changeLanguage(lng)}
                  >
                    <span className="lang-flag">{lng.toUpperCase()}</span>
                    <span className="lang-label">{lng === 'en' ? 'English' : 'Русский'}</span>
                    {i18n.language === lng && <span className="active-dot"></span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="hero">
        <div className="hero-background-gradient"></div>
        <div className="hero-background-grid"></div>
        <div className="hero-glow-orb"></div>

        <div className="floating-sphere blue"></div>
        <div className="floating-sphere purple"></div>

        <div className="hero-content">
          <div className="status-badge-container">
            <div className="status-badge">
              <span className="dot pulse"></span>
              <span className="badge-text">Mvp</span>
            </div>
          </div>

          <h1 className="hero-title">
            {t('hero.title_part1')}<br />
            <span className="text-neon-glow">{t('hero.title_part2')}</span>
          </h1>

          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>

          <div className="hero-actions">
            <button className="btn-main-beta">
              <div className="btn-glow-container">
                <div className="btn-glow-item"></div>
              </div>
              <span className="btn-text">{t('hero.btn_beta')}</span>
              <span className="btn-shimmer-fast"></span>
            </button>

            <button className="btn-whitepaper-minimal">
              <span className="wp-icon">📄 {t('hero.btn_whitepaper')}</span>
            </button>

            <button className="btn-sitemap-minimal" onClick={() => setIsSitemapOpen(true)}>
              <span className="wp-icon">🗺️ {t('hero.btn_sitemap')}</span>
            </button>
          </div>
        </div>

       {isSitemapOpen && (
  <div className="sitemap-overlay" onClick={() => setIsSitemapOpen(false)}>
    <div className="sitemap-modal" onClick={(e) => e.stopPropagation()}>
      
      <div className="sitemap-header">
        <div className="sitemap-header-text">
          <h3 className="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            {t('sitemap.title')}
          </h3>
          <p className="modal-subtitle">{t('sitemap.subtitle')}</p>
        </div>
        <button className="close-modal" onClick={() => setIsSitemapOpen(false)} aria-label="Close">&times;</button>
      </div>

      <div className="sitemap-body">
        <div className="sitemap-node main-node">
          <span className="node-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </span>
          <a href="/" className="node-title">{t('sitemap.main_portal')}</a>
        </div>

        <div className="sitemap-tree">
          {[
            { id: 'exp', href: "#experience", title: 'sitemap.platform_engine', icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
            { id: 'tech', href: "#tech", title: 'sitemap.antitrust', icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
            { id: 'tour', href: "#tournaments", title: 'sitemap.tournaments', icon: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M12 22v-4m-7-2h14l-1-11H6l-1 11z" },
            { id: 'rank', href: "#rankings", title: 'sitemap.leaderboards', icon: "M18 20V10M12 20V4M6 20v-6" }
          ].map((item) => (
            <div className="tree-branch" key={item.id}>
              <div className="sitemap-node level-1">
                <span className="node-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                </span>
                <a href={item.href} className="node-title">{t(item.title)}</a>
              </div>
            </div>
          ))}
        </div>

        <div className="sitemap-divider"></div>
        <h4 className="subdomain-header">{t('sitemap.subdomains_title')}</h4>

        <div className="sitemap-tree-external">
          {[
            { url: "play.chessview.org", desc: 'sitemap.play_desc', icon: <><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4M8 10v4m7-1h.01M18 11h.01"/></> },
            { url: "id.chessview.org", desc: 'sitemap.id_desc', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
            { url: "market.chessview.org", desc: 'sitemap.market_desc', icon: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></> },
            { url: "labs.chessview.org", desc: 'sitemap.labs_desc', icon: <><path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3M6 14h12"/></> },
            { url: "docs.chessview.org", desc: 'sitemap.docs_desc', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
            { url: "status.chessview.org", desc: 'sitemap.status_desc', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> }
          ].map((item, idx) => (
            <div className="tree-branch-external" key={idx}>
              <div className="sitemap-node level-2 external-node">
                <span className="node-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                </span>
                <div className="node-info">
                  <a href={`https://${item.url}`} target="_blank" rel="noreferrer" className="node-title">
                    {item.url} <span className="arrow">↗</span>
                  </a>
                  <p className="node-desc">{t(item.desc)}</p>
                  <div className="status-pill">{t('sitemap.soon')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sitemap-footer">
        <p>{t('sitemap.footer')}</p>
      </div>
    </div>
  </div>
)}
        <div className="hero-scroll-indicator">
          <div className="mouse-icon">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">{t('hero.scroll')}</span>
        </div>
      </section>

      <section id="fide" className="profile-preview">
        <div className="container">
          <div className="profile-grid">
            <div className="profile-card-sample">
              <div className="card-header">
                <div className="avatar-wrapper">
                  <div className="online-indicator"></div>
                  <img src="/an8kk.jpg" alt="User" />
                </div>
                <div className="user-info">
                  <h3>An8kk <span className="badge-gm">TM</span></h3>
                  <p>{t('profile.verified_fide')} 1488 ELO</p>
                </div>
                <div className="staff-tag">CEO</div>
              </div>
              <div className="card-stats">
                <div className="mini-stat"><span>{t('profile.wins')}</span> 0k</div>
                <div className="mini-stat"><span>{t('profile.style')}</span> Stupid</div>
              </div>
            </div>
            
            <div className="profile-text">
              <div className="text-reveal-wrapper">
                <span className="section-tag glow-tag">{t('profile.identity_tag')}</span>
                <h2 className="gradient-title">{t('profile.title')}</h2>
              </div>
              
              <p className="description-text">
                {t('profile.desc')}
              </p>

              <div className="features-mini-list">
                <div className="feature-item">
                  <span className="dot-plus"></span>
                  <span>{t('profile.feature_bg')}</span>
                </div>
                <div className="feature-item">
                  <span className="dot-plus"></span>
                  <span>{t('profile.feature_borders')}</span>
                </div>
              </div>

              <div className="fide-sync-box adaptive-box">
                <div className="sync-icon-wrapper">
                  <div className="sync-pulse"></div>
                </div>
                <div className="sync-content">
                  <h4>{t('profile.sync_title')}</h4>
                  <p>{t('profile.sync_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="presence-custom mini-variant">
        <div className="container">
          <div className="presence-grid-compact">
            <div className="custom-card-mini">
              <div className="card-inner-glow"></div>
              
              <div className="webcam-mini-wrap">
                <div className="webcam-ui-overlay">
                  <div className="status-badge-micro">
                    <span className="dot pulse-red"></span> LIVE
                  </div>
                  <div className="user-tag-micro">AN8KK_CEO</div>
                </div>
                
                <img src="/an8kk.jpg" alt="Webcam" />
                
                <div className="audio-bars-mini">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="a-bar-small"></div>
                  ))}
                </div>
              </div>
              
              <div className="settings-compact">
                <div className="s-row">
                  <span className="s-label">{t('presence.aura')}</span>
                  <div className="s-dots">
                    <div className="dot-opt active blue"></div>
                    <div className="dot-opt red"></div>
                    <div className="dot-opt green"></div>
                  </div>
                </div>
                
                <div className="s-row">
                  <span className="s-label">{t('presence.ambient')}</span>
                  <div className="mini-progress-bar">
                    <div className="progress-fill" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="presence-content-slim">
              <span className="section-tag-small">{t('presence.tag')}</span>
              <h2 className="title-slim">{t('presence.title_part1')} <br/>{t('presence.title_part2')}</h2>
              <p className="description-slim">
                {t('presence.desc')}
              </p>

           <div className="features-mini-grid">
  <div className="f-mini-item">
    <span className="f-icon-s">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    </span>
    <div>
      <h6>{t('presence.voice')}</h6>
      <p>{t('presence.voice_desc')}</p>
    </div>
  </div>
  <div className="f-mini-item">
    <span className="f-icon-s">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.688-1.688h1.944c3.105 0 5.594-2.489 5.594-5.594C22 5.375 17.25 2 12 2Z"/>
      </svg>
    </span>
    <div>
      <h6>{t('presence.skins')}</h6>
      <p>{t('presence.skins_desc')}</p>
    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tech" className="tech-modern">
        <div className="container">
          <div className="section-heading">
            <span className="section-subtitle">{t('tech.tag')}</span>
            <h2>{t('tech.title')}</h2>
            <p>{t('tech.desc')}</p>
          </div>

      <div className="bento-grid">
  {[
    { id: 1, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', badge: t('tech.bento_defense'), title: t('tech.bento_antitrust_title'), desc: t('tech.bento_antitrust_desc') },
    { id: 2, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000', title: t('tech.bento_edge_title'), desc: t('tech.bento_edge_desc') },
    { id: 3, img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop', title: t('tech.bento_ascend_title'), desc: t('tech.bento_ascend_desc') },
    { id: 4, img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000', title: t('tech.bento_global_title'), desc: t('tech.bento_global_desc') }
  ].map((item) => (
    <div key={item.id} className="bento-item" style={{ backgroundImage: `url(${item.img})` }}>
      <div className="bento-overlay"></div>
      <div className="bento-content">
        {item.badge && <div className="bento-badge">{item.badge}</div>}
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
    </div>
  ))}
</div>
          </div>
      </section>

      <section className="private-clubs">
        <div className="container">
          <div className="clubs-layout">
            <div className="clubs-content">
              <span className="section-tag">{t('clubs.tag')}</span>
              <h2 className="gradient-title">{t('clubs.title')}</h2>
              <p className="description-text">
                {t('clubs.desc')}
              </p>
              
              <ul className="clubs-features">
                <li>
                  <span className="check-icon"></span>
                  <div>
                    <strong>{t('clubs.feature_interiors')}</strong>
                    <p>{t('clubs.feature_interiors_desc')}</p>
                  </div>
                </li>
                <li>
                  <span className="check-icon"></span>
                  <div>
                    <strong>{t('clubs.feature_voice')}</strong>
                    <p>{t('clubs.feature_voice_desc')}</p>
                  </div>
                </li>
                <li>
                  <span className="check-icon"></span>
                  <div>
                    <strong>{t('clubs.feature_hierarchy')}</strong>
                    <p>{t('clubs.feature_hierarchy_desc')}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="clubs-visual">
              <div className="club-card-stack">
                <div className="club-card-preview main-card">
                  <div className="club-image-placeholder">
                    <img src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=2070&auto=format&fit=crop" alt="Club Atmosphere" />
                  </div>
                  <div className="club-info">
                    <h4>Base</h4>
                    <p>52 {t('clubs.members')} • {t('clubs.private')}</p>
                    <div className="member-avatars">
                      <div className="mini-avatar"></div>
                      <div className="mini-avatar"></div>
                      <div className="mini-avatar"></div>
                      <div className="more">+12</div>
                    </div>
                  </div>
                </div>
                <div className="club-card-preview back-card"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    <section className="roadmap-section">
  <div className="container">
    <div className="section-heading">
      <span className="section-subtitle">{t('roadmap.tag')}</span>
      <h2 className="gradient-title">{t('roadmap.title')}</h2>
      <p>{t('roadmap.desc')}</p>
    </div>

    <div className="roadmap-grid">
      <div className="roadmap-card active">
        <div className="roadmap-status">{t('roadmap.phase1_status')}</div>
        <div className="roadmap-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <h4>{t('roadmap.phase1_title')}</h4>
        <p>{t('roadmap.phase1_desc')}</p>
        <ul className="roadmap-list">
          <li>{t('roadmap.phase1_item1')}</li>
          <li>{t('roadmap.phase1_item2')}</li>
          <li>{t('roadmap.phase1_item3')}</li>
        </ul>
      </div>

      <div className="roadmap-card upcoming">
        <div className="roadmap-status">{t('roadmap.phase2_status')}</div>
        <div className="roadmap-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h4>{t('roadmap.phase2_title')}</h4>
        <p>{t('roadmap.phase2_desc')}</p>
        <ul className="roadmap-list">
          <li>{t('roadmap.phase2_item1')}</li>
          <li>{t('roadmap.phase2_item2')}</li>
          <li>{t('roadmap.phase2_item3')}</li>
        </ul>
      </div>
      <div className="roadmap-card upcoming">
        <div className="roadmap-status">{t('roadmap.phase3_status')}</div>
        <div className="roadmap-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        </div>
        <h4>{t('roadmap.phase3_title')}</h4>
        <p>{t('roadmap.phase3_desc')}</p>
        <ul className="roadmap-list">
          <li>{t('roadmap.phase3_item1')}</li>
          <li>{t('roadmap.phase3_item2')}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

      <section id="community-hub" className="trace-discord-section">
        <div className="trace-container">
          <div className="trace-visual">
            <div className="discord-circle">
              <svg viewBox="0 0 127.14 96.36" width="160" height="160" fill="white">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.06,72.06,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.87,56.6.19,80.21a105.73,105.73,0,0,0,32.17,16.15,77.7,77.7,0,0,0,6.89-11.11,68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.72-27.31-4.82-51.1-19.34-72.14ZM42.45,65.69c-6.22,0-11.38-5.71-11.38-12.73s5-12.73,11.38-12.73,11.44,5.71,11.44,12.73S48.67,65.69,42.45,65.69Zm42.24,0c-6.22,0-11.38-5.71-11.38-12.73s5-12.73,11.38-12.73,11.44,5.71,11.44,12.73S84.69,65.69,84.69,65.69Z"/>
              </svg>
            </div>
          </div>
          <div className="trace-content">
            <h2 className="trace-title">{t('discord.title')}</h2>
            <h3 className="trace-subtitle">
              {t('discord.subtitle')}
            </h3>
            <p className="trace-text">
              {t('discord.text')}
            </p>
            <div className="trace-status">
              <span className="status-count" id="discord-online-count">0</span> {t('discord.online')}
            </div>
            <a href="https://discord.gg/4KA39UEEc4" className="trace-btn" target="_blank" rel="noreferrer">
              {t('discord.btn')}
            </a>
          </div>
        </div>
      </section>

    <footer className="footer-pro">
  <div className="footer-blur-effect"></div>
  <div className="container">
    <div className="footer-top">
      <div className="footer-brand-huge">
        <div className="logo">Chess<span className="logo-accent">View</span></div>
        <p className="footer-description">
          {t('footer.desc')}
        </p>
      <div className="footer-socials">
  <a href="https://discord.gg/4KA39UEEc4" className="social-link" aria-label="Discord">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
       <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  </a>
  <a href="#" className="social-link" aria-label="X (Twitter)">
    <Twitter size={20} />
  </a>
  <a href="https://t.me/ChessView" className="social-link" aria-label="Telegram">
    <Send size={20} />
  </a>
  <a href="https://github.com/VentieRavelle/ChessView" className="social-link" aria-label="GitHub">
    <Github size={20} />
  </a>
</div>
      </div>

      <div className="footer-links-grid">
        <div className="footer-col">
          <h4>{t('footer.product')}</h4>
          <a href="#">{t('footer.game_server')}</a>
          <a href="#">{t('footer.anti_trust')}</a>
          <a href="#">{t('footer.analysis')}</a>
          <a href="#">{t('footer.mobile')}</a>
        </div>
        <div className="footer-col">
          <h4>{t('footer.ecosystem')}</h4>
          <a href="#">{t('footer.communities')}</a>
          <a href="#">{t('footer.tournaments')}</a>
          <a href="#">{t('footer.rankings')}</a>
          <a href="#">{t('footer.api')}</a>
        </div>
        <div className="footer-col">
          <h4>{t('footer.startup')}</h4>
          <a href="#">{t('footer.investors')}</a>
          <a href="#">{t('footer.grants')}</a>
          <a href="#">{t('footer.careers')}</a>
          <a href="#">{t('footer.whitepaper')}</a>
        </div>
      </div>

      <div className="footer-newsletter">
        <h4>{t('footer.newsletter_title')}</h4>
        <p>{t('footer.newsletter_desc')}</p>
        <div className="newsletter-form">
          <input type="email" placeholder={t('footer.newsletter_placeholder')} />
          <button className="btn-subscribe">→</button>
        </div>
        <div className="system-status">
          <span className="status-dot green"></span>
          {t('footer.status_operational')}
        </div>
      </div>
    </div>

    <div className="footer-divider"></div>

    <div className="footer-bottom">
      <div className="footer-legal">
        <a href="#">{t('footer.privacy')}</a>
        <a href="#">{t('footer.terms')}</a>
        <a href="#">{t('footer.cookies')}</a>
      </div>
      <p className="footer-copy">
        {t('footer.copy')} <br />
        {t('footer.designed_by')}
      </p>
      <div className="footer-lang">
        <span>{t('footer.lang')}</span>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;