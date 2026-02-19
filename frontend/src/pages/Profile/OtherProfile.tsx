import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import '@styles/OtherProfile.scss';
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

const OtherProfile = () => {
  const { userId } = useParams(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [currentAuthId, setCurrentAuthId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOtherProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            setCurrentAuthId(authUser.id);
            if (authUser.id === userId) {
                navigate('/profile');
                return;
            }
        }

        if (!userId) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setUser(null);
        } else {
          setUser(data as ProfileData);
        }

      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherProfile();
  }, [userId, navigate]);

  if (loading) return <Loader />;
  if (!user) return <div className="system-loader">ERROR: USER_NOT_FOUND_IN_DATABASE</div>;

  return (
    <div className='otherprofile-page'>
    <div className="dashboard-root profile-view scrollable-page">
      <div className="ambient-glow"></div>
      <button className="back-to-dash-btn" onClick={() => navigate(-1)}>
        <span className="arrow-icon">←</span>
        <span className="back-text">GO BACK</span>
      </button>

      <section className="profile-hero-section">
        <div
          className="profile-banner"
          style={{
            backgroundImage: user.banner_url ? `url(${user.banner_url})` : 'none',
            backgroundSize: user.banner_url ? `${100 * (user.banner_zoom || 1)}%` : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default' 
          }}
        >
          <div className="banner-visual-fx"></div>
          <div className="banner-grid-overlay"></div>
        </div>

        <div className="profile-identity-bar">
          <div className="avatar-container">
            <div className="avatar-frame animated-neon-border" style={{ cursor: 'default' }}>
              <img src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt="Avatar" className="main-avatar-img" />
              <div className="pro-status-badge">{user.system_rank || (user.is_pro ? 'PREMIUM' : 'PLAYER')}</div>
            </div>
            {user.is_verified && <div className="verification-glyph">✓</div>}
          </div>

          <div className="identity-meta">
            <div className="identity-top-row">
              <h1 className="display-username">{user.username}</h1>
              <div className="badge-cloud">
                {user.is_staff && <span className="system-badge staff">STAFF</span>}
                <span className="system-badge title-fide">{user.fide_title || 'NM'}</span>
                <span className="system-badge verified-fide">FIDE {user.fide_rating || 0}</span>
              </div>
            </div>

            <div className="user-status-bio">
              <p>
                📍 {user.location || 'Unknown Location'} • {user.age || '??'} y.o. <br />
                {user.bio || "No bio record found."}
              </p>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#eab308" fillOpacity="0.2" />
                    </svg>
                </div>
                <div className="metric-data">
                    <span className="label">BLITZ</span>
                    <span className="value">{user?.rating_blitz}</span>
                </div>
            </div>
            <div className="metric-box bullet">
  <div className="metric-icon-wrap">
    <svg 
      viewBox="-400 -150 1000 1000" 
      width="20" 
      height="20" 
      fill="#eab308"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M0 0 C13.28365548 12.26582267 26.0114687 25.1094874 38.79296875 37.89306641 C42.15464557 41.25484626 45.52324067 44.60960558 48.89347649 47.96280193 C51.50650791 50.5647403 54.11500764 53.17118499 56.72223282 55.7789402 C57.96377284 57.01930314 59.20692792 58.25805174 60.45174789 59.49512291 C62.1786645 61.21226153 63.89915454 62.93559525 65.61816406 64.66064453 C66.12817963 65.16504059 66.63819519 65.66943665 67.16366577 66.18911743 C71.12541104 70.18639691 72.90652956 72.41036952 72.93505859 78.08764648 C71.97162732 84.91810928 68.65318593 90.90925111 65.60302734 97.01342773 C65.28940247 97.65065765 64.97577759 98.28788757 64.65264893 98.94442749 C53.40337631 121.79475802 39.71085233 142.07790567 22.91552734 161.20092773 C22.04798828 162.1922168 21.18044922 163.18350586 20.28662109 164.20483398 C16.06492275 168.94215961 11.79927676 173.40858355 6.93505859 177.48608398 C5.54617663 178.66542476 4.1904447 179.88457709 2.86474609 181.13452148 C-16.87224758 199.71252071 -51.57600582 226.00556048 -79.08056641 229.59155273 C-85.61949558 228.74123685 -90.16982238 223.40198552 -94.62133789 218.90698242 C-95.55675919 217.97440865 -95.55675919 217.97440865 -96.51107788 217.022995 C-98.55998439 214.97777603 -100.60162763 212.92547354 -102.64306641 210.87280273 C-104.07467219 209.44000341 -105.50664941 208.00757514 -106.9389801 206.57550049 C-109.93695803 203.57596093 -112.93155545 200.57310082 -115.92358398 197.56762695 C-119.74245908 193.73180118 -123.56784428 189.90255154 -127.39558315 186.07557297 C-130.35313312 183.11774982 -133.30805985 180.15731761 -136.26213264 177.19602203 C-137.670828 175.78416311 -139.08011341 174.37289265 -140.49001884 172.96224213 C-154.12840054 159.30876136 -154.12840054 159.30876136 -160.08447266 152.20092773 C-160.99522831 151.16660693 -161.90795023 150.13401375 -162.82275391 149.10327148 C-192.1076415 115.37454662 -207.85623185 72.59373912 -204.81103516 27.75952148 C-203.35706413 9.9554118 -199.16929887 -7.39615941 -192.08447266 -23.79907227 C-191.75447266 -24.62922852 -191.42447266 -25.45938477 -191.08447266 -26.31469727 C-187.30808949 -34.04448157 -178.39969601 -36.87666399 -170.77050781 -39.63598633 C-109.14311999 -60.73050946 -47.13817753 -43.01438004 0 0 Z" 
        transform="translate(247, 90)" 
      />
      <path d="M0 0 C4.21433217 2.52053215 7.63968936 5.3888109 11.10514832 8.85118103 ..." transform="translate(240, 333)" />
      <path d="M0 0 C7.19690081 5.14452082 13.27863703 12.10375102 19.54077148 18.33203125 ..." transform="translate(345, 228)" />
      <path d="M0 0 C5.86471653 3.27215711 10.30505672 8.01598546 15.01171875 12.74609375 ..." transform="translate(339, 327)" />
      <path d="M0 0 C7.21073194 4.17457976 13.00339889 10.70461707 18.8125 16.5625 ..." transform="translate(432, 420)" />
    </svg>
  </div>
  <div className="metric-data">
    <span className="label">BULLET</span>
    <span className="value">{user.rating_bullet}</span>
  </div>
</div>
</div>
         <div className="action-buttons-group" style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
    <button className="friend-request-btn" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      background: 'rgba(34, 211, 238, 0.1)',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      color: '#22d3ee',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
      Add Friend
    </button>

    {/* Кнопка Challenge */}
    <button className="config-trigger-btn" style={{ 
      padding: '8px 20px',
      borderRadius: '8px',
      background: 'var(--accent)', 
      color: '#000',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}>
      Challenge
    </button>
  </div>
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
            <div className="detail-row"><span>Lichess:</span><b className="pill">{user.lichess_username || '---'}</b></div>
            <div className="detail-row"><span>Chess.com:</span><b className="pill">{user.chess_com_username || '---'}</b></div>
            <div className="detail-row"><span>Telegram:</span><b className="pill">{user.telegram_link || '---'}</b></div>
            <div className="detail-row"><span>GitHub:</span><b className="pill">{user.social_github || '---'}</b></div>
          </div>
        </aside>

        <main className="profile-main-content">
          <nav className="content-tabs-nav">
            {['overview', 'achievements', 'security'].map(tabId => (
              <button
                key={tabId}
                className={`nav-tab-item ${activeTab === tabId ? 'active' : ''}`}
                onClick={() => setActiveTab(tabId)}
              >
                {tabId.toUpperCase()}
              </button>
            ))}
          </nav>

          <div className="tab-render-area">
            {activeTab === 'overview' && (
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
                  <h3>ACHIEVEMENTS SHOWCASE</h3>
                  <p style={{ color: '#888', lineHeight: '1.6' }}>{user.achievements_showcase || "No achievements recorded yet."}</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-pane-fade-in">
                <div className="matrix-card">
                  <h3>TECHNICAL DOSSIER</h3>
                  <div className="detail-row"><span>Neural Link ID:</span><b>{user.neural_link_id || 'UNLINKED'}</b></div>
                  <div className="detail-row"><span>System Rank:</span><b>{user.system_rank}</b></div>
                  <div className="detail-row"><span>Integrity Score:</span><b>{user.suspicion_score}</b></div>
                  <div className="detail-row"><span>Joined:</span><b>{new Date(user.joined_date).toLocaleDateString()}</b></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="profile-footer-data">
        <div className="footer-left">ChessView Core • {user.website_url || 'chessview.app'}</div>
        <div className="footer-right">OPERATIVE_ID: {user.id.slice(0, 12).toUpperCase()}</div>
      </footer>
    </div>
    </div>
  );
};

export default OtherProfile;