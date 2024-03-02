CREATE TABLE IF NOT EXISTS "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags_to_playlists" (
	"tag_id" text NOT NULL,
	"playlist_id" text NOT NULL,
	CONSTRAINT "tags_to_playlists_tag_id_playlist_id_pk" PRIMARY KEY("tag_id","playlist_id")
);
