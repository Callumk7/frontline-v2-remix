import { uuidv4 } from "@/util/generate-uuid";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { z } from "zod";
import { zx } from "zodix";

// Route handler for the CREATION OF PLAYLISTS
export const action = async ({ request }: ActionFunctionArgs) => {

	// Safety net
	if (request.method !== "POST") {
		return json("Method not allowed", { status: 405 });
	}

	if (request.method === "POST") {
		const result = await zx.parseFormSafe(request, {
			playlistName: z.string(),
			userId: z.string(),
		});

		if (!result.success) {
			return json({ error: result.error }, { status: 400 });
		}

		const { playlistName, userId } = result.data;

		const createdPlaylist = await db
			.insert(playlists)
			.values({
				id: `pl_${uuidv4()}`,
				name: playlistName,
				creatorId: userId,
			})
			.returning();

		return json({ success: true, playlist: createdPlaylist });
	}
};
