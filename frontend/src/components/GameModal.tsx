import React, { useEffect, useState } from 'react';
import { 
  Rocket, Zap, Clock, X, ChevronRight, ChevronDown, 
  Wand2, Swords, Share2, Layers, Cpu, Globe, ShieldAlert, ArrowLeft 
} from 'lucide-react';
import '@styles/GameModal.scss';

interface GameModalProps {
  onSelect: (mode: string, time: string) => void;
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ onSelect, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('classic');
  const [selectedMode, setSelectedMode] = useState<any | null>(null);

  const categories = [
    {
      id: 'classic',
      name: 'Classical controls',
      icon: <Clock size={20} />,
      modes: [
        { id: 'bullet', title: 'Bullet', icon: <Rocket size={24} />, desc: 'Speed of light', color: '#ef4444', presets: ['1+0', '1+1', '2+1'] },
        { id: 'blitz', title: 'Blitz', icon: <Zap size={24} />, desc: 'Golden standard', color: '#eab308', presets: ['3+0', '3+2', '5+0'] },
        { id: 'rapid', title: 'Rapid', icon: <Layers size={24} />, desc: 'For strategists', color: '#3b82f6', presets: ['10+0', '10+5', '15+10'] },
        { id: 'classical', title: 'Classical', icon: <Globe size={24} />, desc: 'Deep analysis', color: '#10b981', presets: ['30+0', '30+20', '45+45'] },
      ]
    },
    {
      id: 'variants',
      name: 'Chess variants',
      icon: <Wand2 size={20} />,
      modes: [
        { id: 'chess960', title: 'Chess 960', icon: <Cpu size={24} />, desc: 'Fischer Random', color: '#8b5cf6', presets: ['3+2', '5+3', '10+5'] },
        { id: 'crazyhouse', title: 'Crazyhouse', icon: <Share2 size={24} />, desc: 'Reserve pieces', color: '#ec4899', presets: ['1+0', '3+0', '3+2'] },
        { id: 'king_of_hill', title: 'King of Hill', icon: <ChevronDown size={24} />, desc: 'King in the center', color: '#f97316', presets: ['3+0', '3+2', '5+0'] },
        { id: 'three_check', title: '3-Check', icon: <X size={24} />, desc: 'Three checks — victory', color: '#f43f5e', presets: ['3+0', '3+2', '5+0'] },
      ]
    },
    {
      id: 'experimental',
      name: 'Experimental modes',
      icon: <Swords size={20} />,
      modes: [
        { id: 'portal', title: 'Portal', icon: <Globe size={24} />, desc: 'Through the portals', color: '#06b6d4', presets: ['3+0', '5+0', '10+0'] },
        { id: 'double_move', title: 'Double Move', icon: <Zap size={24} />, desc: 'Two moves at once', color: '#facc15', presets: ['3+0', '5+0', '10+0'] },
        { id: 'fog_of_war', title: 'Fog of War', icon: <ShieldAlert size={24} />, desc: 'Fog of war', color: '#64748b', presets: ['5+0', '10+0'] },
        { id: 'atomic', title: 'Atomic', icon: <Rocket size={24} />, desc: 'Explosive captures', color: '#ff4d00', presets: ['3+0', '3+2', '5+0'] },
      ]
    }
  ];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="gamemodal-page">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-premium" onClick={e => e.stopPropagation()}>
          <button className="modal-close-icon" onClick={onClose}><X size={24} /></button>

          {!selectedMode ? (
            <div className="view-step">
              <header className="modal-header-clean">
                <h2>Select game mode</h2>
                <p>All possible game modes</p>
              </header>

              <div className="modes-tree-container">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className={`mode-category ${expandedCategory === category.id ? 'is-active' : ''}`}
                  >
                    <div 
                      className="category-header" 
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    >
                      <div className="cat-left">
                        <span className="cat-icon-wrapper">{category.icon}</span>
                        <span className="cat-name">{category.name}</span>
                      </div>
                      <ChevronRight className="cat-chevron" size={18} />
                    </div>

                    <div className="category-modes-wrapper">
                      <div className="category-modes-content">
                        <div className="category-modes-grid">
                          {category.modes.map((m) => (
                            <div 
                              key={m.id} 
                              className="mode-card-premium" 
                              onClick={() => setSelectedMode(m)}
                              style={{ '--brand-color': m.color } as any}
                            >
                              <div className="mode-card-icon" style={{ color: m.color }}>{m.icon}</div>
                              <div className="mode-card-info">
                                <span className="mode-card-title">{m.title}</span>
                                <p className="mode-card-desc">{m.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="time-selector-view view-step">
              <button className="back-btn" onClick={() => setSelectedMode(null)}>
                <ArrowLeft size={18} /> Back to modes
              </button>
              
              <div className="selected-mode-info">
                <div className="large-icon" style={{ color: selectedMode.color }}>{selectedMode.icon}</div>
                <h3>{selectedMode.title}</h3>
                <p>{selectedMode.desc}</p>
              </div>

              <div className="time-grid-premium">
                {selectedMode.presets.map((time: string) => (
                  <button 
                    key={time} 
                    className="time-card" 
                    onClick={() => onSelect(selectedMode.id, time)}
                    style={{ '--brand-color': selectedMode.color } as any}
                  >
                    <span className="time-val">{time}</span>
                    <span className="time-type">{selectedMode.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-footer-hint">
            <span className="hint-kbd">ESC</span> to close the window
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;