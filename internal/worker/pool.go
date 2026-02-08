package worker

import (
	"sync"
	"time"
	"web-scrapper/internal/fetcher"
	"web-scrapper/internal/limiter"
	"web-scrapper/internal/logger"
	"web-scrapper/internal/models"
	"web-scrapper/internal/parser"
)

type Pool struct {
	workerCount int
	jobs        chan models.ScrapeJob
	results     chan models.ScrapedData
	fetcher     *fetcher.Fetcher
	parser      *parser.Parser
	limiter     *limiter.RateLimiter
	wg          sync.WaitGroup
}

func NewPool(workerCount int, f *fetcher.Fetcher, p *parser.Parser, rl *limiter.RateLimiter) *Pool {
	return &Pool{
		workerCount: workerCount,
		jobs:        make(chan models.ScrapeJob, 100),
		results:     make(chan models.ScrapedData, 100),
		fetcher:     f,
		parser:      p,
		limiter:     rl,
	}
}

func (p *Pool) Start() {
	for i := 0; i < p.workerCount; i++ {
		p.wg.Add(1)
		go p.worker(i)
	}
}

func (p *Pool) worker(id int) {
	defer p.wg.Done()
	logger.Info("Worker started", id)

	for job := range p.jobs {
		p.limiter.Wait()
		logger.Info("Worker", id, "scraping", job.URL)

		p.results <- models.ScrapedData{
			URL:       job.URL,
			ScrapedAt: time.Now(),
			Status:    "scraping",
		}

		resp, err := p.fetcher.Fetch(job.URL)
		if err != nil {
			logger.Error("Worker", id, "failed to fetch", job.URL, ":", err)
			p.results <- models.ScrapedData{
				URL:       job.URL,
				ScrapedAt: time.Now(),
				Status:    "error",
				Error:     err.Error(),
			}
			continue
		}

		data, err := p.parser.Parse(job.URL, resp.Body)
		resp.Body.Close()
		if err != nil {
			logger.Error("Worker", id, "failed to parse", job.URL, ":", err)
			p.results <- models.ScrapedData{
				URL:       job.URL,
				ScrapedAt: time.Now(),
				Status:    "error",
				Error:     err.Error(),
			}
			continue
		}

		data.Status = "success"
		p.results <- *data
	}
}

func (p *Pool) AddJob(url string) {
	p.jobs <- models.ScrapeJob{URL: url}
}

func (p *Pool) Close() {
	close(p.jobs)
	p.wg.Wait()
	close(p.results)
}

func (p *Pool) Results() <-chan models.ScrapedData {
	return p.results
}
