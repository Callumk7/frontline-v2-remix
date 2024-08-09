import { friends, users } from "db/schema/users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Activity, ActivityWithDetails } from "./activity";
import { Follower, Game, Playlist, UsersToGames } from ".";

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertFriendSchema = createInsertSchema(friends);
export const selectFriendSchema = createSelectSchema(friends);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export type InsertFriend = z.infer<typeof insertFriendSchema>;
export type Friend = z.infer<typeof selectFriendSchema>;

export type FriendWithDetails = Friend & {
	user: User;
	friend: User;
};

export type UserWithFriends = User & {
	friends: FriendWithDetails[];
};

export type UserWithActivity = User & {
	activity: ActivityWithDetails[];
};

export type UserWithActivityFeedEntry = User & {
	activity: ActivityWithDetails;
};

export type UserWithPlaylistsFollowsGames = User & {
	games: UsersToGames[];
	playlistFollows: Follower[];
	playlists: Playlist[];
}
