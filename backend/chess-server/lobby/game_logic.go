package lobby

import (
	"sync"
	"time"

	"github.com/notnil/chess"
)

type GameSession struct {
	ID           string
	White        *Player
	Black        *Player
	Board        *chess.Game
	WhiteTime    time.Duration
	BlackTime    time.Duration
	LastMoveTime time.Time
	mu           sync.Mutex
	IsActive     bool
	GameOverChan chan string
}

func NewGameSession(p1, p2 *Player, initialMinutes int) *GameSession {
	return &GameSession{
		ID:           p1.ID,
		White:        p1,
		Black:        p2,
		Board:        chess.NewGame(),
		WhiteTime:    time.Duration(initialMinutes) * time.Minute,
		BlackTime:    time.Duration(initialMinutes) * time.Minute,
		LastMoveTime: time.Now(),
		IsActive:     true,
		GameOverChan: make(chan string, 1),
	}
}

func (g *GameSession) HandleMove(playerID string, moveStr string) (string, bool) {
	g.mu.Lock()
	defer g.mu.Unlock()

	turn := g.Board.Position().Turn()
	if (turn == chess.White && playerID != g.White.ID) ||
		(turn == chess.Black && playerID != g.Black.ID) {
		return "", false
	}

	now := time.Now()
	elapsed := now.Sub(g.LastMoveTime)
	if turn == chess.White {
		g.WhiteTime -= elapsed
	} else {
		g.BlackTime -= elapsed
	}
	g.LastMoveTime = now

	err := g.Board.MoveStr(moveStr)
	if err != nil {
		return "", false
	}

	status := g.CheckGameEnd()
	return status, true
}

func (g *GameSession) CheckGameEnd() string {
	method := g.Board.Method()
	if method == chess.Checkmate {
		return "CHECKMATE"
	}
	if method == chess.Stalemate {
		return "DRAW_STALEMATE"
	}
	if g.WhiteTime <= 0 {
		return "TIMEOUT_WHITE"
	}
	if g.BlackTime <= 0 {
		return "TIMEOUT_BLACK"
	}
	return "ONGOING"
}
