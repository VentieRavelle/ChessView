import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Users, ArrowLeft, Loader2 } from 'lucide-react';
import '@styles/WaitingRoom.scss';

const WaitingRoom: React.FC = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const inviteLink = `${window.location.origin}/play/friend/${gameId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="waiting-room-page">
      <div className="waiting-card">
        <button className="back-home" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} /> To Control panel
        </button>

        <div className="waiting-header">
          <div className="pulse-icon">
            <Users size={40} color="#00d1ff" />
          </div>
          <h1>Waiting for opponent</h1>
          <p>Send this link to a friend to start the game</p>
        </div>

        <div className="link-box">
          <input type="text" readOnly value={inviteLink} />
          <button onClick={handleCopy} className={copied ? 'copied' : ''}>
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        <div className="status-footer">
          <Loader2 className="spinner" size={18} />
          <span>Waiting for the second player to connect...</span>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;