import { UserWithActivity } from "@/types";
import { db } from "db";
import { playlists, followers } from "db/schema/playlists";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";

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

export const getUserFriends = async (userId: string) => {
	const userFriends = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
			with: {
				friend: true,
			},
		})
		.then((results) => results.map((result) => result.friend));

	return userFriends;
};

export const getUserFriendIds = async (userId: string) => {
	const userFriends = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
		})
		.then((results) => results.map((result) => result.friendId));

	return userFriends;
};

export const getFriendActivity = async (userId: string): Promise<UserWithActivity[]> => {
	const userFriendsWithActivity = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
			with: {
				friend: {
					with: {
						activity: true,
					},
				},
			},
			columns: {
				friendId: true,
			},
		})
		.then((r) =>
			r
				.map((friend) => friend.friend)
				.filter((friend) => friend.activity.length > 0),
		);

	return userFriendsWithActivity;
};

export const transformActivity = (friendsWithActivity: UserWithActivity[]) => {
	const activityFeed = friendsWithActivity.flatMap((friend) =>
		friend.activity.map((activity) => {
			return { ...friend, activity };
		}),
	);

	return activityFeed;
};
