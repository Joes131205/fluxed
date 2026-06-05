ALTER TABLE "areas" ADD COLUMN "description" varchar(256);--> statement-breakpoint
ALTER TABLE "subareas" ADD COLUMN "description" varchar(256);--> statement-breakpoint
ALTER TABLE "planned_sessions" ADD COLUMN "detail" varchar(256);