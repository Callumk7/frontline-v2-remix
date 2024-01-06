import { CollectionControls } from "./collection-controls";
import { Playlist } from "@/types/playlists";
import { CollectionContextMenu } from "./collection-context-menu";
import { GameCover } from "@/features/library";
import { GameSlideOver } from "@/features/library/components/game-slideover";
import { GameWithCollection } from "@/types/games";
import { useState } from "react";
import { RateGameDialog } from "./rate-game-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CollectionGameProps {
  game: GameWithCollection;
  gamePlaylists: Playlist[];
  userPlaylists: Playlist[];
  coverId: string;
  gameId: number;
  userId: string;
}

// TODO: Improve the imports for this component

export function CollectionGame({
  game,
  gamePlaylists,
  userPlaylists,
  coverId,
  gameId,
  userId,
}: CollectionGameProps) {
  const [isRateGameDialogOpen, setIsRateGameDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <GameSlideOver game={game}>
            <CollectionContextMenu
              gameId={gameId}
              userId={userId}
              playlists={userPlaylists}
              gamePlaylists={gamePlaylists}
            >
              <GameCover coverId={coverId} />
            </CollectionContextMenu>
          </GameSlideOver>
          <CollectionControls
            gameId={gameId}
            userId={userId}
            playlists={userPlaylists}
            setIsRateGameDialogOpen={setIsRateGameDialogOpen}
            className="mt-1"
          />
        </TooltipTrigger>
        <TooltipContent>{game.title}</TooltipContent>
      </Tooltip>
      <RateGameDialog
        userId={userId}
        gameId={gameId}
        isRateGameDialogOpen={isRateGameDialogOpen}
        setIsRateDialogOpen={setIsRateGameDialogOpen}
      />
    </>
  );
}
