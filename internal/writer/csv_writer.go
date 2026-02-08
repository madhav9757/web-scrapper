package writer

import (
	"encoding/csv"
	"os"
	"strconv"
	"strings"
	"web-scrapper/internal/models"
)

type CSVWriter struct {
	FilePath string
}

func NewCSVWriter(path string) *CSVWriter {
	if !strings.HasSuffix(path, ".csv") {
		path += ".csv"
	}
	return &CSVWriter{FilePath: path}
}

func (cw *CSVWriter) Write(data []models.ScrapedData) error {
	file, err := os.Create(cw.FilePath)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write header
	header := []string{"URL", "Title", "Description", "H1s", "H2s", "Links", "ScrapedAt"}
	if err := writer.Write(header); err != nil {
		return err
	}

	for _, d := range data {
		row := []string{
			d.URL,
			d.Title,
			d.MetaDescription,
			strings.Join(d.Headings.H1, " | "),
			strings.Join(d.Headings.H2, " | "),
			strconv.Itoa(d.LinksCount),
			d.ScrapedAt.Format("2006-01-02 15:04:05"),
		}
		if err := writer.Write(row); err != nil {
			return err
		}
	}

	return nil
}
