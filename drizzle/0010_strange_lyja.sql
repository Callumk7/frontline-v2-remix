DO $$ BEGIN
 CREATE TYPE "parent_type" AS ENUM('collection', 'playlist', 'profile');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"location" "parent_type",
	"collection_id" text,
	"game_id" integer,
	"playlist_id" text,
	"profile_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_updated" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "users_to_games" DROP CONSTRAINT "users_to_games_user_id_game_id";--> statement-breakpoint
ALTER TABLE "games_on_playlists" DROP CONSTRAINT "games_on_playlists_game_id_playlist_id";--> statement-breakpoint
ALTER TABLE "friends" DROP CONSTRAINT "friends_user_id_friend_id";--> statement-breakpoint
ALTER TABLE "users_to_games" ADD CONSTRAINT "users_to_games_user_id_game_id_pk" PRIMARY KEY("user_id","game_id");--> statement-breakpoint
ALTER TABLE "games_on_playlists" ADD CONSTRAINT "games_on_playlists_game_id_playlist_id_pk" PRIMARY KEY("game_id","playlist_id");--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_friend_id_pk" PRIMARY KEY("user_id","friend_id");
