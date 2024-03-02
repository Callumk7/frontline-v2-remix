import { WORKER_URL } from "@/constants";
import { db } from "db";
import { covers, games, usersToGames } from "db/schema/games";
import { eq } from "drizzle-orm";

const main = async () => {
	const allCovers = await db
		.select()
		.from(covers)
		.leftJoin(games, eq(covers.gameId, games.gameId));

	const allCollections = await db
		.select()
		.from(usersToGames)
		.leftJoin(games, eq(usersToGames.gameId, games.gameId));

	const problemIds = new Set<number>();

	console.log("Now logging each game from covers that has no game..");
	allCovers.forEach((result) => {
		if (!result.games) {
			console.log(result.covers.gameId);
			problemIds.add(result.covers.gameId);
		}
	});
	console.log("Now logging each game from collections that has no game..");
	allCollections.forEach((result) => {
		if (!result.games) {
			console.log(result.users_to_games.gameId);
			problemIds.add(result.users_to_games.gameId);
		}
	});

	console.log("There are..");
	console.log(problemIds.size);
	console.log("problems");
	console.log("Starting to fetch..");

	problemIds.forEach(async (id) => {
		const res = await fetch(`${WORKER_URL}/games/${id}`, { method: "POST" });
		console.log(id);
		console.log(`STATUS: ${res.status}`);
		console.log(`TEXT: ${res.statusText}`);
	});
};

await main();
