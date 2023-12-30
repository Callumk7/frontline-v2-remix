import { createServerClient, getSession } from "@/features/auth";
import { GameCover, LibraryView } from "@/features/library";
import { getPlaylistWithGames, getUserPlaylists } from "@/features/playlists";
import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";

///
/// LOADER 
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

  const { playlistId } = zx.parseParams(params, {
    playlistId: z.string(),
  });

  const playlistWithGamesPromise = getPlaylistWithGames(playlistId);
  const allPlaylistsPromise = getUserPlaylists(session.user.id);

  const [playlistWithGames, allPlaylists] = await Promise.all([
    playlistWithGamesPromise,
    allPlaylistsPromise,
  ]);

  return typedjson({ playlistId, playlistWithGames });
};

///
/// ROUTE 
///
export default function PlaylistRoute() {
  const { playlistWithGames } = useTypedLoaderData<typeof loader>();
  return (
    <LibraryView>
      {playlistWithGames?.games.map((game) => (
        <GameCover
          key={game.game.id}
          coverId={game.game.cover.imageId}
        />
      ))}
    </LibraryView>
  );
}
