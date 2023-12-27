import { auth } from "@/features/auth/helper";
import { CollectionControls } from "@/features/collection/components/collection-controls";
import { CollectionMenubar } from "@/features/collection/components/collection-menubar";
import { GameSearch } from "@/features/collection/components/game-search";
import { getUserGameCollection } from "@/features/collection/lib/get-game-collection";
import { GameCover } from "@/features/library/game-cover";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { playlists } from "db/schema/playlists";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const userCollection = await getUserGameCollection(session.id);

  const userPlaylists = await db.query.playlists.findMany({
    where: eq(playlists.creatorId, session.id),
  })

  return json({ userCollection, session, userPlaylists });
};

export default function CollectionRoute() {
  const { session, userCollection, userPlaylists } = useLoaderData<typeof loader>();

  return (
    <div>
      <CollectionMenubar userId={session.id} />
      <div className="grid grid-cols-1 gap-4 rounded-md py-4 md:w-full md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {userCollection.map((game, i) => (
          <GameCover key={game.gameId} coverId={game.game.cover.imageId} playlists={userPlaylists}>
            <CollectionControls gameId={game.gameId} userId={session.id} index={i} />
          </GameCover>
        ))}
      </div>
    </div>
  );
}
