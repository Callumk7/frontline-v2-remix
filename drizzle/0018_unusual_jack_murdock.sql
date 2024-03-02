ALTER TABLE "artworks" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "covers" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "genres_to_games" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "screenshots" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_games" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_comments" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "playlists" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_updated" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "followers" ADD COLUMN "pinned" boolean DEFAULT false NOT NULL;