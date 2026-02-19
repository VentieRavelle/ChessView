import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Chessboard } from "react-chessboard";
import { Chess, type Square } from 'chess.js';
import { supabase } from '@/supabaseClient';
import { 
  History as HistoryIcon, Flag, X, Check,
  MessageSquare, Send, Maximize
} from 'lucide-react';
import { useMatchmaking } from '@hooks/useMatchmaking';
import { useChessTimer } from '@hooks/useChessTimer'; 
import '@styles/GamePage.scss';

type BoardOrientation = 'white' | 'black';

interface PlayerData {
  id: string;
  username: string;
  avatar_url: string;
  rating_blitz: number;
  rating_bullet: number;
  rating_rapid: number;
  fide_title?: string;
}

const GamePage: React.FC = () => {
  const { mode = 'blitz' } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [opponent, setOpponent] = useState<PlayerData | null>(null);
  const [game, setGame] = useState(new Chess());
  const [gameStarted, setGameStarted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isResigning, setIsResigning] = useState(false);
  const myColor: BoardOrientation = useMemo(() => {
    const colorParam = searchParams.get('color');
    if (colorParam === 'black' || colorParam === 'b') return 'black';
    return 'white';
  }, [searchParams]);

  const userSide = myColor === 'white' ? 'w' : 'b';

  const wsUrl = userId ? `ws://localhost:8080/ws?userId=${userId}` : "";
  const { socket, matchData, status, startSearch } = useMatchmaking(wsUrl);

  const { whiteTime, blackTime, resetTimers } = useChessTimer(
    gameStarted,
    game.turn(),
    game.isGameOver(),
    {
      initialTime: mode === 'bullet' ? 60 : mode === 'blitz' ? 180 : 600,
      increment: 0,
      onTimeUp: (loser) => {
        alert(`Time is our! Who is won: ${loser === 'w' ? 'White' : 'Black'}`);
        setGameStarted(false);
      }
    }
  );

  const fetchUserData = async (id: string) => {
    if (!id) return null;
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    return data as PlayerData;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const makeAMove = useCallback((move: any) => {
    setGame((prevGame) => {
      const gameCopy = new Chess(prevGame.fen());
      try {
        const result = gameCopy.move(move);
        return result ? gameCopy : prevGame;
      } catch (e) {
        return prevGame;
      }
    });
  }, []);

  useEffect(() => {
    const initSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUserId(user.id);
      const myProfile = await fetchUserData(user.id);
      setPlayer(myProfile);

      const { data: activeMatch } = await supabase
        .from('active_matches')
        .select('*')
        .or(`white_id.eq.${user.id},black_id.eq.${user.id}`)
        .maybeSingle();

      if (activeMatch) {
        const isWhiteMatch = activeMatch.white_id === user.id;
        const oppId = isWhiteMatch ? activeMatch.black_id : activeMatch.white_id;
        const oppProfile = await fetchUserData(oppId);
        if (oppProfile) {
          setOpponent(oppProfile);
          setGame(new Chess(activeMatch.fen || undefined));
          setGameStarted(true);
        }
      }
    };
    initSession();
  }, [navigate]);

  useEffect(() => {
    if (userId && status === 'idle' && !gameStarted) {
      startSearch();
    }
  }, [userId, status, startSearch, gameStarted]);

  useEffect(() => {
    if (matchData && player) {
      const handleMatchFound = async () => {
        const oppProfile = await fetchUserData(matchData.opponent_id);
        setOpponent(oppProfile);
        setGame(new Chess());
        setGameStarted(true);
        resetTimers();

        if (matchData.color === 'w' || matchData.color === 'white') {
          await supabase.from('active_matches').upsert({
            id: matchData.room_id,
            white_id: player.id,
            black_id: matchData.opponent_id,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            mode: mode
          });
        }
      };
      handleMatchFound();
    }
  }, [matchData, player, mode, resetTimers]);

  useEffect(() => {
    if (!socket) return;
    const handleMsg = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'MOVE') {
          makeAMove(data.move);
        } else if (data.type === 'CHAT') {
          setMessages(prev => [...prev, data]);
        }
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };
    socket.addEventListener('message', handleMsg);
    return () => socket.removeEventListener('message', handleMsg);
  }, [socket, makeAMove]);

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    if (!gameStarted) return false;
    if (game.turn() !== userSide) return false;

    const moveData = { from: sourceSquare, to: targetSquare, promotion: "q" };
    const gameCopy = new Chess(game.fen());

    try {
      const moveResult = gameCopy.move(moveData);
      if (moveResult) {
        setGame(gameCopy);
        const roomId = matchData?.room_id || userId; 
        
        socket?.send(JSON.stringify({ 
          type: 'MOVE', 
          move: moveData, 
          room_id: roomId 
        }));
        
        if (roomId) {
          supabase.from('active_matches')
            .update({ fen: gameCopy.fen() })
            .eq('id', roomId)
            .then();
        }
        return true;
      }
    } catch (e) { return false; }
    return false;
  }

  const sendChat = () => {
    if (!chatInput.trim() || !socket) return;
    socket.send(JSON.stringify({ 
      type: 'CHAT', text: chatInput, user: player?.username || 'User' 
    }));
    setChatInput('');
  };

  const confirmResign = async () => {
    if (window.confirm("Сдаться?")) {
      const roomId = matchData?.room_id || userId;
      if (roomId) await supabase.from('active_matches').delete().eq('id', roomId);
      setGameStarted(false);
      navigate('/dashboard');
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const isWaiting = !gameStarted || game.history().length === 0;
  const userTurn = game.turn() === userSide;

  return (
    <div className="game-layout-root">
      <div className="game-three-columns">
        <aside className="side-panel chat-side">
          <div className="panel-header"><MessageSquare size={18}/> <span>LIVE CHAT</span></div>
          <div className="chat-area custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.user === player?.username ? 'self' : ''}`}>
                <span className="msg-user">{m.user}:</span> {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input-box">
            <input 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && sendChat()} 
              placeholder="Type message..." 
            />
            <button onClick={sendChat}><Send size={16}/></button>
          </div>
        </aside>

        <main className="arena-center">
          <div className={`player-box opponent ${!userTurn && !isWaiting ? 'active-turn' : ''}`}>
            <div className="p-main-info">
              <img 
                src={opponent?.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=bot'} 
                className="p-avatar" 
                alt="Opponent" 
              />
              <div className="p-data">
                <div className="p-name-row">
                  {opponent?.username || (status === 'searching' ? 'Searching...' : 'Waiting...')}
                </div>
                <div className="p-sub">
                  Rating: {opponent ? (mode === 'blitz' ? opponent.rating_blitz : mode === 'bullet' ? opponent.rating_bullet : opponent.rating_rapid) : '----'}
                </div>
              </div>
            </div>
            <div className={`p-time-display ${isWaiting ? 'waiting' : ''} ${myColor === 'white' ? 'black-timer' : 'white-timer'}`}>
              {formatTime(myColor === 'white' ? blackTime : whiteTime)}
            </div>
          </div>

          <div className="board-main-container">
            <Chessboard 
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={myColor}
              customDarkSquareStyle={{ backgroundColor: '#2d3436' }}
              customLightSquareStyle={{ backgroundColor: '#636e72' }}
            />
          </div>
          <div className={`player-box user ${userTurn && !isWaiting ? 'active-turn' : ''}`}>
            <div className="p-main-info">
              <img 
                src={player?.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=user'} 
                className="p-avatar active-neon-border" 
                alt="Me" 
              />
              <div className="p-data">
                <div className="p-name-row">
                  {player?.username || 'Loading...'} <span className="p-badge">YOU</span>
                </div>
                <div className="p-sub">
                  Rating: {player ? (mode === 'blitz' ? player.rating_blitz : mode === 'bullet' ? player.rating_bullet : player.rating_rapid) : '----'}
                </div>
              </div>
            </div>
            <div className={`p-time-display ${isWaiting ? 'waiting' : ''} ${myColor === 'white' ? 'white-timer' : 'black-timer'}`}>
              {formatTime(myColor === 'white' ? whiteTime : blackTime)}
            </div>
          </div>
        </main>

        <aside className="side-panel history-side">
          <div className="panel-header"><HistoryIcon size={18}/> <span>Moves</span></div>
          <div className="moves-list custom-scrollbar">
            {game.history().map((m, i) => i % 2 === 0 && (
              <div key={i} className="move-row">
                <span className="m-num">{Math.floor(i / 2) + 1}.</span>
                <span className="m-val">{m}</span>
                <span className="m-val">{game.history()[i + 1] || ''}</span>
              </div>
            ))}
          </div>
          <div className="game-controls">
            <button className="fs-btn" onClick={toggleFullScreen} title="Fullscreen">
              <Maximize size={18} />
            </button>
            {!isResigning ? (
              <button 
                className="resign-btn" 
                onClick={() => setIsResigning(true)}
                disabled={!gameStarted}
              >
                <Flag size={18}/> Resign
              </button>
            ) : (
              <div className="resign-confirm-group">
                <button className="confirm-btn yes" onClick={confirmResign}><Check size={18}/> Yes</button>
                <button className="confirm-btn no" onClick={() => setIsResigning(false)}><X size={18}/></button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;