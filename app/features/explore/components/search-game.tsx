import { GameCover } from "@/features/library";
import { SearchEntryControls } from "..";
import { IGDBGame } from "@/types/igdb";

interface ExploreGameProps {
  game: IGDBGame;
  coverId: string;
  gameId: number;
  userId: string;
}

export function ExploreGame({ game, coverId, gameId, userId }: ExploreGameProps) {
  return (
    <div>
      <GameCover coverId={coverId} />
      <SearchEntryControls
        gameId={gameId}
        userId={userId}
        isSaved={game.saved}
        className="mt-3"
      />
    </div>
  );
}
