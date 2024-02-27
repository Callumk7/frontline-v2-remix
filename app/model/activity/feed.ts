import { UserWithActivity, UserWithActivityFeedEntry } from "@/types";
import { db } from "db";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";

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

export const transformActivity = (
	friendsWithActivity: UserWithActivity[],
): UserWithActivityFeedEntry[] => {
	const activityFeed = friendsWithActivity.flatMap((friend) =>
		friend.activity.map((activity) => {
			return { ...friend, activity };
		}),
	);

	return activityFeed;
};
