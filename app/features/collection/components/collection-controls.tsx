import { cn } from "@/util/cn";
import { RemoveFromCollectionButton } from "./remove-from-collection-button";
import { ReorderButtons } from "./reorder-buttons";
import { GameMenuButton } from "..";
import { Playlist } from "@/types/playlists";

interface CollectionControlsProps {
  gameId: number;
  userId: string;
  className?: string;
  playlists: Playlist[];
}

export function CollectionControls({
  gameId,
  userId,
  className,
  playlists,
}: CollectionControlsProps) {
  return (
    <div
      className={cn(
        className,
        "flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1",
      )}
    >
      <GameMenuButton gameId={gameId} userId={userId} playlists={playlists} />
    </div>
  );
}
