import { DBImage } from "@/components";
import { FollowPlaylistButton } from "@/features/playlists/components/follow-playlist-button";
import { PlaylistGenres } from "@/routes/res.playlist-genres";
import { PlaylistWithFollowers, PlaylistWithStuffAndCount } from "@/types/playlists";
import { Link } from "@remix-run/react";

interface PlaylistCardProps {
	playlist: PlaylistWithStuffAndCount;
	games: {
		id: string;
		gameId: number;
		cover: {
			imageId: string;
		};
	}[];
	creator: {
		id: string;
		username: string;
	};
	userId: string;
}

export function PlaylistCard({ playlist, games, creator }: PlaylistCardProps) {
	return (
		<Link
			to={`/playlists/view/${playlist.id}`}
			className="relative flex w-full justify-between gap-3 overflow-hidden rounded-lg bg-background-3 p-5 transition-colors ease-in-out hover:bg-primary/10"
		>
			<div className="flex w-1/3 flex-col gap-4">
				<h1 className="text-2xl font-semibold">{playlist.name}</h1>
				<p className="overflow-clip text-sm text-primary">{creator.username}</p>
				<PlaylistGenres gameIds={games.map((game) => game.gameId)} />
			</div>
			<div className="grid h-fit w-1/2 grid-cols-4 overflow-hidden rounded-lg">
				{games.map((game) => (
					<div key={game.id}>
						<DBImage imageId={game.cover.imageId} size="cover_big" />
					</div>
				))}
			</div>
		</Link>
	);
}
