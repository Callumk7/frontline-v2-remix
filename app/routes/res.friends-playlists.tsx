import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { useEffect } from "react";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const userId = String(url.searchParams.get("user_id"));

	const topPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
		with: {
			followers: {
				columns: {
					userId: true,
				},
			},
		},
	});

	const sortedPlaylists = topPlaylists
		.sort((a, b) => b.followers.length - a.followers.length)
		.slice(0, 4);

	return sortedPlaylists;
};

export function TopPlaylists({ userId }: { userId: string }) {
	const playlistFetcher = useFetcher<typeof loader>();
	useEffect(() => {
		playlistFetcher.submit(
			{ user_id: userId },
			{ method: "GET", action: "/res/friends-playlists" },
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<h1 className="mb-4 pl-1 font-bold">Top Playlists</h1>
			<div className="grid gap-2">
				{playlistFetcher.data?.map((pl) => (
					<div key={pl.id} className="grid grid-cols-2 rounded-md border p-2">
						<div className="text-lg font-semibold">{pl.name}</div>
						<div className="text-right">Followers: {pl.followers.length}</div>
					</div>
				))}
			</div>
		</div>
	);
}
