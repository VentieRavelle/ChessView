import React from 'react';
import { X, Calendar, Trophy, Clock, ChevronRight } from 'lucide-react';
import '@styles/HistoryModal.scss';
import '@/App.css';
import '@/index.css';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const mockGames = [
    { id: 1, opponent: "Stockfish v16", result: "Win", date: "Today, 14:20", mode: "Blitz", accuracy: "92%" },
    { id: 2, opponent: "GrandMaster_77", result: "Loss", date: "Yesterday, 18:45", mode: "Bullet", accuracy: "81%" },
    { id: 3, opponent: "ChessBot_Alpha", result: "Draw", date: "12 Feb, 10:15", mode: "Rapid", accuracy: "88%" },
  ];

  return (
    <div className="history-page">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-title">
              <Calendar size={20} className="icon-blue" />
            <h2>Your games history</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="history-list custom-scrollbar">
          {mockGames.map(game => (
            <div key={game.id} className="history-row">
              <div className="game-main-info">
                <div className={`result-indicator ${game.result.toLowerCase()}`}>
                  {game.result[0]}
                </div>
                <div className="game-details">
                  <span className="opp-name">{game.opponent}</span>
                  <span className="game-meta">{game.date} • {game.mode}</span>
                </div>
              </div>

              <div className="game-stats">
                <div className="stat-item">
                  <Trophy size={14} />
                  <span>{game.accuracy}</span>
                </div>
                <div className="stat-item">
                  <Clock size={14} />
                  <span>10m</span>
                </div>
                <button className="view-game-btn">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default HistoryModal;