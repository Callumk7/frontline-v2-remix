import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";

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

  const allPlaylists = await db.select().from(playlists);

  return json({ allPlaylists });
};


export default function PlaylistView() {
  const { allPlaylists } = useLoaderData<typeof loader>();

  return (
    <Container>
      <div className="grid grid-cols-4 gap-3">
        {allPlaylists.map((pl) => (
          <div key={pl.id} className="rounded-lg bg-background-3 h-44 w-full p-5">
            <Link className="font-bold hover:underline" to={`/playlists/${pl.id}`}>{pl.name}</Link>
          </div>
        ))}
      </div>
    </Container>
  );
}
