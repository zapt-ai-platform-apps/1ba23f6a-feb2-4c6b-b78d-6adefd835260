CREATE TABLE IF NOT EXISTS "matches" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "opponent" TEXT NOT NULL,
  "match_date" TIMESTAMP NOT NULL,
  "match_result" TEXT,
  "our_score" INTEGER,
  "opponent_score" INTEGER,
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "recorded_by" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "matches_match_date_idx" ON "matches" ("match_date");
CREATE INDEX IF NOT EXISTS "matches_recorded_by_idx" ON "matches" ("recorded_by");