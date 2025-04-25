CREATE TABLE IF NOT EXISTS "events" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "start_time" TIMESTAMP NOT NULL,
  "end_time" TIMESTAMP NOT NULL,
  "created_by" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "event_type" TEXT NOT NULL,
  "is_public" BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS "events_created_by_idx" ON "events" ("created_by");
CREATE INDEX IF NOT EXISTS "events_start_time_idx" ON "events" ("start_time");
CREATE INDEX IF NOT EXISTS "events_event_type_idx" ON "events" ("event_type");