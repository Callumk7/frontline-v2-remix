import { createServerClient, getSession } from "@/services";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "db";
import { notes } from "db/schema/notes";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";

///
/// ACTION
///
export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	if (request.method === "DELETE") {
		const result = zx.parseParamsSafe(params, {
			commentId: z.string(),
			playlistId: z.string(),
		});

		if (result.success) {
			await db
				.delete(notes)
				.where(
					and(
						eq(notes.playlistId, result.data.playlistId),
						eq(notes.id, result.data.commentId),
						eq(notes.location, "playlist"),
					),
				);

			return json(
				{ success: true, commentId: result.data.commentId },
				{ status: 201 },
			);
		}
	}

	return json("Nothing Happened");
};
