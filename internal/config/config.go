package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Scraper struct {
		WorkerCount  int    `yaml:"worker_count"`
		RateLimitSec int    `yaml:"rate_limit_sec"`
		TimeoutSec   int    `yaml:"timeout_sec"`
		MaxRetries   int    `yaml:"max_retries"`
		UserAgent    string `yaml:"user_agent"`
	} `yaml:"scraper"`
	Files struct {
		InputFile  string `yaml:"input_file"`
		OutputFile string `yaml:"output_file"`
	} `yaml:"files"`
}

func LoadConfig(path string) (*Config, error) {
	config := &Config{}
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	d := yaml.NewDecoder(file)
	if err := d.Decode(&config); err != nil {
		return nil, err
	}

	return config, nil
}
