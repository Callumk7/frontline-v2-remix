import { db } from "db";
import { friends } from "db/schema/users";
import { eq } from "drizzle-orm";

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



