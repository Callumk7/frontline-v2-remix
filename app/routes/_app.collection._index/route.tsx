import {
  CollectionGameMenu,
  GameWithControls,
  GenreFilter,
  Label,
  LibraryView,
  Progress,
  RateGameDialog,
  useFilter,
  useSearch,
  useSort,
} from "@/components";
import { getUserGenres } from "@/features/collection/queries/get-user-genres";
import { getUserPlaylists } from "@/features/playlists";
import { getUserGamesWithDetails, transformCollectionIntoGames } from "@/model";
import { createServerClient, getSession } from "@/services";
import { useCollectionStore } from "@/store";
import { GameWithCollection } from "@/types";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { CollectionMenubar } from "./components/collection-menubar";
import { CollectionTableView } from "./components/collection-table-view";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);
  if (!session) {
    return redirect("/?index", {
      headers,
    });
  }

  const userCollectionPromise = getUserGamesWithDetails(session.user.id);
  const userPlaylistsPromise = getUserPlaylists(session.user.id);
  const allUserGenresPromise = getUserGenres(session.user.id);

  const [userCollection, userPlaylists, allGenres] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
    allUserGenresPromise,
  ]);

  // Not sure about this transform function. At this point, it might be too
  // arbitrary. Consider the data needs and review at a later date.
  const games: GameWithCollection[] =
    transformCollectionIntoGames(userCollection);
  const genreNames = allGenres.map((genre) => genre.name);

  return typedjson({ session, userPlaylists, games, genreNames });
};

///
/// ROUTE
///
export default function CollectionIndex() {
  const { userPlaylists, games, session, genreNames } =
    useTypedLoaderData<typeof loader>();

  const { filteredGames } = useFilter(games);
  const { searchedGames } = useSearch(filteredGames);
  const { sortedGames } = useSort(searchedGames);

  // For the progress bars
  const gameCount = games.length;
  const playedGames = games.filter((game) => game.played).length;
  const completedGames = games.filter((game) => game.completed).length;

  // We pass state from the filter store here, so the genre-filter component
  // can be reused in other routes
  const genreFilter = useCollectionStore((state) => state.genreFilter);
  const handleGenreToggled = useCollectionStore(
    (state) => state.handleGenreToggled
  );
  const handleToggleAllGenres = useCollectionStore(
    (state) => state.handleToggleAllGenres
  );
  const hideProgress = useCollectionStore((state) => state.hideProgress);

  // State for handling the rate game dialog
  const [isRateGameDialogOpen, setIsRateGameDialogOpen] =
    useState<boolean>(false);
  const [dialogGameId, setDialogGameId] = useState<number>(0);

  const handleOpenRateGameDialog = (gameId: number) => {
    setDialogGameId(gameId);
    setIsRateGameDialogOpen(true);
  };

  const isTableView = useCollectionStore((state) => state.isTableView);

  return (
    <>
      <div className="mb-8">
        <GenreFilter
          genres={genreNames}
          genreFilter={genreFilter}
          handleGenreToggled={handleGenreToggled}
          handleToggleAllGenres={handleToggleAllGenres}
        />
      </div>
      <CollectionMenubar
        userId={session.user.id}
        userPlaylists={userPlaylists}
      />
      <div className="my-6">
        {!hideProgress && (
          <CollectionProgress
            gameCount={gameCount}
            playedGames={playedGames}
            completedGames={completedGames}
          />
        )}
      </div>
      {isTableView ? (
        <CollectionTableView
          sortedGames={sortedGames}
          userPlaylists={userPlaylists}
          userId={session.user.id}
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
                userId={session.user.id}
                playlists={userPlaylists}
                gamePlaylists={game.playlists}
                handleOpenRateGameDialog={handleOpenRateGameDialog}
              />
            </GameWithControls>
          ))}
        </LibraryView>
      )}
      <RateGameDialog
        userId={session.user.id}
        gameId={dialogGameId}
        isRateGameDialogOpen={isRateGameDialogOpen}
        setIsRateDialogOpen={setIsRateGameDialogOpen}
      />
    </>
  );
}

function CollectionProgress({
  gameCount,
  playedGames,
  completedGames,
}: {
  gameCount: number;
  playedGames: number;
  completedGames: number;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Played</Label>
        <Progress value={playedGames} max={gameCount} className="h-2" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Completed</Label>
        <Progress value={completedGames} max={gameCount} className="h-2" />
      </div>
    </div>
  );
}
