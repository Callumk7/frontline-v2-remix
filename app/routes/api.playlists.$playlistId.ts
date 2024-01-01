import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

// /api/playlist/:playlistId for DELETE and PUT
// This route is used for removing playlists, and updating playlist names
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { playlistId } = params;

	if (!playlistId) {
		return json("No playlist id provided", { status: 400 });
	}

	if (request.method !== "DELETE" && request.method !== "PUT") {
		return json("Method not allowed", { status: 405 });
	}

	if (request.method === "DELETE") {
		const deletedPlaylist = await db
			.delete(playlists)
			.where(eq(playlists.id, playlistId));

		return json({ deletedPlaylist });
	}

	if (request.method === "PUT") {
		const result = await zx.parseFormSafe(request, {
			playlistName: z.string(),
		});

		if (!result.success) {
			return json({ error: result.error });
		}

		const updatedPlaylist = await db
			.update(playlists)
			.set({
				name: result.data.playlistName,
			})
			.where(eq(playlists.id, playlistId));

		return json({ updatedPlaylist });
	}
};
