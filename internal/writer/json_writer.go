package writer

import (
	"encoding/json"
	"os"
	"strings"
	"web-scrapper/internal/models"
)

type JSONWriter struct {
	FilePath string
}

func NewJSONWriter(path string) *JSONWriter {
	if !strings.HasSuffix(path, ".json") {
		path += ".json"
	}
	return &JSONWriter{FilePath: path}
}

func (jw *JSONWriter) Write(data []models.ScrapedData) error {
	file, err := os.Create(jw.FilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	return encoder.Encode(data)
}
