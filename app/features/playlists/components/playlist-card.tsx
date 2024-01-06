import { DBImage } from "@/features/library/components/game-cover";
import { GameWithCover } from "@/types/games";
import { Playlist } from "@/types/playlists";
import { Link } from "@remix-run/react";

interface PlaylistCardProps {
  playlistId: string;
  playlistName: string;
  games: {
    id: string;
    cover: {
      imageId: string;
    }
  }[];
  creator: {
    id: string;
    email: string;
  };
}

export function PlaylistCard({ playlistId, playlistName, games, creator }: PlaylistCardProps) {
  return (
    <div className="h-fit w-full rounded-lg bg-background-3 p-5">
      <Link className="font-bold hover:underline" to={`/playlists/${playlistId}`}>
        {playlistName}
      </Link>
      <p>{creator.email}</p>
      <div className="flex gap-1">
        {games.map((game) => (
          <div key={game.id} className="aspect-auto w-24">
            <DBImage imageId={game.cover.imageId} size="cover_big" />
          </div>
        ))}
      </div>
    </div>
  );
}
