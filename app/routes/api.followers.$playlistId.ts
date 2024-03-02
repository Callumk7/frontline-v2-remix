import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { followers } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "PATCH" && request.method !== "DELETE") {
		return json("Method not allowed.", {
			status: 405,
			statusText: "Method Not Allowed",
		});
	}

	if (request.method === "PATCH") {
		const result = await zx.parseFormSafe(request, {
			playlistId: z.string(),
			userId: z.string(),
			pinned: zx.BoolAsString,
		});

		if (result.success) {
			const pinnedPlaylist = await db
				.update(followers)
				.set({
					pinned: result.data.pinned,
				})
				.where(
					and(
						eq(followers.playlistId, result.data.playlistId),
						eq(followers.userId, result.data.userId),
					),
				);

			return json({ pinnedPlaylist });
		}
	}
};
