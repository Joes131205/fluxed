CREATE TABLE "actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"subarea_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "actions" ADD CONSTRAINT "actions_subarea_id_subareas_id_fk" FOREIGN KEY ("subarea_id") REFERENCES "public"."subareas"("id") ON DELETE cascade ON UPDATE no action;