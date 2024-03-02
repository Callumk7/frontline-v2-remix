import { WORKER_URL } from "@/constants";
import { activityManager } from "@/services/events/events.server";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const action = async ({ request }: ActionFunctionArgs) => {
	// This action needs to handle POST and DELETE requests for games
	// being added or removed from a user's collection.

	// POST /api/collections
	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			gameId: zx.NumAsString,
			userId: z.string(),
		});

		if (result.success) {
			const { gameId, userId } = result.data;
			// save a game to the user's collection
			const savedGame = await db
				.insert(usersToGames)
				.values({
					gameId,
					userId,
				})
				.onConflictDoNothing()
				.returning();

			// This is offloading the work to a cloudflare worker
			await fetch(`${WORKER_URL}/games/${gameId}`, {
				method: "POST",
			}).then((res) => {
				if (res.ok) {
					console.log(`Successfully saved ${gameId} to our database.`);
				} else {
					console.error(`Failed to save ${gameId} to our database.`);
				}
			});

			activityManager.addToCollection(userId, gameId);

			return json(
				{
					success: savedGame,
				},
				{ status: StatusCodes.CREATED, statusText: ReasonPhrases.CREATED },
			);
		}
		return json(
			{
				error: result.error,
			},
			{
				status: StatusCodes.BAD_REQUEST,
				statusText: ReasonPhrases.BAD_REQUEST,
			},
		);
	}

	// DELETE /api/collections
	if (request.method === "DELETE") {
		const result = await zx.parseFormSafe(request, {
			gameId: zx.NumAsString,
			userId: z.string(),
		});

		if (result.success) {
			const { gameId, userId } = result.data;
			// remove a game from the user's collection
			const removedGame = await db
				.delete(usersToGames)
				.where(
					and(eq(usersToGames.userId, userId), eq(usersToGames.gameId, gameId)),
				);

			activityManager.removeFromCollection(userId, gameId);

			return json({
				success: removedGame,
			});
		}
		return json({
			error: result.error,
		});
	}
};
