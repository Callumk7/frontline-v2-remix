import { cn } from "@/util/cn";
import { GameMenuButton } from "..";
import { Playlist } from "@/types/playlists";

interface CollectionControlsProps {
  gameId: number;
  userId: string;
  className?: string;
  playlists: Playlist[];
  setIsRateGameDialogOpen: (isDialogOpen: boolean) => void;
}

export function CollectionControls({
  gameId,
  userId,
  className,
  playlists,
  setIsRateGameDialogOpen,
}: CollectionControlsProps) {
  return (
    <div
      className={cn(
        className,
        "flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1",
      )}
    >
      <GameMenuButton
        gameId={gameId}
        userId={userId}
        playlists={playlists}
        setIsRateGameDialogOpen={setIsRateGameDialogOpen}
      />
    </div>
  );
}
