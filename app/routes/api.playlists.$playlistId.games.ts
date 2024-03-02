import { createServerClient, getSession } from "@/services";
import { activityManager } from "@/services/events/events.server";
import { InsertGamesOnPlaylist } from "@/types";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { gamesOnPlaylists, playlists } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

// Route handler for ADDING AND REMOVING GAMES FROM PLAYLISTS
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { supabase } = createServerClient(request);
	const session = await getSession(supabase);

	const { playlistId } = params;

	if (!playlistId) {
		return json("No playlist id provided", { status: 400 });
	}

	// TODO: this should be an event listener
	const updatePlaylistPromise = db
		.update(playlists)
		.set({
			isUpdated: true,
			updatedAt: new Date(),
		})
		.where(eq(playlists.id, playlistId));

	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			addedBy: z.string(),
			gameIds: z.array(zx.NumAsString),
		});

		if (result.success) {
			const insert: InsertGamesOnPlaylist[] = [];
			const { addedBy, gameIds } = result.data;
			for (const gameId of gameIds) {
				insert.push({
					addedBy,
					playlistId,
					gameId,
				});
			}

			const addedGamePromise = db
				.insert(gamesOnPlaylists)
				.values(insert)
				.onConflictDoNothing();

			const [addedGame] = await Promise.all([
				addedGamePromise,
				updatePlaylistPromise,
			]);

			for (const gameAdded of insert) {
				activityManager.addGameToPlaylist(
					session?.user.id ?? "no_user_found",
					playlistId,
					gameAdded.gameId,
				);
			}

			return json({ addedGame });
		}

		return json({ error: result.error }, { status: 400 });
	}
};
