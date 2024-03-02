import { db } from "db";
import { usersToGames } from "db/schema/games";
import { gamesOnPlaylists } from "db/schema/playlists";
import { eq, and } from "drizzle-orm";

export const playlistProgress = async (userId: string, playlistId: string) => {
	const collectionData = await db
		.select()
		.from(gamesOnPlaylists)
		.leftJoin(usersToGames, eq(gamesOnPlaylists.gameId, usersToGames.gameId))
		.where(
			and(
				eq(gamesOnPlaylists.playlistId, playlistId),
				eq(usersToGames.userId, userId),
			),
		);

	let inCollectionCount = 0;
	let playedCount = 0;
	let completedCount = 0;
	for (const result of collectionData) {
		if (result.users_to_games) {
			inCollectionCount += 1;
			if (result.users_to_games.played) {
				playedCount += 1;
			}
			if (result.users_to_games.completed) {
				completedCount += 1;
			}
		}
	}

	return {
		inCollectionCount,
		playedCount,
		completedCount,
	};
};
