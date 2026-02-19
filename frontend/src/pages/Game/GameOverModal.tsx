import React from 'react';
import { Trophy, Frown, Home, RotateCcw, BarChart2 } from 'lucide-react';
import './GameOverModal.scss';

interface GameOverModalProps {
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw';
  winnerName: string;
  ratingChange: number;
  onRestart: () => void;
  onHome: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ 
  isOpen, result, winnerName, ratingChange, onRestart, onHome 
}) => {
  if (!isOpen) return null;

  const config = {
    win: { title: 'VICTORY', icon: <Trophy className="result-icon win" />, class: 'win-theme' },
    loss: { title: 'DEFEAT', icon: <Frown className="result-icon loss" />, class: 'loss-theme' },
    draw: { title: 'DRAW', icon: <BarChart2 className="result-icon draw" />, class: 'draw-theme' }
  };

  const { title, icon, class: themeClass } = config[result];

  return (
    <div className="modal-overlay">
      <div className={`game-over-card ${themeClass}`}>
        <div className="result-header">
          {icon}
          <h1>{title}</h1>
        </div>

        <div className="result-body">
          <p className="winner-text">
            {result === 'draw' ? 'No winner this time' : `Winner: ${winnerName}`}
          </p>
          
          <div className="rating-section">
            <span className="label">Rating Change</span>
            <span className={`change ${ratingChange >= 0 ? 'plus' : 'minus'}`}>
              {ratingChange >= 0 ? `+${ratingChange}` : ratingChange}
            </span>
          </div>
        </div>

        <div className="result-footer">
          <button className="btn-restart" onClick={onRestart}>
            <RotateCcw size={18} /> Play Again
          </button>
          <button className="btn-home" onClick={onHome}>
            <Home size={18} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;