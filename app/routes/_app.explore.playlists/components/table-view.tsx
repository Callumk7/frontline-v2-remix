import {
	FollowPlaylistButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { useUserCacheStore } from "@/store";
import { PlaylistWithStuffAndCount } from "@/types";
import { Link } from "@remix-run/react";

interface PlaylistTableViewProps {
	userId: string;
	playlists: PlaylistWithStuffAndCount[];
}

export function PlaylistTableView({ userId, playlists }: PlaylistTableViewProps) {
	const followedPlaylists = useUserCacheStore((state) => state.followedPlaylists);
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Rating</TableHead>
					<TableHead>Followers</TableHead>
					<TableHead>Games</TableHead>
					<TableHead>Tags</TableHead>
					<TableHead>Controls</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell>
							<Link to={`/playlists/view/${playlist.id}`}>{playlist.name}</Link>
						</TableCell>
						<TableCell>{Math.floor(playlist.aggRating)}</TableCell>
						<TableCell>{playlist.followerCount}</TableCell>
						<TableCell>12</TableCell>
						<TableCell>tags</TableCell>
						<TableCell>
							<FollowPlaylistButton
								userId={userId}
								playlistId={playlist.id}
								isFollowedByUser={followedPlaylists.includes(playlist.id)}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
