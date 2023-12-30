import { createServerClient, getSession } from "@/features/auth";
import {
  CollectionGame,
  CollectionMenubar,
  getUserGameCollection,
} from "@/features/collection";
import { transformCollectionIntoGames } from "@/features/collection/lib/get-game-collection";
import { LibraryView, useSearch } from "@/features/library";
import { useSort } from "@/features/library/hooks/sort";
import { getUserPlaylists } from "@/features/playlists";
import { GameWithCollection } from "@/types/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
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

  const [userCollection, userPlaylists] = await Promise.all([
    userCollectionPromise,
    userPlaylistsPromise,
  ]);

  const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);

  return typedjson({ session, userPlaylists, games });
};

///
/// ROUTE
///
export default function CollectionRoute() {
  const { userPlaylists, games } = useTypedLoaderData<typeof loader>();
  const { supabase, session } = useOutletContext<{
    supabase: SupabaseClient;
    session: Session;
  }>();

  const { searchTerm, searchedGames, handleSearchTermChanged } = useSearch(games);

  const { sortOption, setSortOption, sortedGames } = useSort(searchedGames);

  return (
    <div>
      <CollectionMenubar
        userId={session.user.id}
        searchTerm={searchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        handleSearchTermChanged={handleSearchTermChanged}
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
