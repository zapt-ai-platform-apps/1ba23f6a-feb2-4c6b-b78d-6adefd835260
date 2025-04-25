CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "profile_picture" TEXT DEFAULT NULL,
  "verification_token" TEXT DEFAULT NULL,
  "verification_token_expires" TIMESTAMP DEFAULT NULL,
  "is_verified" BOOLEAN DEFAULT FALSE,
  "is_admin" BOOLEAN DEFAULT FALSE,
  "reset_token" TEXT DEFAULT NULL,
  "reset_token_expires" TIMESTAMP DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_verification_token_idx" ON "users" ("verification_token");
CREATE INDEX IF NOT EXISTS "users_reset_token_idx" ON "users" ("reset_token");