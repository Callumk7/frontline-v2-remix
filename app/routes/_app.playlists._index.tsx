import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { PlaylistCard } from "@/features/playlists/components/playlist-card";
import { getPlaylistsWithGames } from "@/features/playlists/lib/get-playlists-with-games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";

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

  const allPlaylists = await getPlaylistsWithGames(10);

  return typedjson({ allPlaylists });
};


export default function PlaylistView() {
  const { allPlaylists } = useTypedLoaderData<typeof loader>();

  return (
    <Container>
      <div className="grid grid-cols-4 gap-3">
        {allPlaylists.map((pl) => (
          <PlaylistCard key={pl.id} playlist={pl} games={pl.games.map(p => p.game)} />
        ))}
      </div>
    </Container>
  );
}
