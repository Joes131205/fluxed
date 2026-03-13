ALTER TABLE "events" DROP CONSTRAINT "events_subarea_id_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_subarea_id_subareas_id_fk" FOREIGN KEY ("subarea_id") REFERENCES "public"."subareas"("id") ON DELETE no action ON UPDATE no action;