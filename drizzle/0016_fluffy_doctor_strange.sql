ALTER TYPE "activity_type" ADD VALUE 'game_rated';--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "rating" integer;