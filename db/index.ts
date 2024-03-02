import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as gamesSchema from "./schema/games";
import * as usersSchema from "./schema/users";
import * as playlistsSchema from "./schema/playlists";
import * as activitySchema from "./schema/activity";
import * as notesSchema from "./schema/notes";

const pg = postgres(process.env.DATABASE_URL!);

export const db = drizzle(pg, {
	schema: { ...usersSchema, ...gamesSchema, ...playlistsSchema, ...activitySchema, ...notesSchema },
});

export type DB = typeof db;
