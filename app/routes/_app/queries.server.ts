import { db } from "db";
import { playlists, followers } from "db/schema/playlists";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";

export const getCreatedAndFollowedPlaylists = async (userId: string) => {
	const createdPlaylistsPromise = db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
		with: {
			creator: true,
		},
	});

	const followedPlaylistsPromise = db.query.followers
		.findMany({
			where: eq(followers.userId, userId),
			with: {
				playlist: {
					with: {
						creator: true,
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

export const getUserFriendIds = async (userId: string) => {
	const userFriends = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
		})
		.then((results) => results.map((result) => result.friendId));

	return userFriends;
};
