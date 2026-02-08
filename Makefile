BINARY_NAME=scraper

build:
	go build -o bin/${BINARY_NAME} cmd/scraper/main.go

run: build
	./bin/${BINARY_NAME}

clean:
	rm -rf bin/
	rm -rf data/output.json
	rm -rf data/output.csv
	rm -rf logs/*.log

test:
	go test ./...

.PHONY: build run clean test
