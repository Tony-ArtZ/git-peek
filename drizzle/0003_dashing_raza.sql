CREATE TABLE "viewCount" (
	"id" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0,
	"lastViewed" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "viewCount" ADD CONSTRAINT "viewCount_id_redirect_id_fk" FOREIGN KEY ("id") REFERENCES "public"."redirect"("id") ON DELETE cascade ON UPDATE no action;