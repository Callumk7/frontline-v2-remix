import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Outlet, useFetcher } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Container, Navbar, Sidebar } from "@/features/layout";
import { CreatePlaylistDialog } from "@/features/playlists";
import { createServerClient } from "@/features/auth/supabase/supabase.server";
import { Playlist } from "@/types/playlists";
import { createBrowserClient } from "@supabase/ssr";

export const meta: MetaFunction = () => {
  return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

// We are going to use this base route for supabase authentication. This is also where
// we define the basic layout, including navigation bar and sidebar.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // env variables that we need on the browser:
  const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const { supabase, headers } = createServerClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userPlaylists: Playlist[] = [];
  if (session) {
    // We need to get the user's playlists, so we can pass it to the sidebar.
    userPlaylists = await db.query.playlists.findMany({
      where: eq(playlists.creatorId, session.user.id),
    });
  }

  return typedjson({ ENV, session, userPlaylists }, { headers });
};

export default function AppLayout() {
  const { ENV, session, userPlaylists } = useTypedLoaderData<typeof loader>();
  const supaFetcher = useFetcher();
  // We create a single instance of Supabase to use across client components
  const [supabase] = useState(() =>
    createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY),
  );

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const serverAccessToken = session?.access_token;

  // This is all from the Remix example from supabase:
  // https://github.com/supabase/auth-helpers/blob/main/examples/remix
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== serverAccessToken && supaFetcher.state === "idle") {
        // server and client are out of sync.
        // Remix recalls active loaders after actions are complete
        supaFetcher.submit(null, {
          method: "POST",
          action: "/handle-supabase-auth",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [serverAccessToken, supabase, supaFetcher]);

  return (
    <>
      <div className="block h-full min-h-screen lg:grid lg:grid-cols-10">
        <div className="col-span-2 hidden h-full min-h-screen lg:block">
          <Sidebar playlists={userPlaylists} setDialogOpen={setDialogOpen} hasSession={session ? true : false} />
        </div>
        <div className="col-span-8 h-full">
          <Navbar supabase={supabase} session={session} />
          <Container className="mt-10">
            <Outlet context={{ supabase, session }} />
          </Container>
        </div>
      </div>
      {session && (
        <CreatePlaylistDialog
          userId={session.user.id}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}
    </>
  );
}
