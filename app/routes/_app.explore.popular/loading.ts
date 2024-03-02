import { db } from "db";
import { games, usersToGames } from "db/schema/games";
import { avg, count, desc, eq, inArray, isNotNull } from "drizzle-orm";

export const getTopTenByRating = async () => {
	const topGames = await db
		.select({
			gameId: games.gameId,
			avRating: avg(usersToGames.playerRating),
			ratingCount: count(usersToGames.playerRating),
		})
		.from(games)
		.leftJoin(usersToGames, eq(games.gameId, usersToGames.gameId))
		.where(isNotNull(usersToGames.playerRating))
		.groupBy(games.gameId)
		.orderBy(desc(avg(usersToGames.playerRating)))
		.limit(10);

	// get cover data
	const gameIds = topGames.map((game) => game.gameId);
	const gameData = await db.query.games.findMany({
		where: inArray(games.gameId, gameIds),
		with: {
			cover: true,
		},
	});

	const processedData = gameData
		.map((game) => {
			return {
				avRating: topGames.find((g) => g.gameId === game.gameId)!.avRating,
				ratingCount: topGames.find((g) => g.gameId === game.gameId)!.ratingCount,
				...game,
			};
		})
		.sort(
			(a, b) =>
				Number(b.avRating ? b.avRating : 0) - Number(a.avRating ? a.avRating : 0),
		);

	return processedData;
};

export const getTopTenByRatingCount = async () => {
	const topGames = await db
		.select({
			gameId: games.gameId,
			avRating: avg(usersToGames.playerRating),
			ratingCount: count(usersToGames.playerRating),
		})
		.from(games)
		.leftJoin(usersToGames, eq(games.gameId, usersToGames.gameId))
		.where(isNotNull(usersToGames.playerRating))
		.groupBy(games.gameId)
		.orderBy(desc(count(usersToGames.playerRating)))
		.limit(10);

	// get cover data
	const gameIds = topGames.map((game) => game.gameId);
	const gameData = await db.query.games.findMany({
		where: inArray(games.gameId, gameIds),
		with: {
			cover: true,
		},
	});

	const processedData = gameData
		.map((game) => {
			return {
				avRating: topGames.find((g) => g.gameId === game.gameId)!.avRating,
				ratingCount: topGames.find((g) => g.gameId === game.gameId)!.ratingCount,
				...game,
			};
		})
		.sort(
			(a, b) =>
				Number(b.avRating ? b.avRating : 0) - Number(a.avRating ? a.avRating : 0),
		);

	return processedData;
};
