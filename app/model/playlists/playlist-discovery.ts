import { isFalse } from "@/util/drizzle/is-false";
import { db } from "db";
import { followers, playlists } from "db/schema/playlists";
import { and, eq, ne } from "drizzle-orm";
export async function getDiscoverablePlaylists(userId: string, limit: number) {
	const discoverablePlaylists = await db.query.playlists.findMany({
		where: and(isFalse(playlists.isPrivate), ne(playlists.creatorId, userId)),
		with: {
			creator: true,
			games: {
				with: {
					game: {
						with: {
							cover: true,
						},
					},
				},
			},
			followers: {
				where: eq(followers.userId, userId),
			},
		},
		limit: limit,
	});

	return discoverablePlaylists;
}
