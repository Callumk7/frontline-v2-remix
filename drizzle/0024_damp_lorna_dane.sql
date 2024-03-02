DO $$ BEGIN
 CREATE TYPE "played_status" AS ENUM('not_started', 'played', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_to_games" ADD COLUMN "played_status" "played_status" DEFAULT 'not_started' NOT NULL;