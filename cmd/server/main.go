package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"web-scrapper/internal/config"
	"web-scrapper/internal/fetcher"
	"web-scrapper/internal/limiter"
	"web-scrapper/internal/logger"
	"web-scrapper/internal/parser"
	"web-scrapper/internal/worker"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for dev
	},
}

// Hub maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	// Registered clients.
	clients map[*websocket.Conn]bool

	// Inbound messages from the clients.
	broadcast chan interface{}

	// Register requests from the clients.
	register chan *websocket.Conn

	// Unregister requests from clients.
	unregister chan *websocket.Conn

	mu sync.Mutex
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan interface{}),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		clients:    make(map[*websocket.Conn]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
			}
			h.mu.Unlock()
		case message := <-h.broadcast:
			h.mu.Lock()
			for client := range h.clients {
				err := client.WriteJSON(message)
				if err != nil {
					log.Printf("error: %v", err)
					client.Close()
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

type ScrapeRequest struct {
	URLs []string `json:"urls"`
}

type Server struct {
	cfg *config.Config
	hub *Hub
}

func main() {
	// Load configuration
	cfg, err := config.LoadConfig("configs/config.yaml") // Assumes running from root
	if err != nil {
		// Fallback or panic
		log.Println("Failed to load config, using defaults or panicking:", err)
		// For simplicity, we might just panic if config is critical, or creating a default one
		// Assuming config is required for components
		panic(err)
	}

	hub := newHub()
	go hub.run()

	srv := &Server{
		cfg: cfg,
		hub: hub,
	}

	http.HandleFunc("/api/scrape", srv.handleScrape)
	http.HandleFunc("/api/ws", srv.handleWS)

	logger.Info("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func (s *Server) handleWS(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	s.hub.register <- ws
}

func (s *Server) handleScrape(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ScrapeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	logger.Info("Received scrape request for", len(req.URLs), "URLs")

	// Start scraping in background
	go s.runScraper(req.URLs)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "started"})
}

func (s *Server) runScraper(urls []string) {
	// Initialize components
	f := fetcher.NewFetcher(s.cfg.Scraper.TimeoutSec, s.cfg.Scraper.UserAgent)
	p := parser.NewParser()
	rl := limiter.NewRateLimiter(s.cfg.Scraper.RateLimitSec) // Using configured rate limit
	defer rl.Stop()

	// Use a worker pool
	pool := worker.NewPool(s.cfg.Scraper.WorkerCount, f, p, rl)
	pool.Start()

	// Feed URLs
	go func() {
		for _, url := range urls {
			pool.AddJob(url)
		}
		// Close pool when all jobs added?
		// No, pool.Close() closes the jobs channel.
		// BUT if we close jobs channel immediately after adding, workers process them and then exit.
		// This is correct.
		pool.Close()
	}()

	// Collect and broadcast results
	for result := range pool.Results() {
		// Broadcast result to WebSocket
		s.hub.broadcast <- result
	}

	// When pool is done, maybe send a "complete" message?
	// For live feed, result with status is enough.
}
