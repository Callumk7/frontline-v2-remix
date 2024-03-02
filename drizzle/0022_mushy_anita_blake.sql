ALTER TYPE "parent_type" ADD VALUE 'note';--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "note_id" text;