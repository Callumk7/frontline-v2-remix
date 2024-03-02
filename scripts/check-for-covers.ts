// Need to find out which games have no cover and either find it, or delete it

import { WORKER_URL } from "@/constants";
import { db } from "db";
import { covers, games } from "db/schema/games";
import { and, desc, ilike, inArray } from "drizzle-orm";

async function checkForCovers() {
	const searchResults = await db.query.games.findMany({
		with: {
			cover: true,
		},
	});

	const problemIds: number[] = [];

	searchResults.forEach((game) => {
		if (!game.cover) {
			console.log("WE GOT ONE!!!");
			console.log(`ITS THIS LITTLE CUNT: ${game.title}`);
			problemIds.push(game.gameId);
		}
	});
		console.log(`Problems: ${problemIds.length}`);


	// ok lets see what comes up in the cover database
	const coverResults = await db
		.select()
		.from(covers)
		.where(inArray(covers.gameId, problemIds));
	console.log(`Check the length: ${coverResults.length}`);

	// shall we try and get them then?
	// for (const id of problemIds) {
	// 	console.log(`starting id: ${id}`);
	// 	const res = await fetch(`${WORKER_URL}/covers/${id}`, { method: "POST" });
	// 	console.log(res);
	// 	console.log(`finished for id: ${id}`);
	// }
}

console.log("Starting");
await checkForCovers();
console.log("Finished");
