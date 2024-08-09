import { UserCollectionWithFullDetails } from "@/types";
import { db } from "db";
import { genres, genresToGames, usersToGames } from "db/schema/games";
import { playlists } from "db/schema/playlists";
import { eq, inArray } from "drizzle-orm";

export const getUserGamesWithDetails = async (
	userId: string,
): Promise<UserCollectionWithFullDetails[]> => {
	const userCollection = await db.query.usersToGames.findMany({
		where: eq(usersToGames.userId, userId),
		with: {
			game: {
				with: {
					cover: true,
					playlists: {
						with: {
							playlist: true,
						},
					},
					screenshots: true,
					artworks: true,
					genres: {
						with: {
							genre: true,
						},
					},
				},
			},
		},
	});

	return userCollection;
};

export const getUserPlaylists = async (userId: string) => {
	const userPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
	});

	return userPlaylists;
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

export async function getCollectionData(userId: string) {
	const userCollectionPromise = getUserGamesWithDetails(userId);
	const userPlaylistsPromise = getUserPlaylists(userId);
	const allUserGenresPromise = getUserGenres(userId);

	const [userCollection, userPlaylists, userGenres] = await Promise.all([
		userCollectionPromise,
		userPlaylistsPromise,
		allUserGenresPromise,
	]);

	return {
		userCollection,
		userPlaylists,
		userGenres,
	};
}
