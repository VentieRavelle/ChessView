import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@styles/tournaments.scss';
import '@/App.css';

interface Tournament {
  id: string;
  title: string;
  format: string;
  prize: string;
  fee: string;
  players: number;
  maxPlayers: number;
  status: 'live' | 'upcoming' | 'finished';
  startTime: string;
  organizer: string;
}

const Tournaments = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');
  const [showModal, setShowModal] = useState(false);
  
  const [tournaments, setTournaments] = useState<Tournament[]>([
    { id: '1', title: "NEON BLITZ CUP", format: "3+2 • Blitz", prize: "1500 💎", fee: "Free", players: 45, maxPlayers: 128, status: 'upcoming', startTime: '20:00', organizer: 'SYSTEM' },
    { id: '2', title: "CYBER BULLET", format: "1+0 • Bullet", prize: "500 💎", fee: "10 💎", players: 12, maxPlayers: 32, status: 'live', startTime: 'NOW', organizer: 'ADMIN' },
    { id: '3', title: "GRANDMASTER OPEN", format: "10+5 • Rapid", prize: "5000 💎", fee: "100 💎", players: 88, maxPlayers: 256, status: 'upcoming', startTime: 'Tomorrow', organizer: 'FIDE' }
  ]);

  const [formData, setFormData] = useState({
    title: '', format: '3+2 • Blitz', prize: '', fee: 'Free', maxPlayers: 64
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Tournament = {
      id: Date.now().toString(),
      ...formData,
      players: 1,
      status: 'upcoming',
      startTime: 'In 1h',
      organizer: 'YOU'
    };
    setTournaments([newEvent, ...tournaments]);
    setShowModal(false);
  };

  const filteredTourneys = tournaments.filter(t => filter === 'all' ? true : t.status === filter);

  return (
    <div className='tournaments-page'>
        <div className="tourney-page-wrapper">
      <div className="tourney-content-fluid">
        
        <nav className="tourney-nav">
          <button className="back-btn-cyber" onClick={() => navigate('/dashboard')}>
            <span className="arrow">←</span> Dashboard
          </button>
          <div className="nav-actions">
             <div className="user-balance-chip">
               <span className="label">CREDITS:</span>
               <span className="val">1,240 💎</span>
             </div>
             <button className="create-evt-btn" onClick={() => setShowModal(true)}>+ CREATE EVENT</button>
          </div>
        </nav>

        <header className="tourney-main-header">
          <div className="header-glitch-text">
            <h1 data-text="TOURNAMENTS">TOURNAMENTS</h1>
            <div className="header-line"></div>
          </div>
          <div className="filter-bar">
            {['all', 'live', 'upcoming'].map((f) => (
              <button 
                key={f}
                className={`filter-link ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f as any)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="tourney-grid-full">
          {filteredTourneys.map((t) => (
            <div key={t.id} className={`tourney-card-premium ${t.status}`}>
              <div className="card-inner">
                <div className="card-visual">
                  <div className="status-badge">{t.status.toUpperCase()}</div>
                  <div className="format-label">{t.format}</div>
                  <div className="glyph-bg">♟</div>
                </div>
                
                <div className="card-body">
                  <h3 className="tourney-title">{t.title}</h3>
                  <div className="organizer">ORG: {t.organizer}</div>
                  
                  <div className="stats-row-grid">
                    <div className="stat-entry">
                      <span className="s-lab">PRIZE POOL</span>
                      <span className="s-val accent">{t.prize}</span>
                    </div>
                    <div className="stat-entry">
                      <span className="s-lab">ENTRY FEE</span>
                      <span className="s-val">{t.fee}</span>
                    </div>
                    <div className="stat-entry">
                      <span className="s-lab">PLAYERS</span>
                      <span className="s-val">{t.players}/{t.maxPlayers}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="time-info">Starts: {t.startTime}</div>
                    <button className="action-button-cyber">
                      {t.status === 'live' ? 'SPECTATE' : 'REGISTER'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="tourney-modal-overlay">
          <div className="tourney-modal-box">
            <div className="modal-head">
              <h2>INITIALIZE EVENT</h2>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="input-group">
                <label>EVENT TITLE</label>
                <input type="text" placeholder="Enter tournament name..." required 
                  onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid-inputs">
                <div className="input-group">
                  <label>FORMAT</label>
                  <select onChange={e => setFormData({...formData, format: e.target.value})}>
                    <option>3+2 • Blitz</option>
                    <option>1+0 • Bullet</option>
                    <option>10+5 • Rapid</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>MAX PLAYERS</label>
                  <input type="number" defaultValue="64" 
                    onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid-inputs">
                 <div className="input-group">
                  <label>PRIZE POOL</label>
                  <input type="text" placeholder="100 💎" 
                    onChange={e => setFormData({...formData, prize: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>ENTRY FEE</label>
                  <input type="text" placeholder="Free" 
                    onChange={e => setFormData({...formData, fee: e.target.value})} />
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-abort" onClick={() => setShowModal(false)}>CANCEL</button>
                <button type="submit" className="btn-confirm">CREATE TOURNAMENT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Tournaments;