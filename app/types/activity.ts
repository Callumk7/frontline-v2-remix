import { activity } from "db/schema/activity";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Game, Playlist, User, UserWithActivity } from ".";
import { Note } from "./notes";

export const activityInsertSchema = createInsertSchema(activity);
export const activitySelectScema = createSelectSchema(activity);

export type Activity = z.infer<typeof activitySelectScema>;
export type InsertActivity = z.infer<typeof activityInsertSchema>;

export type ActivityWithDetails = Activity & {
	game: Game | null;
	playlist: Playlist | null;
	note: Note | null;
	user: User;
};

export type ActivityFeedEntry = UserWithActivity & {
	activity: ActivityWithDetails[];
};
