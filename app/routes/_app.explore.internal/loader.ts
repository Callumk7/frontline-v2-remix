import { db } from "db";
import { covers, games, genres, genresToGames } from "db/schema/games";
import { SQL, and, eq } from "drizzle-orm";

export const getSearchResultsFromDb = async (conditions: SQL<unknown>[]) => {
	const searchResults = await db
		.select()
		.from(genresToGames)
		.innerJoin(genres, eq(genresToGames.genreId, genres.id))
		.innerJoin(games, eq(games.gameId, genresToGames.gameId))
		.leftJoin(covers, eq(games.gameId, covers.gameId))
		.where(and(...conditions))
		.limit(150)
		.orderBy(games.rating, games.externalFollows);

	const uniqueGames = searchResults.filter(
		(res, i, self) => i === self.findIndex((t) => t.games.id === res.games.id),
	);

	return uniqueGames;
}
