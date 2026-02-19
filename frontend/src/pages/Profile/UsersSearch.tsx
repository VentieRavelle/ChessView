import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { Search, ChevronRight, Activity, X, Zap, Clock } from 'lucide-react';
import '@styles/UsersSearch.scss';
import '@/App.css'; 
import '@/index.css';

interface UsersSearchProps {
  onClose: () => void;
}

export default function UsersSearch({ onClose }: UsersSearchProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) performSearch();
      else setResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const performSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, rating_blitz, rating_rapid')
      .ilike('username', `%${search}%`)
      .limit(8);

    if (!error) setResults(data || []);
    setLoading(false);
  };

  return (
    <div className="userssearch-page">
      <div className="search-global-overlay" onClick={onClose}>
        <div className="search-exit-hint">ESC to close</div>

      <div className="search-modal-box" onClick={e => e.stopPropagation()}>
        <header className="search-modal-header">
          <h2 className="search-simple-title">Find User</h2>
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch("")}>
              Clear
            </button>
          )}
        </header>

        <div className="search-input-container">
          <div className="search-status-icon">
            {loading ? (
              <Activity size={22} className="animate-spin text-cyan-500" />
            ) : (
              <Search size={22} className={search ? "text-cyan-400" : "text-slate-500"} />
            )}
          </div>
          <input 
            type="text"
            autoFocus
            placeholder="Type username..."
            className="search-main-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-content custom-scrollbar">
          {results.length > 0 ? (
            <div className="results-grid">
              {results.map((user, index) => (
                <div 
                  key={user.id} 
                  className="user-result-item"
                  style={{ animationDelay: `${index * 0.05}s` }} 
                  onClick={() => {
                    navigate(`/user/${user.id}`);
                    onClose();
                  }}
                >
                  <div className="user-avatar-section">
                    <img 
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      className="user-img"
                      alt="avatar"
                    />
                  </div>

                  <div className="user-details">
                    <span className="user-name-text">{user.username}</span>
                    <div className="user-rating-pills">
                      <div className="pill blitz">
                        <Zap size={12} /> {user.rating_blitz || 1200}
                      </div>
                      <div className="pill rapid">
                        <Clock size={12} /> {user.rating_rapid || 1200}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={20} className="item-arrow" />
                </div>
              ))}
            </div>
          ) : (
            <div className="search-placeholder-box">
              {search && !loading ? (
                <div className="no-results-msg">
                  <p>No results found for "{search}"</p>
                  <span>Check the spelling or try another name</span>
                </div>
              ) : (
                <div className="waiting-msg">Start typing to search users...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}