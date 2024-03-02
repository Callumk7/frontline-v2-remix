DO $$ BEGIN
 CREATE TYPE "activity_type" AS ENUM('pl_create', 'pl_add_game', 'pl_remove_game', 'pl_follow', 'col_add', 'col_remove', 'comment_add', 'game_played', 'game_completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "activity_type" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" text,
	"playlist_id" text,
	"game_id" integer,
	"comment_id" text
);
