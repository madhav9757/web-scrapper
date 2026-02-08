package limiter

import (
	"time"
)

type RateLimiter struct {
	ticker *time.Ticker
}

func NewRateLimiter(reqPerSec int) *RateLimiter {
	return &RateLimiter{
		ticker: time.NewTicker(time.Second / time.Duration(reqPerSec)),
	}
}

func (rl *RateLimiter) Wait() {
	<-rl.ticker.C
}

func (rl *RateLimiter) Stop() {
	rl.ticker.Stop()
}
