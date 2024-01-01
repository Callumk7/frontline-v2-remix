import { Separator } from "@/components/ui/separator";
import { createServerClient, getSession } from "@/features/auth";
import { GameCover, LibraryView } from "@/features/library";
import { getPlaylistWithGames, getUserPlaylists } from "@/features/playlists";
import { PlaylistMenubar } from "@/features/playlists/components/playlist-menubar";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { games, usersToGames } from "db/schema/games";
import { eq } from "drizzle-orm";
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
  const userCollectionPromise = db.query.usersToGames.findMany({
    where: eq(usersToGames.userId, session.user.id),
    with: {
      game: true,
    },
  });

  const [playlistWithGames, allPlaylists, userCollection] = await Promise.all([
    playlistWithGamesPromise,
    allPlaylistsPromise,
    userCollectionPromise,
  ]);

  const gamesArray = userCollection.map((collection) => collection.game);

  return typedjson({ playlistId, playlistWithGames, gamesArray });
};

///
/// ROUTE
///
export default function PlaylistRoute() {
  const { playlistWithGames, gamesArray } = useTypedLoaderData<typeof loader>();
  return (
    <div>
      <PlaylistMenubar
        games={gamesArray}
        playlistId={playlistWithGames?.id}
        userId={playlistWithGames?.creatorId}
      />
      <h1 className="mt-5 py-2 text-3xl font-semibold">{playlistWithGames?.name}</h1>
      <Separator />
      <LibraryView>
        {playlistWithGames?.games.map((game) => (
          <GameCover key={game.game.id} coverId={game.game.cover.imageId} />
        ))}
      </LibraryView>
    </div>
  );
}
