# 📡 Concurrent Web Scraper in Go

A high-performance concurrent web scraper built with Golang that extracts structured data from multiple websites simultaneously. It uses Go's concurrency model (goroutines and channels) to handle parallel tasks efficiently while maintaining safety with rate limiting and robust error handling.

## 🚀 Features

- **Concurrent Scraping**: Parallel execution using worker pools.
- **Rate Limiting**: Prevent IP bans and server overload.
- **Data Extraction**: Extracts Title, Meta Description, Headings (H1, H2), and Link Count.
- **Multiple Formats**: Saves data in JSON and CSV.
- **Robust Logging**: Separate logs for info and errors.
- **Configurable**: Easily adjust settings via `config.yaml`.

## 🛠️ Tech Stack

- **Language**: Go (Golang)
- **HTML Parsing**: [goquery](https://github.com/PuerkitoBio/goquery)
- **Configuration**: YAML
- **Output**: JSON, CSV

## 📂 Project Structure

```text
.
├── cmd/scraper/        # Main entry point
├── internal/
│   ├── config/        # Configuration management
│   ├── fetcher/       # HTTP client and fetching logic
│   ├── parser/        # HTML parsing with goquery
│   ├── worker/        # Worker pool implementation
│   ├── limiter/       # Rate limiting logic
│   ├── writer/        # JSON and CSV output writers
│   ├── models/        # Data structures
│   ├── logger/        # Logging system
│   └── utils/         # Helper functions
├── configs/           # Configuration files
├── data/              # Input URLs and Output results
└── logs/              # Log files
```

## ⚙️ Configuration

Modify `configs/config.yaml` to adjust the scraper settings:

```yaml
scraper:
  worker_count: 5
  rate_limit_sec: 2
  timeout_sec: 10
  max_retries: 3
  user_agent: "..."
files:
  input_file: "data/input_urls.txt"
  output_file: "data/output"
```

## 🏃 Getting Started

### Prerequisites

- Go 1.21+

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd concurrent-web-scraper
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```

### Running the Scraper

Use the Makefile for easy execution:

```bash
make run
```

Or run directly:

```bash
go run cmd/scraper/main.go
```

## 📊 Example Output

The scraper generates `data/output.json` and `data/output.csv`:

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples",
  "links": 1,
  "scraped_at": "2026-02-08T10:30:00Z"
}
```

## 🛡️ License

MIT License
