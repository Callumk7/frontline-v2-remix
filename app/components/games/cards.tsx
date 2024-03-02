import { useCollectionStore } from "@/store/collection";
import { IGDBImage } from "@/types/igdb";
import { cn } from "@/util/cn";
import { Link } from "@remix-run/react";
import { HTMLAttributes, ReactNode } from "react";

interface GameCoverProps extends HTMLAttributes<HTMLDivElement> {
  coverId: string;
  gameId: number;
  isSelected?: boolean;
}

export function GameCover({ coverId, gameId, isSelected }: GameCoverProps) {
  const size: IGDBImage = "720p";

  const getBorderStyle = (isSelected: boolean) =>
    isSelected
      ? "border border-lime-500/40 hover:border-lime-500 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40"
      : "border hover:border-foreground";

  const borderStyle = getBorderStyle(isSelected || false);

  return (
    <Link
      to={`/collection/${gameId}`}
      className={cn(
        borderStyle,
        "relative flex max-w-sm flex-col items-center justify-between overflow-hidden rounded-lg text-foreground"
      )}
    >
      <DBImage imageId={coverId} size={size} />
    </Link>
  );
}

interface DBImageProps {
  imageId: string;
  size: IGDBImage;
  className?: string;
}

export function DBImage({ imageId, size, className }: DBImageProps) {
  return (
    <img
      src={`https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`}
      alt="game cover art"
      className={cn(className, "h-full w-full")}
    />
  );
}
interface GameWithControlsProps {
  children: ReactNode;
  coverId: string;
  gameId: number;
}
export function GameWithControls({
  children,
  coverId,
  gameId,
}: GameWithControlsProps) {
  const selectedGames = useCollectionStore((state) => state.selectedGames);
  const isSelected = selectedGames.includes(gameId);
  return (
    <div className="flex flex-col gap-1">
      <GameCover coverId={coverId} gameId={gameId} isSelected={isSelected} />
      {children}
    </div>
  );
}
