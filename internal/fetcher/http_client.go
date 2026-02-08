package fetcher

import (
	"fmt"
	"net/http"
	"time"

	"web-scrapper/internal/logger"
)

type Fetcher struct {
	client    *http.Client
	userAgent string
}

func NewFetcher(timeoutSec int, userAgent string) *Fetcher {
	return &Fetcher{
		client: &http.Client{
			Timeout: time.Duration(timeoutSec) * time.Second,
		},
		userAgent: userAgent,
	}
}

func (f *Fetcher) Fetch(url string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", f.userAgent)

	resp, err := f.client.Do(req)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to fetch URL %s: %v", url, err))
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		return nil, fmt.Errorf("bad status code: %d", resp.StatusCode)
	}

	return resp, nil
}
