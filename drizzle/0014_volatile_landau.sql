CREATE TABLE IF NOT EXISTS "playlist_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"playlist_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false
);
