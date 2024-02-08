import { createServerClient, getSession } from "@/features/auth";
import { useFilter, useSearch } from "@/features/library";
import { GenreFilter } from "@/features/library/components/genre-filter";
import { useSort } from "@/features/library/hooks/sort";
import { useFilterStore } from "@/store/filters";
import { GameWithCollection } from "@/types/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, redirect, useTypedLoaderData } from "remix-typedjson";
import { handleDataFetching } from "./loader";
import { transformCollectionIntoGames } from "@/model/collection";
import {
  CollectionGameMenu,
  CollectionMenubar,
  GameWithControls,
  Label,
  LibraryView,
  Progress,
} from "@/components";
import { useState } from "react";
import { RateGameDialog } from "@/features/collection/components/rate-game-dialog";

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

  const { userCollection, userPlaylists, allGenres } = await handleDataFetching(
    session.user.id,
  );

  // Not sure about this transform function. At this point, it might be too
  // arbitrary. Consider the data needs and review at a later date.
  const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);
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
  const genreFilter = useFilterStore((state) => state.genreFilter);
  const handleGenreToggled = useFilterStore((state) => state.handleGenreToggled);
  const handleToggleAllGenres = useFilterStore((state) => state.handleToggleAllGenres);

  // State for handling the rate game dialog
  const [isRateGameDialogOpen, setIsRateGameDialogOpen] = useState<boolean>(false);
  const [dialogGameId, setDialogGameId] = useState<number>(0);

  const handleOpenRateGameDialog = (gameId: number) => {
    setDialogGameId(gameId);
    setIsRateGameDialogOpen(true);
  };

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
      <CollectionMenubar userId={session.user.id} />
      <div className="my-6">
        <CollectionProgress
          gameCount={gameCount}
          playedGames={playedGames}
          completedGames={completedGames}
        />
      </div>
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
              userId={session.user.id}
              playlists={userPlaylists}
              gamePlaylists={game.playlists}
              handleOpenRateGameDialog={handleOpenRateGameDialog}
            />
          </GameWithControls>
        ))}
      </LibraryView>
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
    // make a change here if you want
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label>Played</Label>
        <Progress value={playedGames} max={gameCount} />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Completed</Label>
        <Progress value={completedGames} max={gameCount} />
      </div>
    </div>
  );
}
