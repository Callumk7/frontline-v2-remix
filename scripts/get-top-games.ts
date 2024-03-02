// we are going to get the top rated games from IGDB, with an offset, and write them to the database
// we will also want to get a cache available for the games that we already have in the db. This
// doesn't really need to be a full featured solution yet, as this script is going to be run ad-hoc
// when needed.

import { IGDB_BASE_URL, WORKER_URL } from "@/constants";
import { fetchGamesFromIGDB } from "@/services";
import { IGDBGameSchemaArray } from "@/types/igdb";
import { db } from "db";
import { games } from "db/schema/games";

async function getAllGamesFromDb(): Promise<number[]> {
	const allGames = await db
		.select({
			id: games.gameId,
		})
		.from(games);

	const gameIds = allGames.map((game) => game.id);
	return gameIds;
}

// This is the cache
const gameIds = await getAllGamesFromDb();

// Now we get all the games and game data that we want
for (let i = 0; i < 20; i++) {
	const games = await fetchGamesFromIGDB(IGDB_BASE_URL, {
		fields: "full",
		limit: 500,
		sort: ["rating desc"],
		offset: i * 500,
		filters: ["follows > 7", "cover != null"],
	});

	const parsedGames = IGDBGameSchemaArray.parse(games);

	// filter out games that we already have..
	const filteredGames = parsedGames.filter((game) => !gameIds.includes(game.id));
	console.log(parsedGames.length - filteredGames.length);
	console.log("..games removed from the fetch");

	if (filteredGames.length === 0) {
		console.log("Looks like we have all these ones chief.. skipping");
		continue
	}

	// send the game to the worker
	fetch(`${WORKER_URL}/games`, {
		method: "POST",
		body: JSON.stringify(filteredGames)
	})
		.then((res) => {
			if (res.ok) {
				console.log("This batch was a success");
			} else {
				console.error("This batch failed");
			}
		})
		.catch((e) => console.error(e));
}
