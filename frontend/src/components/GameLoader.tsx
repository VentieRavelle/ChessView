import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import '@styles/GameLoader.scss';

interface GameLoaderProps {
  onCancel?: () => void;
}

const tips = [
  "Don't bring out the queen too early in the game.",
  "Control the center with pawns (e4, d4 or e5, d5).",
  "Develop knights before bishops.",
  "Castle as soon as possible to safeguard your king.",
  "A pinned piece loses its power — use this.",
  "Always check if your piece is under threat after your opponent's move.",
  "Rooks love open files.",
  "Passed pawns are a hidden threat in the endgame.",
  "The king is an active piece in the endgame, don't be afraid to move it.",
  "Two bishops in an open position are usually stronger than a knight and a bishop.",
  "Look for knight forks — it's the sneakiest tactical trick.",
  "Don't move the same piece twice in the opening without necessity.",
  "A knight on the edge of the board is always bad.",
  "Always have a plan, even if it's a bad one — it's better than playing without a plan.",
  "Removing the defender is a great way to win material.",
  "Zugzwang is a situation where any move worsens the position.",
  "Controlling the center gives you room to maneuver.",
  "Trade pieces if you have a material advantage.",
  "Protect your pawn structure: doubled pawns are often weak.",
  "Chess is 90% tactics. Solve puzzles more often!"
];

const GameLoader: React.FC<GameLoaderProps> = ({ onCancel }) => {
  const [seconds, setSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className='gameloader-page'>
      <div className="matchmaking-overlay">
        <div className="bg-blur-spot spot-1"></div>
        <div className="bg-blur-spot spot-2"></div>
        
        <div className="matchmaking-content">
          <div className="visual-container">
            <div className="radar-sweep"></div>
            <div className="orbit-ring outer"></div>
            <div className="orbit-ring inner"></div>
            <div className="pulse-core">
              <div className="core-circle"></div>
              <div className="searching-icon">
                <Search size={48} className="icon-pulse" />
              </div>
            </div>
          </div>

          <div className="loader-text-block">
            <h2 className="loading-title">Searching for an opponent</h2>
            <div className="search-timer">{formatTime(seconds)}</div>
            <div className="tip-container">
              <p className="loading-subtitle">Finding a balanced opponent</p>
              <div className="dynamic-tip">
                <span className="tip-label">Tip:</span> {tips[tipIndex]}
              </div>
            </div>
          </div>

          {onCancel && (
            <button className="modern-cancel-btn" onClick={onCancel}>
              <X size={18} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLoader;