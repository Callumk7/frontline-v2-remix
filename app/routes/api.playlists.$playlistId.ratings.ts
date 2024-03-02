import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { followers } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		const playlistId = String(params.playlistId);
		const result = await zx.parseFormSafe(request, {
			user_id: z.string(),
			rating: zx.NumAsString,
		});

		if (!result.success) {
			return json("failure", { status: 400 });
		}

		await db
			.update(followers)
			.set({
				rating: result.data.rating,
			})
			.where(
				and(
					eq(followers.playlistId, playlistId),
					eq(followers.userId, result.data.user_id),
				),
			);

		return json({ success: true });
	}

	return json("failure", { status: 400 });
};
