import { db } from "db";
import { games, usersToGames } from "db/schema/games";
import { gamesOnPlaylists } from "db/schema/playlists";
import { count, desc, inArray } from "drizzle-orm";

interface GameCount {
	gameId: number;
	count: number;
}

// Get games from the database that are popular based on the number
// of playlists that they are in. Returns gameId and count
export const getPopularGamesByPlaylist = async (): Promise<GameCount[]> => {
	// games that are in the most playlists
	const popularGamesByPlaylist = await db
		.select({
			gameId: gamesOnPlaylists.gameId,
			count: count(gamesOnPlaylists.gameId),
		})
		.from(gamesOnPlaylists)
		.groupBy(gamesOnPlaylists.gameId)
		.orderBy(desc(count(gamesOnPlaylists.gameId)))
		.limit(75);

	return popularGamesByPlaylist;
};

// Get games from the database that are popular based on the number
// of collections that they are in. Returns gameId and count
export const getPopularGamesByCollection = async (): Promise<GameCount[]> => {
	const popularGamesByCollection = await db
		.select({
			gameId: usersToGames.gameId,
			count: count(usersToGames.gameId),
		})
		.from(usersToGames)
		.groupBy(usersToGames.gameId)
		.orderBy(desc(count(usersToGames.gameId)))
		.limit(75);

	return popularGamesByCollection;
};

export const combinePopularGameData = async ({
	popularGamesByPlaylist,
	popularGamesByCollection,
}: {
	popularGamesByPlaylist: GameCount[];
	popularGamesByCollection: GameCount[];
}): Promise<
	{
		id: string;
		createdAt: Date;
		updatedAt: Date;
		isUpdated: boolean | null;
		gameId: number;
		title: string;
		follows: number;
		storyline: string | null;
		firstReleaseDate: Date | null;
		externalFollows: number | null;
		rating: number | null;
		aggregatedRating: number | null;
		aggregatedRatingCount: number | null;
		cover: {
			id: string;
			createdAt: Date;
			updatedAt: Date;
			isUpdated: boolean | null;
			gameId: number;
			imageId: string;
		};
		collectionCount: number;
		playlistCount: number;
	}[]
> => {
	// create maps for fast lookup
	const collectionMap = new Map();
	popularGamesByCollection.forEach((entry) => {
		collectionMap.set(entry.gameId, entry.count);
	});

	const playlistMap = new Map();
	popularGamesByPlaylist.forEach((entry) => {
		playlistMap.set(entry.gameId, entry.count);
	});

	// Each entry of a set must be unique. We create a set of gameIds
	const gameIds = new Set<number>();
	popularGamesByCollection.forEach((data) => gameIds.add(data.gameId));
	popularGamesByPlaylist.forEach((data) => gameIds.add(data.gameId));

	// Now we need to get the rest of the game data from the database
	const gameIdArray = [...gameIds];
	const gameData = await db.query.games.findMany({
		where: inArray(games.gameId, gameIdArray),
		with: {
			cover: true,
		},
	});

	const processedData = gameData
		.filter((data) => collectionMap.has(data.gameId) && playlistMap.has(data.gameId))
		.map((data) => {
			const collectionCount = collectionMap.get(data.gameId);
			const playlistCount = playlistMap.get(data.gameId);
			return {
				collectionCount,
				playlistCount,
				...data,
			};
		});

	// sort by collection count
	processedData.sort(
		(a, b) =>
			(b.collectionCount ? b.collectionCount : 0) -
			(a.collectionCount ? a.collectionCount : 0),
	);

	return processedData;
};
