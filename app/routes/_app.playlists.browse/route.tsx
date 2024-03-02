import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// future: pagination
	const allPublicPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.isPrivate, false),
	});

	return json({ allPublicPlaylists });
};

export default function BrowsePlaylistsRoute() {
	const { allPublicPlaylists } = useLoaderData<typeof loader>();
	return (
		<div>
			<h1>This is the browse route</h1>
			<div>
				{allPublicPlaylists.map((pl) => (
					<div key={pl.id}>{pl.name}</div>
				))}
			</div>
		</div>
	);
}
