import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import '@styles/settings.scss';
import '@/App.css';
import '@/index.css';
import Loader from '@components/Loader';
import { Github, Send } from 'lucide-react';

interface SystemSettings {
  username: string;
  bio: string;
  avatar_url: string;
  active_theme: string;
  board_style: string;
  is_verified: boolean;
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
  is_public: boolean;         
  show_rating: boolean;        
  two_factor_auth: boolean;  
  email_notifications: boolean; 
  confirm_moves: boolean;
show_coordinates: boolean;
auto_queen: boolean;
premove_enabled: boolean;
piece_animation_speed: string; 
}
const Settings: React.FC = () => {
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [config, setConfig] = useState<SystemSettings | null>(() => {
    const saved = localStorage.getItem('chess_settings_cache');
    return saved ? JSON.parse(saved) : null;
  });
  const [tempConfig, setTempConfig] = useState<SystemSettings | null>(config);
  const [loading, setLoading] = useState(!config);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data && !error) {
          const initialData: SystemSettings = {
            username: data.username || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || '',
            active_theme: data.active_theme || 'Chessview Classic',
            board_style: data.board_style || 'Neo-Chess',
            is_verified: data.is_verified || false,
            location: data.location || '',
            social_github: data.social_github || '',
            website_url: data.website_url || '',
            telegram_link: data.telegram_link || '',
            chess_com_username: data.chess_com_username || '',
            lichess_username: data.lichess_username || '',
            fide_id: data.fide_id || '',
            age: data.age || '',
            specialization: data.specialization || 'Tactician',
            preferred_opening: data.preferred_opening || '',
            play_style: data.play_style || '',
            coach_status: data.coach_status || false,
            achievements_showcase: data.achievements_showcase || '',
            neural_link_id: data.neural_link_id || '',
            system_rank: data.system_rank || 'Casual Player',
            is_public: data.is_public ?? true,
            show_rating: data.show_rating ?? true,
            two_factor_auth: data.two_factor_auth ?? false,
            email_notifications: data.email_notifications ?? true,
            confirm_moves: data.confirm_moves ?? true,
            show_coordinates: data.show_coordinates ?? true,
            auto_queen: data.auto_queen ?? true,
            premove_enabled: data.premove_enabled ?? true,
            piece_animation_speed: data.piece_animation_speed || 'normal',
          };

          setConfig(initialData);
          setTempConfig(initialData);
          localStorage.setItem('chess_settings_cache', JSON.stringify(initialData));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [navigate]);

const handleSaveAll = async () => {
  if (!tempConfig) return;
  
  setSaving(true);
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("User not found");

    const { error } = await supabase
      .from('profiles')
      .update({
        username: tempConfig.username,
        bio: tempConfig.bio,
        avatar_url: tempConfig.avatar_url,
        active_theme: tempConfig.active_theme,
        board_style: tempConfig.board_style,
        location: tempConfig.location,
        specialization: tempConfig.specialization,
        preferred_opening: tempConfig.preferred_opening,
        achievements_showcase: tempConfig.achievements_showcase,
        coach_status: tempConfig.coach_status,
        fide_id: tempConfig.fide_id,
        age: tempConfig.age,
        system_rank: tempConfig.system_rank,
        chess_com_username: tempConfig.chess_com_username,
        lichess_username: tempConfig.lichess_username,
        telegram_link: tempConfig.telegram_link,
        social_github: tempConfig.social_github,
        is_public: tempConfig.is_public,
        show_rating: tempConfig.show_rating,
        confirm_moves: tempConfig.confirm_moves,
        show_coordinates: tempConfig.show_coordinates,
        auto_queen: tempConfig.auto_queen,
        premove_enabled: tempConfig.premove_enabled,
        piece_animation_speed: tempConfig.piece_animation_speed,
      }) 
      .eq('id', session.user.id);

    if (error) throw error;
    
    setConfig(tempConfig); 
    localStorage.setItem('chess_settings_cache', JSON.stringify(tempConfig));
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); 

  } catch (err: any) {
    console.error("Save Error:", err);
  } finally {
    setSaving(false);
  }
};

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && tempConfig) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempConfig({ ...tempConfig, avatar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { 
      id: 'profile', 
      label: 'User Profile', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
    },
    { 
      id: 'visuals', 
      label: 'Appearance', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> 
    },
    { 
      id: 'security', 
      label: 'Privacy & Safety', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 
    },
    { 
      id: 'timing', 
      label: 'Game Settings', 
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
    },
  ];

  if (loading || !tempConfig) return <Loader />;

  return (
    <div className="settings-page">
      <div className="dashboard-root settings-view">
        <div className="anime-bg left-side"></div>
        <div className="anime-bg right-side"></div>

        <input type="file" ref={avatarInputRef} hidden accept="image/*" onChange={handleAvatarChange} />

      <aside className="panel-side side-left">
        <div className="brand-header" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo">♔</div>
          <div className="brand-name">Chessview</div>
        </div>

        <nav className="navigation-grid">
          <p className="group-label">Preferences</p>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`nav-item ${activeTab === cat.id ? 'active' : ''}`} 
              onClick={() => setActiveTab(cat.id)}
            >
              <span className="nav-icon">{cat.icon}</span> {cat.label}
            </button>
          ))}
        </nav>

       <div className="panel-footer-box">
  <button className="nav-item profile-link-btn" onClick={() => navigate('/profile')}>
    <span className="nav-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    </span> 
    ◀ Profile
  </button>

  <button className="nav-item back-btn" onClick={() => navigate('/dashboard')}>
    ◀ Dashboard
  </button>
