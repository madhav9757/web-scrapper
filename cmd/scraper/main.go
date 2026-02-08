package main

import (
	"bufio"
	"flag"
	"os"
	"web-scrapper/internal/config"
	"web-scrapper/internal/fetcher"
	"web-scrapper/internal/limiter"
	"web-scrapper/internal/logger"
	"web-scrapper/internal/models"
	"web-scrapper/internal/parser"
	"web-scrapper/internal/utils"
	"web-scrapper/internal/worker"
	"web-scrapper/internal/writer"
)

func main() {
	configPath := flag.String("config", "configs/config.yaml", "path to config file")
	flag.Parse()

	// Load configuration
	cfg, err := config.LoadConfig(*configPath)
	if err != nil {
		logger.Fatal("Failed to load config:", err)
	}

	logger.Info("Starting Concurrent Web Scraper...")

	// Initialize components
	f := fetcher.NewFetcher(cfg.Scraper.TimeoutSec, cfg.Scraper.UserAgent)
	p := parser.NewParser()
	rl := limiter.NewRateLimiter(cfg.Scraper.RateLimitSec)
	defer rl.Stop()

	pool := worker.NewPool(cfg.Scraper.WorkerCount, f, p, rl)
	pool.Start()

	// Load URLs from file
	go func() {
		file, err := os.Open(cfg.Files.InputFile)
		if err != nil {
			logger.Error("Failed to open input file:", err)
			pool.Close()
			return
		}
		defer file.Close()

		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			url := scanner.Text()
			if url != "" && utils.IsValidURL(url) {
				pool.AddJob(url)
			} else if url != "" {
				logger.Error("Invalid URL skipped:", url)
			}
		}
		pool.Close()
	}()

	// Collect results
	var results []models.ScrapedData
	for result := range pool.Results() {
		results = append(results, result)
	}

	// Write results
	logger.Info("Scraping completed. Writing results...")

	jw := writer.NewJSONWriter(cfg.Files.OutputFile)
	if err := jw.Write(results); err != nil {
		logger.Error("Failed to write JSON:", err)
	}

	cw := writer.NewCSVWriter(cfg.Files.OutputFile)
	if err := cw.Write(results); err != nil {
		logger.Error("Failed to write CSV:", err)
	}

	logger.Info("Done. Saved results to", cfg.Files.OutputFile+".json and", cfg.Files.OutputFile+".csv")
}
