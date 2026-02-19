import React, { useState } from 'react';
import { X, Users, Globe, Shield, Swords, Clock, ChevronRight } from 'lucide-react';
import '@styles/CreateFriendGameModal.scss';

interface CreateFriendGameProps {
  onClose: () => void;
  onCreate: (config: any) => void;
}

const CreateFriendGameModal: React.FC<CreateFriendGameProps> = ({ onClose, onCreate }) => {
  const [time, setTime] = useState(5);
  const [increment, setIncrement] = useState(3);
  const [isRated, setIsRated] = useState(true);
  const [color, setColor] = useState<'white' | 'random' | 'black'>('random');
  const [mode, setMode] = useState('standard');

  const handleCreate = () => {
    onCreate({ time, increment, isRated, color, mode });
  };

  return (
    <div className="friendgame-page">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-friend" onClick={e => e.stopPropagation()}>
          <button className="modal-close-icon" onClick={onClose}><X size={24} /></button>

          <header className="modal-header">
            <div className="header-icon"><Users size={32} /></div>
            <h2>Game with a friend</h2>
            <p>Set up the parameters and send the link</p>
          </header>

          <div className="setup-grid">
            <div className="setup-item">
              <label>Time control (min)</label>
              <input 
                type="range" min="1" max="60" 
                value={time} onChange={(e) => setTime(Number(e.target.value))} 
              />
              <div className="value-display">{time}м</div>
            </div>

            <div className="setup-item">
              <label>Добавление (сек)</label>
              <input 
                type="range" min="0" max="30" 
                value={increment} onChange={(e) => setIncrement(Number(e.target.value))} 
              />
              <div className="value-display">+{increment}с</div>
            </div>

            <div className="setup-item full-width">
              <label>Тип игры</label>
              <div className="toggle-group">
                <button 
                  className={isRated ? 'active' : ''} 
                  onClick={() => setIsRated(true)}
                >
                  <Shield size={16} /> Rated
                </button>
                <button 
                  className={!isRated ? 'active' : ''} 
                  onClick={() => setIsRated(false)}
                >
                  <Globe size={16} /> Unrated
                </button>
              </div>
            </div>

            <div className="setup-item full-width">
              <label>Choose the color</label>
              <div className="color-selector">
                <button className={`color-btn white ${color === 'white' ? 'selected' : ''}`} onClick={() => setColor('white')} />
                <button className={`color-btn random ${color === 'random' ? 'selected' : ''}`} onClick={() => setColor('random')} />
                <button className={`color-btn black ${color === 'black' ? 'selected' : ''}`} onClick={() => setColor('black')} />
              </div>
            </div>
          </div>

          <button className="create-link-button" onClick={handleCreate}>
            Create link <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFriendGameModal;