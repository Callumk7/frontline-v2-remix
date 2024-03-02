import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "db";
import { gamesOnPlaylists, playlists } from "db/schema/playlists";
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

	if (request.method !== "DELETE" && request.method !== "PATCH") {
		return json("Method not allowed", { status: 405 });
	}

	if (request.method === "DELETE") {
		await db.delete(playlists).where(eq(playlists.id, playlistId));

		// cascade the delete through all entries as well
		await db
			.delete(gamesOnPlaylists)
			.where(eq(gamesOnPlaylists.playlistId, playlistId));

		return redirect("/playlists");
	}

	if (request.method === "PATCH") {
		const result = await zx.parseFormSafe(request, {
			playlistName: z.string().optional(),
			isPrivate: zx.BoolAsString.optional(),
			pinned: zx.BoolAsString.optional(),
		});

		if (!result.success) {
			return json({ error: result.error });
		}

		if (result.data.playlistName) {
			const updatedPlaylist = await db
				.update(playlists)
				.set({
					name: result.data.playlistName,
					isUpdated: true,
					updatedAt: new Date(),
				})
				.where(eq(playlists.id, playlistId));

			return json({ updatedPlaylist });
		}

		if ("isPrivate" in result.data) {
			const updatedPlaylist = await db
				.update(playlists)
				.set({
					isPrivate: result.data.isPrivate,
					isUpdated: true,
					updatedAt: new Date(),
				})
				.where(eq(playlists.id, playlistId));

			return json({ updatedPlaylist });
		}

		if ("pinned" in result.data) {
			const updatedPlaylist = await db
				.update(playlists)
				.set({
					creatorHasPinned: result.data.pinned,
					isUpdated: true,
					updatedAt: new Date(),
				})
				.where(eq(playlists.id, playlistId));

			return json({ updatedPlaylist });
		}

		return json({ fail: "You made a patch request, but nothing changed" });
	}
	return json({ fail: "You failed" });
};
