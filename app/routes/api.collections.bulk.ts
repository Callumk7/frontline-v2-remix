import { activityManager } from "@/services/events/events.server";
import { InsertUsersToGames, UsersToGames } from "@/types";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
	// This action needs to handle POST and DELETE requests for games
	// being added or removed from a user's collection in bulk.

	// POST /api/collections
	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			gameIds: z.array(zx.NumAsString),
			userId: z.string(),
		});

		if (result.success) {
			const { gameIds, userId } = result.data;

			const inserts: InsertUsersToGames[] = [];
			for (const id of gameIds) {
				inserts.push({
					userId: userId,
					gameId: id,
				});
			}

			await db.insert(usersToGames).values(inserts);

			for (const { userId, gameId } of inserts) {
				activityManager.addToCollection(userId, gameId);
			}

			return json({
				success: true,
			});
		}
		return json({
			error: result.error,
		});
	}

	// DELETE /api/collections
	if (request.method === "DELETE") {
		const result = await zx.parseFormSafe(request, {
			gameIds: z.array(zx.NumAsString),
			userId: z.string(),
		});

		if (result.success) {
			const { gameIds, userId } = result.data;
			const removedGames = await db
				.delete(usersToGames)
				.where(
					and(
						eq(usersToGames.userId, userId),
						inArray(usersToGames.gameId, gameIds),
					),
				);

			for (const gameId of gameIds) {
				activityManager.removeFromCollection(userId, gameId);
			}

			return json({
				success: removedGames,
			});
		}
		return json({
			error: result.error,
		});
	}

	// PATCH /api/collections
	if (request.method === "PATCH") {
		const result = await zx.parseFormSafe(request, {
			gameIds: z.array(zx.NumAsString),
			userId: z.string(),
			update: z.string(),
		});

		if (result.success) {
			const { gameIds, userId, update } = result.data;
			const played = update === "played";
			const completed = update === "completed";
			if (played) {
				for (const id of gameIds) {
					await db
						.update(usersToGames)
						.set({
							played: true,
						})
						.where(
							and(
								eq(usersToGames.userId, userId),
								eq(usersToGames.gameId, id),
							),
						);
					activityManager.markGameAsPlayed(userId, id);
				}
			} else if (completed) {
				for (const id of gameIds) {
					await db
						.update(usersToGames)
						.set({
							completed: true,
						})
						.where(
							and(
								eq(usersToGames.userId, userId),
								eq(usersToGames.gameId, id),
							),
						);
					activityManager.markGameAsCompleted(userId, id);
				}
			}

			return json({ success: true });
		}
		return json({
			error: result.error,
		});
	}
};
