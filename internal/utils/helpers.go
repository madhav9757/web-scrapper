package utils

import (
	"net/url"
)

// IsValidURL checks if a string is a valid URL
func IsValidURL(str string) bool {
	u, err := url.ParseRequestURI(str)
	return err == nil && u.Scheme != "" && u.Host != ""
}
