import { DBImage } from "@/features/library/components/game-cover";
import { GameWithCover } from "@/types/games";
import { Playlist } from "@/types/playlists";
import { Link } from "@remix-run/react";

interface PlaylistCardProps {
  playlist: Playlist;
  games: GameWithCover[];
}
export function PlaylistCard({ playlist, games }: PlaylistCardProps) {
  return (
    <div className="h-fit w-full rounded-lg bg-background-3 p-5">
      <Link className="font-bold hover:underline" to={`/playlists/${playlist.id}`}>
        {playlist.name}
      </Link>
      <div className="flex gap-1">
        {games.map(game => (
          <div key={game.id} className="w-24 aspect-auto">
            <DBImage imageId={game.cover.imageId} size="cover_big" />
          </div>
        ))}
      </div>
    </div>
  );
}
