import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { Users, ChevronRight, Activity, Zap, Clock, MessageSquare } from 'lucide-react';
import '@styles/friendslist.scss';
import '@styles/UsersSearch.scss';
import '@/App.css';
import '@/index.css';

interface FriendsListProps {
  onClose: () => void;
}

export default function FriendsList({ onClose }: FriendsListProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    fetchFriends();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const fetchFriends = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .select(`
        friend_id,
        profiles:profiles!friends_friend_id_fkey (
          id,
          username,
          avatar_url,
          rating_blitz,
          rating_rapid,
          last_seen
        )
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      const formattedFriends = data.map((f: any) => f.profiles);
      setFriends(formattedFriends);
    }
    setLoading(false);
  };

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="friendslist-page">
    <div className="search-global-overlay" onClick={onClose}>
      <div className="search-exit-hint">Esc to close</div>

      <div className="search-modal-box" onClick={e => e.stopPropagation()}>
        <header className="search-modal-header">
          <h2 className="search-simple-title">Operatives Online</h2>
          <span className="search-clear-btn" style={{ color: '#10b981' }}>
            {friends.length} Total
          </span>
        </header>

        <div className="search-input-container">
          <div className="search-status-icon">
            {loading ? (
              <Activity size={22} className="animate-spin text-cyan-500" />
            ) : (
              <Users size={22} className="text-slate-500" />
            )}
          </div>
          <input 
            type="text"
            autoFocus
            placeholder="Filter friends..."
            className="search-main-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-content custom-scrollbar">
          {filteredFriends.length > 0 ? (
            <div className="results-grid">
              {filteredFriends.map((friend, index) => (
                <div 
                  key={friend.id} 
                  className="user-result-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    navigate(`/user/${friend.id}`);
                    onClose();
                  }}
                >
                  <div className="user-avatar-section">
                    <img 
                      src={friend.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`} 
                      className="user-img"
                      alt="avatar"
                    />
                    <div className="online-indicator"></div>
                  </div>

                  <div className="user-details">
                    <span className="user-name-text">{friend.username}</span>
                    <div className="user-rating-pills">
                      <div className="pill blitz">
                        <Zap size={12} /> {friend.rating_blitz || 1200}
                      </div>
                      <div className="pill rapid">
                        <Clock size={12} /> {friend.rating_rapid || 1200}
                      </div>
                    </div>
                  </div>

                  <div className="friend-actions">
                    <MessageSquare size={18} className="action-icon" />
                    <ChevronRight size={20} className="item-arrow" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="search-placeholder-box">
              <div className="no-results-msg">
                <p>{search ? "No matches found" : "Your contact list is empty"}</p>
                <span>{search ? "Try another frequency" : "Add some friends to see them here"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

