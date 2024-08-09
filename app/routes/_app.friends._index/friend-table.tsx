import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { UserWithPlaylistsFollowsGames } from "@/types";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Link, useFetcher } from "@remix-run/react";

interface FriendTableProps {
	friends: UserWithPlaylistsFollowsGames[];
}
export function FriendTable({ friends }: FriendTableProps) {
	const removeFetcher = useFetcher();
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Playlist Follows</TableHead>
					<TableHead>Playlists Created</TableHead>
					<TableHead>Games in Collection</TableHead>
					<TableHead>Controls</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{friends.map((friend) => (
					<TableRow key={friend.id}>
						<TableCell>
							<Link className="font-semibold" to={`/friends/${friend.id}`}>
								{friend.username}
							</Link>
						</TableCell>
						<TableCell>{friend.playlistFollows.length}</TableCell>
						<TableCell>{friend.playlists.length}</TableCell>
						<TableCell>{friend.games.length}</TableCell>
						<TableCell>
							<Button
								size="icon"
								variant="ghost"
								onClick={() =>
									removeFetcher.submit(
										{ friend_id: friend.id },
										{ method: "DELETE", action: "/friends" },
									)
								}
							>
								<Cross1Icon />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
