ALTER TABLE "users" ADD COLUMN "start_time" time DEFAULT '09:00:00' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "end_time" time DEFAULT '24:00:00' NOT NULL;