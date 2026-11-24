-- Named counters. The visitor counter lives here because D1 can add one atomically;
-- in KV it was read, incremented and written back, which loses concurrent visits.
CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);
