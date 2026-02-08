<div align="center">
  <img src="static/assets/banner.svg" alt="Concurrent Web Scraper Banner" width="800" />
</div>

<h1 align="center">📡 Concurrent Web Scraper</h1>

<div align="center">
  <p align="center">
    <strong>A high-performance, parallel data extraction engine built in Go.</strong>
  </p>
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go" />
  <img src="https://img.shields.io/badge/Concurrency-Parallel-blue?style=for-the-badge" alt="Concurrency" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</div>

<br />

---

## � Overview

<blockquote>
  The <b>Concurrent Web Scraper</b> is a high-performance backend application written in <b>Go (Golang)</b> that extracts structured data from multiple websites in parallel. By leveraging Go’s powerful concurrency model—specifically goroutines, channels, and worker pools—it efficiently processes large volumes of URLs while maintaining strict rate limiting, fault tolerance, and elegant error handling.
</blockquote>

<br />

## 🔑 Key Highlights

<div align="center">
<table border="0">
  <tr>
    <td align="center" width="200">
      <img src="static/readme/crawler.svg" width="60" />
      <br />
      <strong>Concurrent Scraping</strong>
      <br />
      <small>Parallel execution for max throughput</small>
    </td>
    <td align="center" width="200">
      <img src="static/readme/go.svg" width="60" />
      <br />
      <strong>Go Runtime</strong>
      <br />
      <small>Native performance & safety</small>
    </td>
    <td align="center" width="200">
      <img src="static/readme/concurrency.svg" width="60" />
      <br />
      <strong>Worker Pools</strong>
      <br />
      <small>Efficient resource management</small>
    </td>
    <td align="center" width="200">
      <img src="static/readme/data.svg" width="60" />
      <br />
      <strong>Data Export</strong>
      <br />
      <small>Export to JSON & CSV formats</small>
    </td>
  </tr>
</table>
</div>

<br />

## ✨ Core Features

| Feature                  | Description                                                         |
| :----------------------- | :------------------------------------------------------------------ |
| 🚀 **High Speed**        | Leveraging goroutines and channels for high-speed execution.        |
| 🏗️ **Smart Patterns**    | Efficiently managed concurrency with a fixed or dynamic worker set. |
| 🛑 **Rate Limiting**     | Integrated throttling to prevent server overload and IP bans.       |
| 🛡️ **Fault Tolerant**    | Sophisticated logging and failure recovery for network operations.  |
| 📊 **Structured Output** | Cleanly formatted output in both JSON and CSV formats.              |
| ✨ **Clean Code**        | Modular design following production-grade Go standards.             |

<br />

## 🎯 Project Purpose

This project serve as a practical demonstration of:

- [x] **Mastering Concurrency**: Implementing advanced patterns like Worker Pools and Fan-in/Fan-out.
- [x] **Scalable Architecture**: Building systems that remain maintainable as complexity grows.
- [x] **Production Resilience**: Practicing robust error handling and network I/O optimization.
- [x] **Professional Portfolio**: A tangible example of backend engineering proficiency in Go.

<br />

## �️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Language-Go-00ADD8?style=flat-square&logo=go" />
  <img src="https://img.shields.io/badge/Parser-goquery-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Config-YAML-lightgrey?style=flat-square" />
  <img src="https://img.shields.io/badge/Output-JSON%2FCSV-yellow?style=flat-square" />
</div>

<br />

## 📂 Project Structure

```text
.
├── cmd/scraper/        # Main entry point (Main logic)
├── internal/
│   ├── config/        # Environment & YAML management
│   ├── fetcher/       # Resilient HTTP client logic
│   ├── parser/        # HTML node selection with goquery
│   ├── worker/        # Goroutine worker pool logic
│   ├── limiter/       # Token bucket rate limiting
│   ├── writer/        # Flexible export engines
│   ├── models/        # Shared data structures
│   ├── logger/        # Structured logging system
│   └── utils/         # Performance helpers
├── configs/           # Scraper settings (config.yaml)
├── data/              # Input feeds and Exported datasets
└── logs/              # Operational audit logs
```

<br />

<details>
<summary><b>⚙️ Configuration (Advanced Settings)</b></summary>

Modify `configs/config.yaml` to adjust the scraper behavior:

```yaml
scraper:
  worker_count: 5 # Number of parallel workers
  rate_limit_sec: 2 # Delay between requests
  timeout_sec: 10 # Network timeout
  max_retries: 3 # Failure retry logic
  user_agent: "ConcurrentScraper/1.0"
files:
  input_file: "data/input_urls.txt"
  output_file: "data/output"
```

</details>

<br />

## 🏃 Quick Start

### 1. Installation

```bash
git clone <repo-url>
cd concurrent-web-scraper
go mod tidy
```

### 2. Execution

Run using the optimized build script:

```bash
make run
```

<p align="center"><i>- or -</i></p>
<samp>go run cmd/scraper/main.go</samp>

<br />

## 📊 Sample Result

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "Illustrative example domain for documentation",
  "links": 1,
  "scraped_at": "2026-02-08T10:30:00Z"
}
```

<br />

---

<div align="center">
  <img src="static/stickers/gopher.svg" width="150" />
  <br />
  <sub>Built with ❤️ and Go Concurrency</sub>
  <br />
  <img src="static/stickers/robot.svg" width="40" />
</div>

<p align="center">
  Licensed under <a href="LICENSE">MIT</a>
</p>
