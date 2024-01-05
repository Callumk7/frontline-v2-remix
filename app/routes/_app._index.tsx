import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { games, usersToGames } from "db/schema/games";
import { eq, gt, sql } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  const popularGames = await db
    .select({
      gameId: usersToGames.gameId,
      count: sql<number>`cast(count( ${usersToGames.gameId} ) as int)`,
      game: games,
    })
    .from(usersToGames)
    .groupBy(usersToGames.gameId);

  popularGames.sort((a, b) => b.count - a.count);

  return json({ popularGames }, { headers });
};

export default function AppIndex() {
  const { popularGames } = useLoaderData<typeof loader>();
  return <Container>{JSON.stringify(popularGames)}</Container>;
}
