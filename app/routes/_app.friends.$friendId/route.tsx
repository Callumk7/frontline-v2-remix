import { Container, Card, Button } from "@/components";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { activity } from "db/schema/activity";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const friendId = params.friendId!;

	// friend's playlists
	const friendsPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.creatorId, friendId),
	});

	// friend's activity
	const friendsActivity = await db.query.activity.findMany({
		where: eq(activity.userId, friendId),
	});

	console.log(friendsActivity);

	// friend's profile?
	return json({ friendsPlaylists, friendsActivity });
};

export default function FriendsRoute() {
	const { friendsPlaylists } = useLoaderData<typeof loader>();
	return (
		<Container className="flex flex-col gap-5">
			{friendsPlaylists.map((playlist) => (
				<Card>{playlist.name}</Card>
			))}
		</Container>
	);
}
