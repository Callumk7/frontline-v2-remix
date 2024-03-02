ALTER TABLE "activity" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "note_id" text;