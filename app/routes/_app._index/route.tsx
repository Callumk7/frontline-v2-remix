import { Container, GameCover, Label, LibraryView, Progress } from "@/components";
import { createServerClient, getSession } from "@/services";
import { SaveToCollectionButton } from "@/features/explore";
import {
	combinePopularGameData,
	getPopularGamesByCollection,
	getPopularGamesByPlaylist,
} from "@/features/home/queries/popular-games";
import { getUserCollectionGameIds } from "@/model";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTopTenByRating } from "./loading";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const popularGamesByPlaylistPromise = getPopularGamesByPlaylist();
	const popularGamesByCollectionPromise = getPopularGamesByCollection();
	const userCollectionGameidsPromise = getUserCollectionGameIds(session.user.id);

	// fetch gameIds in parallel
	const [popularGamesByCollection, popularGamesByPlaylist, userCollectionGameIds] =
		await Promise.all([
			popularGamesByCollectionPromise,
			popularGamesByPlaylistPromise,
			userCollectionGameidsPromise,
		]);

	// I should create an explcit type for the return type of this function
	const processedData = await combinePopularGameData({
		popularGamesByCollection,
		popularGamesByPlaylist,
	});

	const topTenGames = await getTopTenByRating();

	return json(
		{ processedData, userCollectionGameIds, topTenGames, session },
		{ headers },
	);
};

export default function AppIndex() {
	const { processedData, userCollectionGameIds, topTenGames, session } =
		useLoaderData<typeof loader>();
	// This could be done on the server..
	const maxCollectionCount = processedData.reduce(
		(max, game) => Math.max(max, game.collectionCount),
		0,
	);
	const maxPlaylistCount = processedData.reduce(
		(max, game) => Math.max(max, game.playlistCount),
		0,
	);
	return (
		<Container className="flex flex-col gap-24">
			<LibraryView>
				{topTenGames.map((game) => (
					<div key={game.id} className="flex flex-col gap-3">
						<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
						<div className="border p-3 rounded-md">
							<span className="font-black text-lg">
								{Math.floor(Number(game.avRating))}
							</span>
						</div>
					</div>
				))}
			</LibraryView>
			<LibraryView>
				{processedData.map((game) => (
					<div key={game.id} className="relative flex flex-col gap-3">
						{!userCollectionGameIds.includes(game.gameId) && (
							<div className="absolute right-3 top-3 z-20">
								<SaveToCollectionButton
									variant="outline"
									gameId={game.gameId}
									userId={session.user.id}
								/>
							</div>
						)}
						<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
						<ExploreGameDataRow
							collectionCount={game.collectionCount}
							maxCollectionCount={maxCollectionCount}
							playlistCount={game.playlistCount}
							maxPlaylistCount={maxPlaylistCount}
						/>
					</div>
				))}
			</LibraryView>
		</Container>
	);
}

interface ExploreGameDataRowProps {
	collectionCount: number;
	maxCollectionCount: number;
	playlistCount: number;
	maxPlaylistCount: number;
}

function ExploreGameDataRow({
	collectionCount,
	playlistCount,
	maxCollectionCount,
	maxPlaylistCount,
}: ExploreGameDataRowProps) {
	return (
		<div className="flex flex-col gap-2 rounded-md border p-3">
			<div className="flex w-full flex-col gap-1">
				<Label>Collection Popularity</Label>
				<Progress value={collectionCount} max={maxCollectionCount} className="h-2" />
			</div>
			<div className="flex w-full flex-col gap-1">
				<Label>Playlist Popularity</Label>
				<Progress value={playlistCount} max={maxPlaylistCount} className="h-2" />
			</div>
		</div>
	);
}
