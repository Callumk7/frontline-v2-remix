import { db } from "db";
import { followers, playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const getUserPlaylists = async (userId: string) => {
	const userPlaylists = await db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
	});

	return userPlaylists;
};

export const getCreatedAndFollowedPlaylists = async (userId: string) => {
	const createdPlaylistsPromise = db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
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
		},
	});

	const followedPlaylistsPromise = db.query.followers
		.findMany({
			where: eq(followers.userId, userId),
			with: {
				playlist: {
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
					},
				},
			},
		})
		.then((result) => result.map((r) => r.playlist));

	const [createdPlaylists, followedPlaylists] = await Promise.all([
		createdPlaylistsPromise,
		followedPlaylistsPromise,
	]);

	const allPlaylistsSet = new Set([...createdPlaylists, ...followedPlaylists]);
	const allPlaylists = [...allPlaylistsSet];

	return allPlaylists;
};
