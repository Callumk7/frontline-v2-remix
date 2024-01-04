import { createServerClient, getSession } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getUserGameCollection,
} from "@/features/collection";
import { transformCollectionIntoGames } from "@/features/collection/lib/get-game-collection";
import {
  getAllGenres,
  getGenresAndCount,
} from "@/features/collection/lib/get-user-genres";
import { LibraryView, useFilter, useSearch } from "@/features/library";
import { GenreFilter } from "@/features/library/components/genre-filter";
import { useSort } from "@/features/library/hooks/sort";
import { getUserPlaylists } from "@/features/playlists";
import { GameWithCollection } from "@/types/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    // there is no session, therefore, we are redirecting
    // to the landing page. The `/?index` is required here
    // for Remix to correctly call our loaders
    return redirect("/?index", {
      // we still need to return response.headers to attach the set-cookie header
      headers,
    });
  }

  const userCollectionPromise = getUserGameCollection(session.user.id);
  const userPlaylistsPromise = getUserPlaylists(session.user.id);
  const allGenresPromise = getAllGenres();

  const [userCollection, userPlaylists, allGenres] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
    allGenresPromise,
  ]);

  const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);
  const gameIds = games.map((game) => game.gameId);
  const genreNames = allGenres.map((genre) => genre.name);

  return typedjson({ session, userPlaylists, games, genreNames });
};

///
/// ROUTE
///
export default function CollectionRoute() {
  const { userPlaylists, games, session, genreNames } =
    useTypedLoaderData<typeof loader>();

  const {
		genreFilter,
		setGenreFilter,
		filteredGames,
		handleGenreToggled,
		handleToggleAllGenres,
		filterOnPlayed,
		filterOnCompleted,
		filterOnStarred,
		filterOnRated,
		filterOnUnrated,
		handleToggleFilterOnPlayed,
		handleToggleFilterOnCompleted,
		handleToggleFilterOnStarred,
		handleToggleFilterOnRated,
		handleToggleFilterOnUnrated,
  } = useFilter(games, genreNames);
  const { searchTerm, searchedGames, handleSearchTermChanged } = useSearch(filteredGames);
  const { sortOption, setSortOption, sortedGames } = useSort(searchedGames);

  return (
    <div>
      <div className="my-3">
        <GenreFilter
          genres={genreNames}
          genreFilter={genreFilter}
          handleGenreToggled={handleGenreToggled}
          handleToggleAllGenres={handleToggleAllGenres}
        />
      </div>
      <CollectionMenubar
        userId={session.user.id}
        searchTerm={searchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        handleSearchTermChanged={handleSearchTermChanged}
        filterOnPlayed={filterOnPlayed}
        filterOnCompleted={filterOnCompleted}
        filterOnRated={filterOnRated}
        filterOnUnrated={filterOnUnrated}
        filterOnStarred={filterOnStarred}
        handleToggleFilterOnPlayed={handleToggleFilterOnPlayed}
        handleToggleFilterOnCompleted={handleToggleFilterOnCompleted}
        handleToggleFilterOnRated={handleToggleFilterOnRated}
        handleToggleFilterOnUnrated={handleToggleFilterOnUnrated}
        handleToggleFilterOnStarred={handleToggleFilterOnStarred}
      />
      <LibraryView>
        {sortedGames.map((game) => (
          <CollectionGame
            game={game}
            userId={session.user.id}
            gameId={game.gameId}
            coverId={game.cover.imageId}
            key={game.gameId}
            userPlaylists={userPlaylists}
            gamePlaylists={game.playlists}
          />
        ))}
      </LibraryView>
    </div>
  );
}
