import { PlaylistWithGamesAndCreatorAndTags } from "@/types";
import { db } from "db";
import { followers, playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const getCreatedAndFollowedPlaylists = async (userId: string) => {
	const createdPlaylistsPromise = db.query.playlists.findMany({
		where: eq(playlists.creatorId, userId),
		with: {
			creator: true,
			games: true,
			tags: {
				with: {
					tag: true,
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
						games: true,
						tags: {
							with: {
								tag: true,
							},
						},
					},
				},
			},
		})
		.then((result) =>
			result.map((r) => {
				return {
					...r.playlist,
					pinned: r.pinned,
				};
			}),
		);

	const [createdPlaylists, followedPlaylists] = await Promise.all([
		createdPlaylistsPromise,
		followedPlaylistsPromise,
	]);

	const processedCreatedPlaylists = createdPlaylists.map((playlist) =>
		markPlaylistWithPinned(userId, playlist),
	);

	const allPlaylistsSet = new Set([...processedCreatedPlaylists, ...followedPlaylists]);
	const allPlaylists = [...allPlaylistsSet];

	return allPlaylists;
};

const markPlaylistWithPinned = (
	userId: string,
	playlist: PlaylistWithGamesAndCreatorAndTags,
) => {
	const playlistWithPinned = { ...playlist, pinned: false };
	if (userId === playlist.creatorId && playlist.creatorHasPinned) {
		playlistWithPinned.pinned = true;
	}

	return playlistWithPinned;
};
