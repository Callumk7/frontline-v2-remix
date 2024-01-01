import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { gamesOnPlaylists } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

// Route handler for ADDING AND REMOVING GAMES FROM PLAYLISTS
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { playlistId, gameId } = params;

	if (!playlistId) {
		return json("No playlist id provided", { status: 400 });
	}
	if (!gameId) {
		return json("No game id provided", { status: 400 });
	}

	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			addedBy: z.string(),
		});
		if (result.success) {
			const addedGame = await db.insert(gamesOnPlaylists).values({
				playlistId: playlistId,
				gameId: Number(gameId),
				addedBy: result.data.addedBy,
			});

			return json({ addedGame });
		}

		return json({ error: result.error }, { status: 400 });
	}

	if (request.method === "DELETE") {
		const removedGame = await db
			.delete(gamesOnPlaylists)
			.where(
				and(
					eq(gamesOnPlaylists.playlistId, playlistId),
					eq(gamesOnPlaylists.gameId, Number(gameId)),
				),
			);

		return json({ removedGame });
	}

	return json("Method not allowed", { status: 405 });
};
