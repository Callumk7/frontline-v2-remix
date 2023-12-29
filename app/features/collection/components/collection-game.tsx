import { CollectionControls } from "./collection-controls";
import { Playlist } from "@/types/playlists";
import { CollectionContextMenu } from "./collection-context-menu";
import { GameCover } from "@/features/library";
import { GameSlideOver } from "@/features/library/components/game-slideover";
import { GameWithCollection } from "@/types/games";

interface CollectionGameProps {
  game: GameWithCollection;
  gamePlaylists: Playlist[];
  userPlaylists: Playlist[];
  coverId: string;
  gameId: number;
  userId: string;
}

export function CollectionGame({
  game,
  gamePlaylists,
  userPlaylists,
  coverId,
  gameId,
  userId,
}: CollectionGameProps) {

  return (
    <GameSlideOver game={game}>
      <CollectionContextMenu
        gameId={gameId}
        userId={userId}
        playlists={userPlaylists}
        gamePlaylists={gamePlaylists}
      >
        <GameCover coverId={coverId} gameId={gameId} playlists={userPlaylists}>
          <CollectionControls gameId={gameId} userId={userId} />
        </GameCover>
      </CollectionContextMenu>
    </GameSlideOver>
  );
}
