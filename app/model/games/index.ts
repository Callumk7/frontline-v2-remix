import { db } from "db";
import { games } from "db/schema/games";
import { eq } from "drizzle-orm";

export const getCompleteGame = async (gameId: number) => {
	const gameData = await db.query.games.findFirst({
		where: eq(games.gameId, gameId),
		with: {
			cover: true,
			screenshots: true,
			artworks: true,
			genres: {
				with: {
					genre: true,
				},
			},
		},
	});

	return gameData;
};
