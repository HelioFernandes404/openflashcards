package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// MaxBodySize bounds every request body to maxBytes before the Gin JSON
// decoder (or any other body reader) buffers it into memory. Without this,
// a single large request to any JSON endpoint can exhaust process memory
// and crash the API for all concurrent users. Handlers that legitimately
// need a larger body (e.g. media upload) set their own, more permissive
// http.MaxBytesReader after this middleware runs.
func MaxBodySize(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	}
}
