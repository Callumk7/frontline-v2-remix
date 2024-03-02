import { Genre } from "@/types/games";
import { db } from "db";
import { genres, genresToGames, usersToGames } from "db/schema/games";
import { eq, inArray } from "drizzle-orm";

// Genre and Count
export const getGenresAndCount = async (userCollectionIds: number[]) => {
	const getAllGenres = await db.query.genresToGames.findMany({
		where: inArray(genresToGames.gameId, userCollectionIds),
	});

	console.log(getAllGenres);
	return getAllGenres;
};

export const getAllGenres = async () => {
	const allGenres = await db.selectDistinct().from(genres);
	return allGenres;
};

export const genresToStrings = (genres: Genre[]): string[] => {
	return genres.map((genre) => genre.name);
};

export const getUserGenres = async (userId: string) => {
	const userGames = await db
		.select()
		.from(usersToGames)
		.where(eq(usersToGames.userId, userId));

	const gameIds = userGames.map((entry) => entry.gameId);

	// inArray requires atleast one value. new users will have no gameIds
	if (gameIds.length > 0) {
		const userGenresQueryArray = await db
			.selectDistinctOn([genresToGames.genreId])
			.from(genresToGames)
			.where(inArray(genresToGames.gameId, gameIds))
			.rightJoin(genres, eq(genresToGames.genreId, genres.id));

		const userGenres = userGenresQueryArray
			.filter((q) => q.genres !== null)
			.map((q) => q.genres);

		return userGenres;
	}

	return [];
};
