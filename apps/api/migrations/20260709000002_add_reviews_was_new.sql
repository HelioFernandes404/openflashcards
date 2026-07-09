-- Track whether a card was in the "new" state before the review that
-- created this row, instead of inferring "is this a new-card review" from
-- elapsed_days = 0 (which also matches same-day learning/relearning steps).
ALTER TABLE reviews ADD COLUMN was_new BOOLEAN NOT NULL DEFAULT false;
