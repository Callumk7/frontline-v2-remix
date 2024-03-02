import { Card, Container } from "@/components";
import { Button } from "@/components/ui/button";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const userFriends = await db.query.friends.findMany({
		where: eq(friends.userId, session.user.id),
		with: {
			friend: {
				with: {
					games: true,
					playlistFollows: true,
					playlists: true,
				},
			},
		},
	});

	return json({ userFriends }, { headers });
};

export default function FriendsRoute() {
	const { userFriends } = useLoaderData<typeof loader>();
	return (
		<Container className="flex flex-col gap-5">
			<h1>Hello this is the friends route</h1>
			{userFriends.map((f) => (
				<Card key={f.friendId}>
					<div className="flex justify-between">
						<Link to={`/friends/${f.friendId}`}>{f.friend.username}</Link>
						<div>
							game count:
							{f.friend.games.length}
						</div>
						<div>
							playlist count:
							{f.friend.playlists.length}
						</div>
						<div>
							follows count:
							{f.friend.playlistFollows.length}
						</div>
					</div>
				</Card>
			))}
		</Container>
	);
}
