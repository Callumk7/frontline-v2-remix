import {
	FollowPlaylistButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { PlaylistWithStuffAndCount } from "@/types";
import { Link } from "@remix-run/react";

interface PlaylistTableViewProps {
	userId: string;
	playlists: PlaylistWithStuffAndCount[];
	followedPlaylists: string[];
}

export function PlaylistTableView({
	userId,
	playlists,
	followedPlaylists,
}: PlaylistTableViewProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name </TableHead>
					<TableHead> Rating </TableHead>
					<TableHead> Followers </TableHead>
					<TableHead> Games </TableHead>
					<TableHead> Controls </TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlists.map((playlist) => (
					<TableRow key={playlist.id}>
						<TableCell>
							<Link to={`/playlists/view/${playlist.id}`}> {playlist.name} </Link>
						</TableCell>
						<TableCell> {Math.floor(playlist.aggRating)} </TableCell>
						<TableCell> {playlist.followerCount} </TableCell>
						<TableCell> 12 </TableCell>
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
