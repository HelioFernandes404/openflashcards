#!/bin/bash
# Script to test whether the PostgreSQL extensions were installed correctly

set -e

echo "🔍 Testing PostgreSQL extensions for postgres-mcp..."
echo ""

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

# Test connection and list installed extensions
docker exec openflaskcards-db psql -U openflaskcards -d openflaskcards -c "
SELECT
    extname as \"Extension\",
    extversion as \"Version\",
    CASE
        WHEN extname = 'pg_stat_statements' THEN '✓ Query tracking active'
        WHEN extname = 'hypopg' THEN '✓ Hypothetical indexes available'
        ELSE 'Installed'
    END as \"Status\"
FROM pg_extension
WHERE extname IN ('pg_stat_statements', 'hypopg', 'plpgsql')
ORDER BY extname;
"

echo ""
echo "📊 Checking pg_stat_statements..."
docker exec openflaskcards-db psql -U openflaskcards -d openflaskcards -c "
SELECT
    count(*) as total_queries_tracked,
    count(DISTINCT userid) as total_users,
    count(DISTINCT dbid) as total_databases
FROM pg_stat_statements;
"

echo ""
echo "⚙️  pg_stat_statements configuration:"
docker exec openflaskcards-db psql -U openflaskcards -d openflaskcards -c "
SHOW shared_preload_libraries;
SHOW pg_stat_statements.track;
"

echo ""
echo "✅ Test complete!"
echo ""
echo "📝 Notes:"
echo "  - pg_stat_statements: should be installed and active"
echo "  - hypopg: optional, not available in postgres:17-alpine by default"
echo "  - postgres-mcp works fine with just pg_stat_statements"
