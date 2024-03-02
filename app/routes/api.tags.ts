import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { tagsToPlaylists } from "db/schema/playlists";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
	const result = await zx.parseFormSafe(request, {
		playlistId: z.string(),
		tagId: z.string(),
	});

	if (!result.success) {
		return json("Body has incorrect format");
	}

	await db.insert(tagsToPlaylists).values({
		playlistId: result.data.playlistId,
		tagId: result.data.tagId,
	});

	return json("Success");
};
