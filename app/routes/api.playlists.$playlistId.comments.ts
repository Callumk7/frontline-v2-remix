import { activityManager } from "@/services/events/events.server";
import { uuidv4 } from "@/util/generate-uuid";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { notes } from "db/schema/notes";
import { z } from "zod";
import { zx } from "zodix";

export const action = async ({ request, params }: ActionFunctionArgs) => {
	if (request.method === "POST") {
		const playlistId = String(params.playlistId);
		const result = await zx.parseFormSafe(request, {
			user_id: z.string(),
			body: z.string(),
		});

		if (!result.success) {
			return json("failure", { status: 400 });
		}

		const noteId = `note_${uuidv4()}`;

		const newNote = await db.insert(notes).values({
			id: noteId,
			authorId: result.data.user_id,
			playlistId: playlistId,
			location: "playlist",
			content: result.data.body,
		}).returning();

		activityManager.leaveComment(result.data.user_id, noteId)

		return json({ newNote });
	}

	return json("failure", { status: 400 });
};
