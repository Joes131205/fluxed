ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "refresh_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "events" CASCADE;--> statement-breakpoint
DROP TABLE "refresh_tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_refresh_token" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_id" varchar(256);