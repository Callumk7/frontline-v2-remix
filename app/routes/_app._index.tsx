import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { LibraryView } from "@/features/library";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { desc, eq, gt, sql } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  const topRatedGames = await db.query.usersToGames.findMany({
    with: {
      game: {
        with: {
          cover: true,
        },
      },
    },
    where: gt(usersToGames.playerRating, 50),
  });

  topRatedGames.sort((a, b) => {
    const ratingA = a.playerRating ?? 0;
    const ratingB = b.playerRating ?? 0;
    return ratingB - ratingA;
  });

  const averageRatedGames = await db
    .select({
      gameId: usersToGames.gameId,
      averageRating: sql`avg(${usersToGames.playerRating})`.mapWith(Number),
      averageRatingCount: sql`count(${usersToGames.playerRating})`,
    })
    .from(usersToGames)
    .groupBy(usersToGames.gameId)
    .orderBy(desc( sql`avg(${usersToGames.playerRating})`.mapWith(Number) ));

  const popularGames = await db
    .select({
      gameId: usersToGames.gameId,
      count: sql<number>`cast(count( ${usersToGames.gameId} ) as int)`,
    })
    .from(usersToGames)
    .groupBy(usersToGames.gameId);

  popularGames.sort((a, b) => b.count - a.count);

  return json({ topRatedGames, averageRatedGames }, { headers });
};

export default function AppIndex() {
  const { topRatedGames } = useLoaderData<typeof loader>();
  return (
    <Container>
      <LibraryView>
        {topRatedGames.map((entry) => (
          <div key={entry.gameId}>
            <h1>{entry.game.title}</h1>
            <p>{entry.playerRating}</p>
          </div>
        ))}
      </LibraryView>
    </Container>
  );
}
