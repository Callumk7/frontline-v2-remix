CREATE TABLE IF NOT EXISTS "friends" (
	"user_id" text NOT NULL,
	"friend_id" text NOT NULL,
	CONSTRAINT friends_user_id_friend_id PRIMARY KEY("user_id","friend_id")
);
