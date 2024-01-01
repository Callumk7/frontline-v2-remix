import { db } from "db";

export async function getPlaylistsWithGames(limit: number) {
	const allPlaylists = await db.query.playlists.findMany({
		with: {
			games: {
				with: {
					game: {
						with: {
							cover: true,
						},
					},
				},
				limit: 4,
			},
		},
		limit: limit,
	});

	return allPlaylists;
}
