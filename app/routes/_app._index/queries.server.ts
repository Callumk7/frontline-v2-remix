import { UserWithActivity, UserWithActivityFeedEntry } from "@/types";
import { db } from "db";
import { activity } from "db/schema/activity";
import { friends } from "db/schema/users";
import { desc, eq } from "drizzle-orm";

export const getSortedFriendActivity = async (userId: string) => {
	return sortActivity(await getFriendActivity(userId));
};

export const getFriendActivity = async (userId: string) => {
	const userFriendsWithActivity = await db.query.friends
		.findMany({
			where: eq(friends.userId, userId),
			with: {
				friend: {
					with: {
						activity: {
							with: {
								game: true,
								playlist: true,
								note: true,
								user: true,
							},
							orderBy: desc(activity.timestamp),
							limit: 15,
						},
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

const sortActivity = (
	friendsWithActivity: UserWithActivity[],
): UserWithActivityFeedEntry[] => {
	const activityFeed = friendsWithActivity.flatMap((friend) =>
		friend.activity.map((activity) => {
			return { ...friend, activity };
		}),
	);

	activityFeed.sort(
		(a, b) => b.activity.timestamp.valueOf() - a.activity.timestamp.valueOf(),
	);

	return activityFeed;
};

