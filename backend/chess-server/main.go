package main

import (
	"chess-server/lobby"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var mm = &lobby.Matchmaker{
	Queue: []*lobby.Player{},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("userId")

	if userId == "" || userId == "null" || userId == "undefined" {
		log.Printf("⚠️ Request rejected: IP=%s", r.RemoteAddr)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("❌ Error upgrading connection for %s: %v", userId, err)
		return
	}

	mm.AddPlayer(userId, ws)

	log.Printf("📡 Connection established with [%s]", userId)
}

func main() {
	go mm.Start()

	http.HandleFunc("/ws", handleConnections)

	log.Println("🚀 Server started on port :8080")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("❌ Server startup error: ", err)
	}
}
