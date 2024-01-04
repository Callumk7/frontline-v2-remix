import { Separator } from "@/components/ui/separator";
import { SearchEntryControls } from "@/features/explore";
import { IGDBGame } from "@/types/igdb";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";

interface GameListItemProps {
  game: IGDBGame;
  gameTitle: string;
  gameId: number;
  userId: string;
}

export function GameListItem({ gameTitle, game, gameId, userId }: GameListItemProps) {
  return (
    <div>
      <div className="relative flex w-full flex-row items-center justify-between rounded-md p-3 hover:bg-accent/60">
        <div className="flex flex-row space-x-2">
          <DragHandleDots1Icon className="h-6 w-6" />
          <p className="cursor-pointer font-bold text-foreground">{gameTitle}</p>
        </div>
        <SearchEntryControls
          gameId={gameId}
          userId={userId}
          isSaved={game.saved}
          className="mt-3"
        />
      </div>
      <Separator />
    </div>
  );
}
