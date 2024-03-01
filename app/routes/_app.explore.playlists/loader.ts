import { db } from "db";
import { followers, playlists } from "db/schema/playlists";
import { and, avg, count, desc, eq, inArray, isNotNull } from "drizzle-orm";

export const getPopularPlaylists = async (limit: number) => {
	const popularPlaylists = await db
		.select({
			playlistId: followers.playlistId,
			count: count(followers.playlistId),
		})
		.from(followers)
		.groupBy(followers.playlistId)
		.orderBy(desc(count(followers.playlistId)))
		.limit(limit);

	return popularPlaylists;
};

export const getFollowerCountForPlaylists = async (playlistIds: string[]) => {
	const popularPlaylists = await db
		.select({
			playlistId: followers.playlistId,
			count: count(followers.playlistId),
		})
		.from(followers)
		.groupBy(followers.playlistId)
		.orderBy(desc(count(followers.playlistId)))
		.where(inArray(followers.playlistId, playlistIds));

	return popularPlaylists;
};

export const getHighestRatedPlaylists = async (limit: number) => {
	const popularPlaylists = await db
		.select({
			playlistId: followers.playlistId,
			avgRating: avg(followers.rating),
		})
		.from(followers)
		.groupBy(followers.playlistId)
		.orderBy(desc(avg(followers.rating)))
		.where(isNotNull(followers.rating))
		.limit(limit);

	return popularPlaylists;
};

export const getAverageRatingForPlaylists = async (playlistIds: string[]) => {
	const ratedPlaylists = await db
		.select({
			playlistId: followers.playlistId,
			avgRating: avg(followers.rating),
		})
		.from(followers)
		.groupBy(followers.playlistId)
		.orderBy(desc(avg(followers.rating)))
		.where(
			and(isNotNull(followers.rating), inArray(followers.playlistId, playlistIds)),
		);

	return ratedPlaylists;
};

export const getPlaylistData = async (playlistIds: string[]) => {
	const completePlaylists = await db.query.playlists.findMany({
		where: inArray(playlists.id, playlistIds),
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

	return completePlaylists;
};

export const getPlaylistWithDiscoveryData = async (playlistIds: string[]) => {
	const followerPromise = getFollowerCountForPlaylists(playlistIds);
	const ratingPromise = getAverageRatingForPlaylists(playlistIds);
	const playlistDataPromise = getPlaylistData(playlistIds);

	const [followerData, ratingData, playlistData] = await Promise.all([
		followerPromise,
		ratingPromise,
		playlistDataPromise,
	]);

	const aggregatedPlaylists = playlistData.map((pl) => {
		return {
			...pl,
			followerCount: followerData.find((p) => p.playlistId === pl.id)?.count,
			aggRating: ratingData.find((p) => p.playlistId === pl.id)?.avgRating,
		};
	});

	return aggregatedPlaylists;
};
