import {
	followers,
	gamesOnPlaylists,
	playlistComments,
	playlists,
	tags,
	tagsToPlaylists,
} from "db/schema/playlists";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { Game, GameWithCover } from "./games";
import { User } from ".";

export const playlistsSelectSchema = createSelectSchema(playlists);
export const playlistsInsertSchema = createInsertSchema(playlists);

export const tagsSelectSchema = createSelectSchema(tags);
export const tagsInsertSchema = createInsertSchema(tags);

export const tagsToPlaylistsSelectSchema = createSelectSchema(tagsToPlaylists);
export const tagsToPlaylistsInsertSchema = createInsertSchema(tagsToPlaylists);

export const gamesOnPlaylistsSelectSchema = createSelectSchema(gamesOnPlaylists);
export const gamesOnPlaylistsInsertSchema = createInsertSchema(gamesOnPlaylists);

export const followersSelectSchema = createSelectSchema(followers);
export const followersInsertSchema = createInsertSchema(followers);

export const playlistCommentsSelectSchema = createSelectSchema(playlistComments);
export const playlistCommentsInsertSchema = createInsertSchema(playlistComments);

export type Playlist = z.infer<typeof playlistsSelectSchema>;
export type InsertPlaylist = z.infer<typeof playlistsInsertSchema>;

export type Tag = z.infer<typeof tagsSelectSchema>;
export type InsertTag = z.infer<typeof tagsInsertSchema>;

export type TagToPlaylist = z.infer<typeof tagsToPlaylistsSelectSchema>;
export type InsertTagToPlaylist = z.infer<typeof tagsToPlaylistsInsertSchema>;

export type GamesOnPlaylist = z.infer<typeof gamesOnPlaylistsSelectSchema>;
export type InsertGamesOnPlaylist = z.infer<typeof gamesOnPlaylistsInsertSchema>;

export type Follower = z.infer<typeof followersSelectSchema>;
export type InsertFollower = z.infer<typeof followersInsertSchema>;

export type PlaylistComment = z.infer<typeof playlistCommentsSelectSchema>;
export type InsertPlaylistComment = z.infer<typeof playlistCommentsInsertSchema>;

export type GamesOnPlaylistWithGameData = GamesOnPlaylist & {
	game: GameWithCover;
};

export type PlaylistWithGames = Playlist & {
	games: GamesOnPlaylistWithGameData[];
};

export type PlaylistWithCreator = Playlist & {
	creator: User;
};

export type PlaylistWithGamesAndCreator = Playlist & {
	games: GamesOnPlaylist[];
	creator: User;
};

export type TagsToPlaylistsWithTag = TagToPlaylist & {
	tag: Tag;
};

export type PlaylistWithGamesAndCreatorAndTags = Playlist & {
	games: GamesOnPlaylist[];
	creator: User;
	tags: TagsToPlaylistsWithTag[];
};

export type PlaylistWithFollowers = Playlist & {
	followers: Follower[];
};

export type PlaylistCommentsWithAuthor = PlaylistComment & {
	author: User;
};

export type PlaylistWithPinned = Playlist & {
	pinned: boolean;
};

export type GamesOnPlaylistWithPlaylist = GamesOnPlaylist & {
	playlist: Playlist;
};

export type PlaylistWithStuffAndCount = PlaylistWithGamesAndCreator & {
	followerCount: number;
	aggRating: number;
};
