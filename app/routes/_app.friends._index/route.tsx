import { Container } from "@/components";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";
import { FriendTable } from "./friend-table";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";

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

  const justFriends = userFriends.map(f => f.friend)

	return typedjson({ justFriends }, { headers });
};

export default function FriendsRoute() {
	const { justFriends } = useTypedLoaderData<typeof loader>();
	return (
		<div className="flex flex-col">
      <FriendTable friends={justFriends} />
		</div>
	);
}
