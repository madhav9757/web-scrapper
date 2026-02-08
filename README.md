# 📡 Concurrent Web Scraper in Go

<div align="center">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Concurrency-Parallel-blue?style=for-the-badge" alt="Concurrency" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</div>

---

## 📌 About

The **Concurrent Web Scraper** is a high-performance backend application written in **Go (Golang)** that extracts structured data from multiple websites in parallel. It leverages Go’s powerful concurrency model (goroutines, channels, and worker pools) to efficiently scrape large sets of URLs while maintaining rate limiting, fault tolerance, and clean error handling.

The project is designed with a **modular and scalable architecture**, making it easy to extend, test, and maintain. Scraped data can be exported in **JSON and CSV** formats, enabling seamless integration with analytics tools, databases, or other services.

This project demonstrates real-world backend engineering concepts such as **concurrent system design, network programming, synchronization, and resilient data processing**, and serves as a practical example of building production-ready tools in Go.

## 🔑 Key Highlights

- 🚀 **Concurrent Scraping**: Leveraging goroutines and channels for high-speed execution.
- 🏗️ **Worker Pool Pattern**: Efficiently managed concurrency with a fixed or dynamic worker set.
- 🛑 **Rate Limiting**: Integrated throttling to prevent server overload and IP bans.
- 🛡️ **Robust Error Handling**: Sophisticated logging and failure recovery for network operations.
- 📊 **Structured Data Export**: Cleanly formatted output in both JSON and CSV formats.
- ✨ **Clean Architecture**: Modular design following production-grade Go standards.

## 🎯 Purpose

This project was built to:

- 🎓 **Learn and Apply**: Mastering Go concurrency patterns (Worker Pools, Fan-in/Fan-out).
- 🏗️ **Architectural Design**: Understanding how to build scalable and maintainable backend systems.
- 🛠️ **Practical Engineering**: Practicing production-grade error handling and I/O operations.
- 📁 **Portfolio Builder**: A strong backend project demonstrating proficiency in Go for professional roles.

## 🚀 Features

- **Parallel execution** using sophisticated worker pools.
- **Customizable rate limiting** to respect target server constraints.
- **Deep Data Extraction**: Captures Title, Meta Description, Headings (H1, H2), and Link Count.
- **Dual Format Support**: Automated export to JSON and CSV.
- **Config-Driven**: Full control via `config.yaml` without changing code.

## 🛠️ Tech Stack

- **Language**: [Go (Golang)](https://golang.org/)
- **HTML Parsing**: [goquery](https://github.com/PuerkitoBio/goquery)
- **Configuration**: YAML (Viper style)
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
  user_agent: "ConcurrentScraper/1.0"
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
