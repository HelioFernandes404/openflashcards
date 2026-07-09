// Package pagination provides shared defaults and parsing for page/pageSize
// query parameters used by list endpoints.
package pagination

import "strconv"

const (
	// DefaultPageSize is used when the caller does not specify a pageSize.
	DefaultPageSize = 50
	// MaxPageSize caps how many rows a single page can return, regardless of
	// what the caller requests, to bound memory/payload size per request.
	MaxPageSize = 200
	// DefaultPage is the first page when the caller does not specify one.
	DefaultPage = 1
)

// Params carries the SQL-ready LIMIT/OFFSET values for a page request.
type Params struct {
	Limit  int32
	Offset int32
}

// Parse turns 1-based page/pageSize strings (typically read from query
// params) into LIMIT/OFFSET values. Invalid, missing, or out-of-range values
// fall back to sane defaults instead of erroring, since pagination inputs are
// advisory, not required.
func Parse(pageStr, pageSizeStr string) Params {
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = DefaultPage
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = DefaultPageSize
	}
	if pageSize > MaxPageSize {
		pageSize = MaxPageSize
	}

	return Params{
		Limit:  int32(pageSize),
		Offset: int32((page - 1) * pageSize),
	}
}
