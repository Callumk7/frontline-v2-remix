import { db } from "db";
import { notes } from "db/schema/notes";
import { and, eq } from "drizzle-orm";

export const getGameComments = async (gameId: number) => {
	const gameComments = await db.query.notes.findMany({
		where: and(eq(notes.location, "game"), eq(notes.gameId, gameId)),
		with: {
			author: true,
		},
	});

	return gameComments;
};
