package models

import "time"

// ScrapedData represents the structured data extracted from a webpage
// ScrapedData represents the structured data extracted from a webpage
type ScrapedData struct {
	URL             string    `json:"url" csv:"url"`
	Title           string    `json:"title" csv:"title"`
	MetaDescription string    `json:"description" csv:"description"`
	Headings        Headings  `json:"headings" csv:"-"` 
	LinksCount      int       `json:"links" csv:"links"`
	ScrapedAt       time.Time `json:"scraped_at" csv:"scraped_at"`
	Status          string    `json:"status" csv:"status"` // pending, scraping, success, error
	Error           string    `json:"error,omitempty" csv:"error"`
}

type Headings struct {
	H1 []string `json:"h1"`
	H2 []string `json:"h2"`
}

// ScrapeJob represents a task for a worker to process
type ScrapeJob struct {
	URL string
}
