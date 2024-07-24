import {
	Button,
	CollectionGameMenu,
	GameWithControls,
	GenreFilter,
	LibraryView,
	useFilter,
	useSearch,
	useSort,
} from "@/components";
import { GameWithCollection, Playlist } from "@/types";
import { CollectionTableView } from "./collection-table-view";
import { useCollectionStore } from "@/store";
import { CollectionProgress } from "./collection-progress";
import { CollectionMenubar } from "./collection-menubar";
import { Form, useSearchParams } from "@remix-run/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface CollectionViewProps {
	games: GameWithCollection[];
	userPlaylists: Playlist[];
	userId: string;
	genreNames: string[];
	handleOpenRateGameDialog: (gameId: number) => void;
}

export function CollectionView({
	games,
	userPlaylists,
	userId,
	genreNames,
	handleOpenRateGameDialog,
}: CollectionViewProps) {
	// Custom hooks for handling search, sort and filter
	const { filteredGames } = useFilter(games);
	const { searchedGames } = useSearch(filteredGames);
	const { sortedGames } = useSort(searchedGames);

	// We pass state from the filter store here, so the genre-filter component
	// can be reused in other routes
	const genreFilter = useCollectionStore((state) => state.genreFilter);
	const handleGenreToggled = useCollectionStore((state) => state.handleGenreToggled);
	const handleToggleAllGenres = useCollectionStore(
		(state) => state.handleToggleAllGenres,
	);

	// For the progress bars
	const gameCount = games.length;
	const playedGames = games.filter((game) => game.played).length;
	const completedGames = games.filter((game) => game.completed).length;

	const hideProgress = useCollectionStore((state) => state.hideProgress);
	const isTableView = useCollectionStore((state) => state.isTableView);

	const [searchParams, setSearchParams] = useSearchParams();

	const [limit, setLimit] = useState(() => {
		const initLimit = Number(searchParams.get("limit"));
		if (initLimit === 0) {
			return 50;
		}
    return initLimit;
	});
	const [offset, setOffset] = useState(Number(searchParams.get("offset")));

	const handleIncreaseOffset = () => {
		const newOffset = offset + limit;
		setOffset(newOffset);
		const params = new URLSearchParams();
		params.set("limit", String(limit));
		params.set("offset", String(newOffset));
		setSearchParams(params);
	};

  const handleDecreaseOffset = () => {
    let newOffset = offset - limit;
    if (newOffset < 0) {
      newOffset = 0;
    }
    setOffset(newOffset);
		const params = new URLSearchParams();
		params.set("limit", String(limit));
		params.set("offset", String(newOffset));
		setSearchParams(params);
  }

	return (
		<div>
			{offset}
			<div className="mb-8">
				<GenreFilter
					genres={genreNames}
					genreFilter={genreFilter}
					handleGenreToggled={handleGenreToggled}
					handleToggleAllGenres={handleToggleAllGenres}
				/>
			</div>
			<CollectionMenubar userId={userId} userPlaylists={userPlaylists} />
			<div className="my-6">
				{!hideProgress && (
					<CollectionProgress
						gameCount={gameCount}
						playedGames={playedGames}
						completedGames={completedGames}
					/>
				)}
			</div>
			<div className="flex flex-row gap-2 mb-4">
				{offset >= limit && (
					<Button
						variant="outline"
						size="icon"
						onClick={handleDecreaseOffset}
					>
						<ArrowLeftIcon />
					</Button>
				)}
				<Button variant="outline" size="icon" onClick={handleIncreaseOffset}>
					<ArrowRightIcon />
				</Button>
			</div>
			{isTableView ? (
				<CollectionTableView
					sortedGames={sortedGames}
					userPlaylists={userPlaylists}
					userId={userId}
					handleOpenRateGameDialog={handleOpenRateGameDialog}
				/>
			) : (
				<LibraryView>
					{sortedGames.map((game) => (
						<GameWithControls
							key={game.id}
							coverId={game.cover.imageId}
							gameId={game.gameId}
						>
							<CollectionGameMenu
								gameId={game.gameId}
								isPlayed={game.played}
								isCompleted={game.completed ?? false}
								isPinned={game.pinned}
								userId={userId}
								playlists={userPlaylists}
								gamePlaylists={game.playlists}
								handleOpenRateGameDialog={handleOpenRateGameDialog}
							/>
						</GameWithControls>
					))}
				</LibraryView>
			)}
		</div>
	);
}
