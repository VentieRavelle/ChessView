import React, { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useNavigate } from 'react-router-dom';
import '@styles/analysis.scss';

const Analysis = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState(new Chess());

  const makeMove = useCallback((m: any) => {
    try {
      const update = new Chess(game.fen());
      const result = update.move(m);
      if (result) {
        setGame(update);
        return true;
      }
    } catch (e) { return false; }
    return false;
  }, [game]);

  function onPieceDrop(sourceSquare: any, targetSquare: any) {
    return makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
  }

  return (
    <div className="analysis-page">
    <div className="analysis-shell">
      <div className="analysis-container-fluid">
        
        <aside className="analysis-sidebar">
          <button className="cyber-back-btn" onClick={() => navigate('/dashboard')}>
            ← Exit
          </button>
          <div className="analysis-glass-card">
            <div className="label-tiny">Logs</div>
            <div className="moves-flow">
              {game.history().map((m, i) => (
                <span key={i} className="m-tag">{i % 2 === 0 ? `${Math.floor(i/2)+1}.` : ''}{m}</span>
              ))}
            </div>
          </div>
        </aside>

        <main className="analysis-board-center">
          <div className="chessboard-neon-frame">
            <Chessboard 
              position={game.fen()} 
              onPieceDrop={onPieceDrop}
              boardOrientation="white"
              animationDuration={200}
            />
          </div>
          
          <div className="board-utility-bar">
            <button className="ut-btn" onClick={() => {
              const g = new Chess(game.fen());
              g.undo();
              setGame(g);
            }}>UNDO</button>
            <button className="ut-btn" onClick={() => setGame(new Chess())}>Reset</button>
          </div>
        </main>
        <aside className="analysis-details">
          <div className="data-block">
            <div className="label-tiny">Fen Data</div>
            <div className="fen-string-box">{game.fen()}</div>
          </div>
        </aside>

      </div>
    </div>
    </div>
  );
};

export default Analysis;