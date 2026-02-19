import { useState, useEffect, useRef, useCallback } from 'react';

export const useMatchmaking = (url: string) => {
  const [matchData, setMatchData] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'searching' | 'connected'>('idle');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const startSearch = useCallback(() => {
    if (!url || url.includes("userId=null") || url.includes("userId=undefined")) {
      return;
    }

    if (
      socketRef.current?.readyState === WebSocket.OPEN || 
      socketRef.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    const ws = new WebSocket(url);
    socketRef.current = ws;
    setSocket(ws);
    setStatus('searching');

    ws.onopen = () => {
      console.log("✅ Connection established, search started");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'MATCH_FOUND') {
          setMatchData(data);
          setStatus('connected');
        }
      } catch (err) {
        console.error("❌ Parsing error:", err);
      }
    };

    ws.onerror = () => setStatus('idle');
    ws.onclose = () => {
      socketRef.current = null;
      setSocket(null);
      setStatus(prev => (prev === 'connected' ? 'connected' : 'idle'));
    };
  }, [url]);

  useEffect(() => {
    if (url) {
      startSearch();
    }
  }, [url, startSearch]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return { 
    socket, 
    matchData, 
    status, 
    gameStarted: status === 'connected', 
    startSearch 
  };
};