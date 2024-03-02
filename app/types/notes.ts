import { notes } from "db/schema/notes";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { User } from ".";

export const notesSelectSchema = createSelectSchema(notes);
export const notesInsertSchema = createInsertSchema(notes);

export type Note = z.infer<typeof notesSelectSchema>;
export type InsertNote = z.infer<typeof notesInsertSchema>;

export type NoteWithAuthor = Note & {
	author: User;
}

