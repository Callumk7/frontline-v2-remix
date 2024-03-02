import { InsertUsersToGames } from "@/types";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { users } from "db/schema/users";
import { and, eq } from "drizzle-orm";

async function main() {
	// 1. for every entry in the collection table, we check to see if it is completed
	// 2. if completed, set the enum to completed
	// 3. if not completed but played, set to played

	const allCollectionRows = await db.select().from(usersToGames);

	const updates: InsertUsersToGames[] = [];
	for (const entry of allCollectionRows) {
		if (entry.completed) {
			updates.push({
				...entry,
				status: "completed",
			});
		} else if (entry.played) {
			updates.push({
				...entry,
				status: "played",
			});
		}
	}

	console.log(updates);

	let count = 0;
	// update the database
	for (const update of updates) {
		await db
			.update(usersToGames)
			.set(update)
			.where(
				and(
					eq(usersToGames.userId, update.userId),
					eq(usersToGames.gameId, update.gameId),
				),
			);

		count++;
		console.log(`Update complete for ${update.gameId}, ${update.userId}`);
		console.log(`${count} entries updated`);
	}
}

main();
