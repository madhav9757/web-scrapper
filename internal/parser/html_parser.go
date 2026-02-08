package parser

import (
	"io"
	"time"

	"web-scrapper/internal/models"

	"github.com/PuerkitoBio/goquery"
)

type Parser struct{}

func NewParser() *Parser {
	return &Parser{}
}

func (p *Parser) Parse(url string, body io.Reader) (*models.ScrapedData, error) {
	doc, err := goquery.NewDocumentFromReader(body)
	if err != nil {
		return nil, err
	}

	data := &models.ScrapedData{
		URL:       url,
		ScrapedAt: time.Now(),
	}

	// Extract Title
	data.Title = doc.Find("title").First().Text()

	// Extract Meta Description
	data.MetaDescription, _ = doc.Find("meta[name='description']").Attr("content")

	// Extract H1 Tags
	doc.Find("h1").Each(func(i int, s *goquery.Selection) {
		data.Headings.H1 = append(data.Headings.H1, s.Text())
	})

	// Extract H2 Tags
	doc.Find("h2").Each(func(i int, s *goquery.Selection) {
		data.Headings.H2 = append(data.Headings.H2, s.Text())
	})

	// Count Links
	data.LinksCount = doc.Find("a").Length()

	return data, nil
}
