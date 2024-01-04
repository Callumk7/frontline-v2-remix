import { db } from "db"
import { genres, genresToGames } from "db/schema/games"
import { eq, inArray } from "drizzle-orm"

// Genre and Count
export async function getGenresAndCount(userCollectionIds: number[]) {
	const getAllGenres = await db.query.genresToGames.findMany({
		where: inArray(genresToGames.gameId, userCollectionIds)
	})

	console.log(getAllGenres);
	return getAllGenres;
}

export async function getAllGenres() {
	const allGenres = await db.select().from(genres);
	return allGenres;
}
