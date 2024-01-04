import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { IGDB_BASE_URL } from "@/constants";
import { createServerClient, getSession } from "@/features/auth";
import { getCollectionGameIds } from "@/features/collection";
import { markResultsAsSaved } from "@/features/explore";
import { ExploreGame } from "@/features/explore/components/SearchGame";
import { LibraryView } from "@/features/library";
import { FetchOptions, fetchGamesFromIGDB } from "@/lib/igdb";
import { IGDBGame, IGDBGameSchemaArray } from "@/types/igdb";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";

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
  const gameIds = await getCollectionGameIds(session.user.id);

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const genreIdsParam = url.searchParams.get("genre_ids");
  const genreIds: number[] = genreIdsParam ? genreIdsParam.split(",").map(Number) : [];

  // Search results from IGDB
  let searchResults: IGDBGame[] = [];
  const searchOptions: FetchOptions = {
    fields: ["name", "cover.image_id"],
    limit: 30,
    filters: [
      "cover != null",
      "parent_game = null",
      "version_parent = null",
      "themes != (42)",
    ],
  };

  if (search) {
    searchOptions.search = search;
    if (genreIds.length > 0) {
      searchOptions.filters?.push(`genres = (${genreIds.join(",")})`);
    }
  } else {
    searchOptions.sort = ["rating desc"];
    searchOptions.filters?.push("follows > 250", "rating > 80");
  }
  const results = await fetchGamesFromIGDB(IGDB_BASE_URL, searchOptions);

  try {
    const parsedGames = IGDBGameSchemaArray.parse(results);
    searchResults = parsedGames;
  } catch (e) {
    console.error(e);
  }

  const resultsMarkedAsSaved = markResultsAsSaved(searchResults, gameIds);

  return typedjson({ resultsMarkedAsSaved, session });
};

export default function ExploreRoute() {
  const { resultsMarkedAsSaved, session } = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex flex-col gap-y-6">
        <Form method="get" className="flex max-w-md gap-3">
          <Input name="search" type="search" placeholder="What are you looking for?" />
          <Button variant={"outline"}>Search</Button>
        </Form>
        <LibraryView>
          {resultsMarkedAsSaved.map((game) => (
            <ExploreGame
              key={game.id}
              game={game}
              coverId={game.cover.image_id}
              gameId={game.id}
              userId={session.user.id}
            />
          ))}
        </LibraryView>
      </div>
    </div>
  );
}
