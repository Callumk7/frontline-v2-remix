import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { followers } from "db/schema/playlists";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request }: ActionFunctionArgs) => {
	if (request.method !== "POST" && request.method !== "DELETE") {
		return json("Method not allowed.", {
			status: 405,
			statusText: "Method Not Allowed",
		});
	}

	const result = await zx.parseFormSafe(request, {
		playlistId: z.string(),
		userId: z.string(),
	});

	if (!result.success) {
		console.error(result.error);
		return json("error");
	}

	if (request.method === "POST") {
		const newFollow = await db
			.insert(followers)
			.values({
				playlistId: result.data.playlistId,
				userId: result.data.userId,
			})
			.onConflictDoNothing();

		return json({ newFollow });
	}

	if (request.method === "DELETE") {
		const removeFollow = await db
			.delete(followers)
			.where(
				and(
					eq(followers.userId, result.data.userId),
					eq(followers.playlistId, result.data.playlistId),
				),
			);

		return json({ removeFollow });
	}
};
