import { activityManager } from "@/services/events/events.server";
import { InsertUsersToGames } from "@/types/games";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";
import { zx } from "zodix";

// api.collections.userId
// PUT updates
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const userId = params.userId;

	// early return if there is no userId param
	if (!userId) {
		return json("No user id provided", { status: 405 });
	}

	// gameId is provided in the formData
	const result = await zx.parseFormSafe(request, {
		gameId: zx.NumAsString,
		played: zx.BoolAsString.optional(),
		completed: zx.BoolAsString.optional(),
		starred: zx.BoolAsString.optional(),
		rating: zx.NumAsString.optional(),
		pinned: zx.BoolAsString.optional(),
	});

	// early return if the game is in the wrong format
	if (!result.success) {
		return json({ error: result.error });
	}

	const gameUpdate: InsertUsersToGames = {
		userId,
		gameId: result.data.gameId,
	};

	if (result.data.played !== undefined) {
		gameUpdate.played = result.data.played;
	}
	if (result.data.completed !== undefined) {
		gameUpdate.completed = result.data.completed;
	}
	if (result.data.starred !== undefined) {
		console.log("Game Starring not yet implemented on the database...");
	}
	if (result.data.rating) {
		gameUpdate.playerRating = result.data.rating;
	}
	if (result.data.pinned !== undefined) {
		gameUpdate.pinned = result.data.pinned;
	}

	console.log(gameUpdate);

	const updateGame = await db
		.update(usersToGames)
		.set(gameUpdate)
		.where(
			and(
				eq(usersToGames.userId, userId),
				eq(usersToGames.gameId, result.data.gameId),
			),
		)
		.returning();

	if (gameUpdate.played) {
		activityManager.markGameAsPlayed(userId, result.data.gameId);
	}
	if (gameUpdate.completed) {
		activityManager.markGameAsCompleted(userId, result.data.gameId);
	}
	if (gameUpdate.playerRating) {
		activityManager.rateGame(userId, result.data.gameId, result.data.rating!);
	}

	return json({ updateGame });
};
