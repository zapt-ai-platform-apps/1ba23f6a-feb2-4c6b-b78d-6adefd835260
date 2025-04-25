CREATE TABLE IF NOT EXISTS "uploads" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "file_url" TEXT NOT NULL,
  "thumbnail_url" TEXT,
  "uploaded_by" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "upload_type" TEXT NOT NULL,
  "size_bytes" BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS "uploads_uploaded_by_idx" ON "uploads" ("uploaded_by");
CREATE INDEX IF NOT EXISTS "uploads_upload_type_idx" ON "uploads" ("upload_type");