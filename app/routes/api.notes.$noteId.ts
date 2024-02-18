import { createServerClient, getSession } from "@/services";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "db";
import { notes } from "db/schema/notes";
import { eq } from "drizzle-orm";
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
			noteId: z.string(),
		});

		if (result.success) {
			await db.delete(notes).where(eq(notes.id, result.data.noteId));

			return json({ success: true, noteId: result.data.noteId }, { status: 201 });
		}
	}

	return json("Nothing Happened");
};
