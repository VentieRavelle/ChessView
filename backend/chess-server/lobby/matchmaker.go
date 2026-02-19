package lobby

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Player struct {
	ID       string
	Conn     *websocket.Conn
	Rating   int
	InGame   bool
	Username string
	mu       sync.Mutex
}

type Matchmaker struct {
	mu    sync.Mutex
	Queue []*Player
}

func (m *Matchmaker) AddPlayer(id string, conn *websocket.Conn) {
	m.mu.Lock()
	defer m.mu.Unlock()

	player := &Player{
		ID:   id,
		Conn: conn,
	}
	m.Queue = append(m.Queue, player)
	log.Printf("✅ Player %s added to queue", id)
}

func (m *Matchmaker) Start() {
	log.Println("🔄 Matchmaking loop started")
	for {
		time.Sleep(2 * time.Second)
		m.MatchPlayers()
	}
}

func (m *Matchmaker) MatchPlayers() {
	m.mu.Lock()
	currentQueue := m.Queue
	m.Queue = []*Player{}
	m.mu.Unlock()

	if len(currentQueue) > 0 {
		log.Printf("🔍 Matchmaker: Checking queue. Players: %d", len(currentQueue))
	}

	if len(currentQueue) < 2 {
		m.mu.Lock()
		m.Queue = append(currentQueue, m.Queue...)
		m.mu.Unlock()
		return
	}

	var matchedPlayers = make(map[string]bool)
	var finalQueue []*Player

	for i := 0; i < len(currentQueue); i++ {
		p1 := currentQueue[i]
		if matchedPlayers[p1.ID] {
			continue
		}

		if err := p1.Conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(time.Second)); err != nil {
			log.Printf("❌ Player %s unavailable (Ping failed), removing", p1.ID)
			p1.Conn.Close()
			continue
		}

		found := false
		for j := i + 1; j < len(currentQueue); j++ {
			p2 := currentQueue[j]

			log.Printf("⚖️ Comparison: p1=%s vs p2=%s", p1.ID, p2.ID)

			if matchedPlayers[p2.ID] {
				continue
			}

			if p1.ID == p2.ID {
				log.Printf("⚠️ Пропуск: Player %s is trying to play against themselves", p1.ID)
				continue
			}

			if err := p2.Conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(time.Second)); err != nil {
				log.Printf("❌ Player %s unavailable, skipping", p2.ID)
				p2.Conn.Close()
				continue
			}
			matchedPlayers[p1.ID] = true
			matchedPlayers[p2.ID] = true

			p1.mu.Lock()
			p1.InGame = true
			p1.mu.Unlock()

			p2.mu.Lock()
			p2.InGame = true
			p2.mu.Unlock()

			log.Printf("🤝 SUCCESS: Match created: %s vs %s", p1.ID, p2.ID)
			go StartGame(p1, p2)
			found = true
			break
		}

		if !found {
			finalQueue = append(finalQueue, p1)
		}
	}

	m.mu.Lock()
	m.Queue = append(finalQueue, m.Queue...)
	m.mu.Unlock()
}
func StartGame(p1, p2 *Player) {
	roomID := fmt.Sprintf("room_%d", time.Now().UnixNano())
	log.Printf("⚡ MATCH STARTED: %s vs %s", p1.ID, p2.ID)

	sendJSONSafe(p1, map[string]interface{}{
		"type": "MATCH_FOUND", "color": "w", "opponent_id": p2.ID, "room_id": roomID,
	})
	sendJSONSafe(p2, map[string]interface{}{
		"type": "MATCH_FOUND", "color": "b", "opponent_id": p1.ID, "room_id": roomID,
	})

	var wg sync.WaitGroup
	wg.Add(2)
	go handleMessages(p1, p2, &wg)
	go handleMessages(p2, p1, &wg)
	wg.Wait()

	p1.mu.Lock()
	p1.InGame = false
	p1.mu.Unlock()
	p2.mu.Lock()
	p2.InGame = false
	p2.mu.Unlock()

	log.Printf("🏁 MATCH ENDED: %s and %s are free", p1.ID, p2.ID)
}

func handleMessages(sender, receiver *Player, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		var msg map[string]interface{}
		if err := sender.Conn.ReadJSON(&msg); err != nil {
			log.Printf("🔌 Player %s disconnected", sender.ID)
			sendJSONSafe(receiver, map[string]interface{}{"type": "OPPONENT_LEFT"})
			return
		}
		if err := sendJSONSafe(receiver, msg); err != nil {
			log.Printf("⚠️ Error forwarding to %s", receiver.ID)
		}
	}
}

func sendJSONSafe(p *Player, data interface{}) error {
	p.mu.Lock()
	defer p.mu.Unlock()
	return p.Conn.WriteJSON(data)
}
