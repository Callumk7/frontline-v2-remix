import { relations } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { usersToGames } from "./games";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	email: text("email").notNull().unique(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	isUpdated: boolean("is_updated").default(false),
	profilePicture: text("profile_picture"),
	// playlists
	// comments
	// followedPlaylists
});

export const usersRelations = relations(users, ({ many }) => ({
	games: many(usersToGames),
	friends: many(friends, {
		relationName: "friend",
	}),
	friendsOf: many(friends, {
		relationName: "user",
	}),
}));

export const friends = pgTable(
	"friends",
	{
		userId: text("user_id").notNull(),
		friendId: text("friend_id").notNull(),
	},

	(t) => ({
		pk: primaryKey(t.userId, t.friendId),
	}),
);

export const friendsRelations = relations(friends, ({ one }) => ({
	friend: one(users, {
		fields: [friends.userId],
		references: [users.id],
		relationName: "friend",
	}),
	user: one(users, {
		fields: [friends.friendId],
		references: [users.id],
		relationName: "user",
	}),
}));