</div>
      </aside>

      <main className="main-viewport settings-viewport">
        <div className="viewport-container">
          <div className="viewport-layout">
            
            {activeTab === 'profile' && (
              <div className="settings-section-fade">
                <h2 className="glitch-title">PROFILE DETAILS</h2>
                
                <div className="matrix-sub-card wide-profile">
                  <div className="avatar-container" onClick={() => avatarInputRef.current?.click()}>
                    <div className="identity-avatar large">
                      <img src={tempConfig.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tempConfig.username}`} alt="profile" />
                    </div>
                    <div className="edit-overlay">Change</div>
                    <p className="mini-label mt-10" style={{textAlign: 'center'}}>Change Photo</p>
                  </div>

                  <div className="profile-grid">
                    <div className="input-group">
                      <label className="mini-label">Display Name</label>
                      <input type="text" className="premium-input" value={tempConfig.username} onChange={(e) => setTempConfig({...tempConfig, username: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="mini-label">Location</label>
                      <input type="text" className="premium-input" value={tempConfig.location} placeholder="City, Country" onChange={(e) => setTempConfig({...tempConfig, location: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="mini-label">Age</label>
                      <input type="number" className="premium-input" value={tempConfig.age} onChange={(e) => setTempConfig({...tempConfig, age: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="mini-label">Rank</label>
                      <select 
                        className="premium-select" 
                        value={tempConfig.system_rank} 
                        onChange={(e) => setTempConfig({...tempConfig, system_rank: e.target.value})}
                      >
                        <option value="Casual Player">Casual Player</option>
                        <option value="Club Player">Club Player</option>
                        <option value="Candidate Master">Candidate Master</option>
                        <option value="FIDE Master">FIDE Master</option>
                        <option value="International Master">International Master</option>
                        <option value="Grandmaster">Grandmaster</option>
                        <option value="Certified Coach">Certified Coach</option>
                      </select>
                    </div>
                  </div>
                </div>

                
 <div className="input-group mt-20">
                  <label className="mini-label">Achievements & Bio</label>
                  <textarea className="premium-input bio-area" placeholder="Write about your chess journey..." value={tempConfig.achievements_showcase} onChange={(e) => setTempConfig({...tempConfig, achievements_showcase: e.target.value})} />
                </div>

                <h3 className="group-title">Chess Identity</h3>
                <div className="matrix-secondary-grid">
                  <div className="matrix-sub-card">
                    <label className="mini-label">FIDE ID</label>
                    <input type="text" className="premium-input" placeholder="00000000" value={tempConfig.fide_id} onChange={(e) => setTempConfig({...tempConfig, fide_id: e.target.value})} />
                  </div>
                  <div className="matrix-sub-card">
                    <label className="mini-label">Favorite openings</label>
                    <input type="text" className="premium-input" placeholder="e.g. Ruy Lopez" value={tempConfig.preferred_opening} onChange={(e) => setTempConfig({...tempConfig, preferred_opening: e.target.value})} />
                  </div>
                  <div className="matrix-sub-card">
                    <label className="mini-label">Play style</label>
                    <select className="premium-select" value={tempConfig.specialization} onChange={(e) => setTempConfig({...tempConfig, specialization: e.target.value})}>
                      <option value="Tactician">Tactician</option>
                      <option value="Positional">Positional</option>
                      <option value="Aggressive">Aggressive</option>
                      <option value="Endgame Expert">Endgame Expert</option>
                    </select>
                  </div>
                  <div className="matrix-sub-card">
                    <label className="mini-label">Account ID</label>
                    <input type="text" className="premium-input" value={tempConfig.neural_link_id} placeholder="Internal ID" onChange={(e) => setTempConfig({...tempConfig, neural_link_id: e.target.value})} />
                  </div>
                </div>

         <h3 className="group-title">Connected Accounts</h3>
<div className="matrix-secondary-grid">
  <div className="input-with-icon-row">
  <div className="pure-icon" title="Chess.com">
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#689f38" d="M28.001,19h-8.002c0,16.944-10,9.713-10,23c0,0,0.546,2,14.001,2c13.455,0,14.001-2,14.001-2 C38.001,28.713,28.001,35.944,28.001,19z"></path>
      <path fill="#33691e" d="M28.001,19h-8.002c0,1.127-0.047,2.141-0.13,3.067c1.869,0.18,5.76,0.63,5.76,3.765 C25.629,28.534,23.891,37.51,19,38c-4.461,0.447-8.273-1.094-8.273-1.094C10.272,38.18,9.999,39.81,9.999,42c0,0,0.546,2,14.001,2 c13.455,0,14.001-2,14.001-2C38.001,28.713,28.001,35.944,28.001,19z"></path>
      <path fill="#689f38" d="M26.02,14H24h-2.02c-1.986,1.334-3.972,2.668-5.957,4.001c0.03,0.428,0.113,0.997,0.332,1.634 c0.197,0.573,0.446,1.032,0.663,1.371l6.984-0.01l6.981,0.01c0.217-0.339,0.466-0.798,0.663-1.371 c0.219-0.637,0.302-1.206,0.332-1.634C29.992,16.668,28.006,15.334,26.02,14z"></path>
      <path fill="#33691e" d="M26,20.999l1.084,0.483l0.976-0.48l2.922,0.004c0.217-0.339,0.466-0.798,0.663-1.371 c0.219-0.637,0.302-1.206,0.332-1.634c-1.986-1.334-3.972-2.668-5.957-4.001H24l3,4L26,20.999z"></path>
      <circle cx="24" cy="10" r="7" fill="#689f38"></circle>
      <path fill="#33691e" d="M27.884,4.178c0.743,1.112,1.178,2.447,1.178,3.884c0,3.016-1.907,5.586-4.581,6.571l1.544,2.07 c0.435-0.131,1.04,0.059,1.434-0.15c0.361-0.191,0.515-0.775,0.835-1.024C29.94,14.249,31,12.248,31,10 C31,7.571,29.762,5.433,27.884,4.178z"></path>
      <path fill="#9ccc65" d="M24.683,4.727c0.372,0.973-0.526,2.556-2.006,3.536c-1.48,0.979-2.982,0.984-3.354,0.011 s0.526-2.556,2.006-3.536S24.31,3.753,24.683,4.727z"></path>
    </svg>
  </div>
  <input 
    type="text" 
    className="premium-input-transparent" 
    placeholder="Chess.com username" 
    value={tempConfig.chess_com_username} 
    onChange={(e) => setTempConfig({...tempConfig, chess_com_username: e.target.value})} 
  />
</div>

  <div className="input-with-icon-row">
    <div className="pure-icon" title="Lichess.org">
      <img src="../icons/lichess.svg" alt="Lichess.org" className="icon-lichess" style={{ width: '20px', height: '20px' }} />
    </div>
    <input 
      type="text" 
      className="premium-input-transparent" 
      placeholder="Lichess username" 
      value={tempConfig.lichess_username} 
      onChange={(e) => setTempConfig({...tempConfig, lichess_username: e.target.value})} 
    />
  </div>

  <div className="input-with-icon-row">
  <div className="pure-icon" title="Telegram">
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path>
      <path fill="#fff" d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"></path>
      <path fill="#b0bec5" d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"></path>
      <path fill="#cfd8dc" d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"></path>
    </svg>
  </div>
  <input 
    type="text" 
    className="premium-input-transparent" 
    placeholder="Telegram @username" 
    value={tempConfig.telegram_link} 
    onChange={(e) => setTempConfig({...tempConfig, telegram_link: e.target.value})} 
  />
</div>
  <div className="input-with-icon-row">
  <div className="pure-icon" title="GitHub">
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fill="currentColor" 
        d="M10,0 C15.523,0 20,4.59 20,10.253 C20,14.782 17.138,18.624 13.167,19.981 C12.66,20.082 12.48,19.762 12.48,19.489 C12.48,19.151 12.492,18.047 12.492,16.675 C12.492,15.719 12.172,15.095 11.813,14.777 C14.04,14.523 16.38,13.656 16.38,9.718 C16.38,8.598 15.992,7.684 15.35,6.966 C15.454,6.707 15.797,5.664 15.252,4.252 C15.252,4.252 14.414,3.977 12.505,5.303 C11.706,5.076 10.85,4.962 10,4.958 C9.15,4.962 8.295,5.076 7.497,5.303 C5.586,3.977 4.746,4.252 4.746,4.252 C4.203,5.664 4.546,6.707 4.649,6.966 C4.01,7.684 3.619,8.598 3.619,9.718 C3.619,13.646 5.954,14.526 8.175,14.785 C7.889,15.041 7.63,15.493 7.54,16.156 C6.97,16.418 5.522,16.871 4.63,15.304 C4.63,15.304 4.101,14.319 3.097,14.247 C3.097,14.247 2.122,14.234 3.029,14.87 C3.029,14.87 3.684,15.185 4.139,16.37 C4.139,16.37 4.726,18.2 7.508,17.58 C7.513,18.437 7.522,19.245 7.522,19.489 C7.522,19.76 7.338,20.077 6.839,19.982 C2.865,18.627 0,14.783 0,10.253 C0,4.59 4.478,0 10,0"
      />
    </svg>
  </div>
  <input 
    type="text" 
    className="premium-input-transparent" 
    placeholder="GitHub username" 
    value={tempConfig.social_github} 
    onChange={(e) => setTempConfig({...tempConfig, social_github: e.target.value})} 
  />
</div>
</div>

            <div className="matrix-sub-card coach-card-accent mt-30">
  <div className="setting-control-row">
    <div className="setting-visual-brief">
      <div className={`status-indicator-icon ${tempConfig.coach_status ? 'active' : ''}`}>
        <div className="icon-pulse-ring"></div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
      <div className="setting-text-stack">
        <span className="setting-main-label">Coach Status</span>
        <span className="setting-description">
          {tempConfig.coach_status 
            ? "Public: You are visible in the coaches directory" 
            : "Private: Your coaching profile is currently hidden"}
        </span>
      </div>
    </div>

    <div className="switch-wrapper">
      <label className="cyber-switch">
        <input 
          type="checkbox" 
          checked={tempConfig.coach_status} 
          onChange={(e) => setTempConfig({...tempConfig, coach_status: e.target.checked})} 
        />
        <span className="cyber-slider">
          <span className="slider-glitch-effect"></span>
        </span>
      </label>
    </div>
  </div>
</div>
</div>
            )}

            {activeTab === 'visuals' && (
              <div className="settings-section-fade">
                <h2 className="glitch-title">Appearance</h2>
                <div className="matrix-secondary-grid">
                  <div className="matrix-sub-card">
                    <span className="setting-label">Interface Theme</span>
                    <select 
                      className="premium-select" 
                      value={tempConfig.active_theme} 
                      onChange={(e) => setTempConfig({...tempConfig, active_theme: e.target.value})}
                    >
                      {['Chessview Light', 'Chessview Dark', 'Classic Wood', 'Night Mode'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="matrix-sub-card">
                    <span className="setting-label">Piece Style</span>
                    <select 
                      className="premium-select" 
                      value={tempConfig.board_style} 
                      onChange={(e) => setTempConfig({...tempConfig, board_style: e.target.value})}
                    >
                      {['Neo-Chess', 'Staunton', 'Minimalist', 'Alpha-Style'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
  <div className="settings-section-fade">
    <h2 className="glitch-title">PRIVACY & SAFETY</h2>
    
    <div className="matrix-column-grid">
      <div className="matrix-sub-card security-card">
        <div className="setting-control-row">
          <div className="setting-text-stack">
            <span className="setting-main-label">Public Profile</span>
            <span className="setting-description">Allow anyone to view your chess statistics and achievements.</span>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={tempConfig.is_public} 
              onChange={(e) => setTempConfig({...tempConfig, is_public: e.target.checked})} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>
      </div>

      <div className="matrix-sub-card security-card">
        <div className="setting-control-row">
          <div className="setting-text-stack">
            <span className="setting-main-label">Broadcast Rating</span>
            <span className="setting-description">Show your FIDE and local ratings in global leaderboards.</span>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={tempConfig.show_rating} 
              onChange={(e) => setTempConfig({...tempConfig, show_rating: e.target.checked})} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>
      </div>

      <div className="matrix-sub-card security-card highlighted">
        <div className="setting-control-row">
          <div className="setting-visual-brief">
            <div className={`status-indicator-icon ${tempConfig.two_factor_auth ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="setting-text-stack">
              <span className="setting-main-label">Two-Factor Authentication</span>
              <span className="setting-description">Secure your neural link with an additional verification layer.</span>
            </div>
          </div>
          <button className="config-trigger-btn small">Configure</button>
        </div>
      </div>

      <div className="danger-zone-box mt-30">
        <h4 className="danger-title">TERMINATE SESSION</h4>
        <p className="mini-label">This will wipe your local cache and log you out of the system.</p>
        <button className="danger-action-btn" onClick={() => supabase.auth.signOut().then(() => navigate('/login'))}>
          Log Out 
        </button>
      </div>
    </div>
  </div>
)}

{activeTab === 'timing' && (
  <div className="settings-section-fade">
    <h2 className="glitch-title">Game Engine</h2>

    <div className="matrix-column-grid">
      <div className="matrix-sub-card security-card">
        <div className="setting-control-row">
          <div className="setting-text-stack">
            <span className="setting-main-label">Confirm Every Move</span>
            <span className="setting-description">Adds a confirmation step before completing a move. Recommended for high-stakes matches.</span>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={tempConfig.confirm_moves} 
              onChange={(e) => setTempConfig({...tempConfig, confirm_moves: e.target.checked})} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>
      </div>

      <div className="matrix-sub-card security-card highlighted">
        <div className="setting-control-row">
          <div className="setting-text-stack">
            <span className="setting-main-label">Premove</span>
            <span className="setting-description">Enable the ability to make moves during your opponent's turn.</span>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={tempConfig.premove_enabled} 
              onChange={(e) => setTempConfig({...tempConfig, premove_enabled: e.target.checked})} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>
      </div>

      <div className="matrix-secondary-grid mt-20">
        <div className="matrix-sub-card">
          <label className="mini-label">Animation Speed</label>
          <select 
            className="premium-select" 
            value={tempConfig.piece_animation_speed}
            onChange={(e) => setTempConfig({...tempConfig, piece_animation_speed: e.target.value})}
          >
            <option value="Instant">Instant (No FX)</option>
            <option value="Fast">Fast</option>
            <option value="Normal">Normal</option>
            <option value="Slow">Cinematic</option>
          </select>
        </div>

        <div className="matrix-sub-card">
          <label className="mini-label">Board Coordinates</label>
          <select 
            className="premium-select" 
            value={tempConfig.show_coordinates ? "Show" : "Hide"}
            onChange={(e) => setTempConfig({...tempConfig, show_coordinates: e.target.value === "Show"})}
          >
            <option value="Show">Visible (A-H, 1-8)</option>
            <option value="Hide">Hidden (Blindfold)</option>
          </select>
        </div>
      </div>

      <div className="matrix-sub-card security-card mt-15">
        <div className="setting-control-row">
          <div className="setting-text-stack">
            <span className="setting-main-label">Automatic Queen Promotion</span>
            <span className="setting-description">Always promote to Queen when reaching the last rank to save time.</span>
          </div>
          <label className="cyber-switch">
            <input 
              type="checkbox" 
              checked={tempConfig.auto_queen} 
              onChange={(e) => setTempConfig({...tempConfig, auto_queen: e.target.checked})} 
            />
            <span className="cyber-slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
)}

            <div className="content-save-wrapper">
              <button 
                className={`save-registry-btn ${saving ? 'syncing' : ''}`}
                onClick={handleSaveAll}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>

          </div>
        </div>
      </main>
      {showToast && (
  <div className="settings-toast-container">
    <div className="settings-toast-content">
      <div className="toast-icon">✓</div>
      <div className="toast-text">
        <span className="toast-title">Updated</span>
        <span className="toast-sub">All changes saved</span>
      </div>
      <div className="toast-progress-bar"></div>
    </div>
  </div>
)}
</div>
    </div>
  );
};

export default Settings;