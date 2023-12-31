import { cn } from "@/util/cn";
import { RemoveFromCollectionButton } from "./remove-from-collection-button";
import { ReorderButtons } from "./reorder-buttons";

interface CollectionControlsProps {
  gameId: number;
  userId: string;
  className?: string;
}

export function CollectionControls({
  gameId,
  userId,
  className,
}: CollectionControlsProps) {
  return (
    <div
      className={cn(
        className,
        "flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1",
      )}
    >
      <RemoveFromCollectionButton gameId={gameId} userId={userId} />
      <ReorderButtons gameId={gameId} userId={userId} />
      {/*       <GameMenuButton gameId={gameId} userId={userId} /> */}
    </div>
  );
}
