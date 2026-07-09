-- name: CreateRefreshToken :one
INSERT INTO refresh_tokens (user_id, token_hash, expires_at, device_info)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetRefreshTokenByHash :one
SELECT * FROM refresh_tokens WHERE token_hash = $1;

-- name: TouchRefreshToken :exec
UPDATE refresh_tokens SET last_used_at = NOW() WHERE id = $1;

-- name: DeleteRefreshToken :exec
DELETE FROM refresh_tokens WHERE token_hash = $1;

-- name: DeleteRefreshTokenReturning :one
-- Atomically redeems a refresh token: deletes it and returns the deleted
-- row. Callers must treat pgx.ErrNoRows as "already used or never existed"
-- so two concurrent redemptions of the same token can't both succeed (the
-- second DELETE affects zero rows instead of silently no-op'ing).
DELETE FROM refresh_tokens WHERE token_hash = $1 RETURNING *;

-- name: DeleteAllRefreshTokensForUser :exec
DELETE FROM refresh_tokens WHERE user_id = $1;

-- name: DeleteExpiredRefreshTokens :exec
DELETE FROM refresh_tokens WHERE expires_at < NOW();
