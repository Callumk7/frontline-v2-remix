import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Playlist } from "@/types/playlists";
import { useFetcher } from "@remix-run/react";

interface CollectionContextMenuProps {
	gameId: number;
	userId: string;
	playlists: Playlist[];
	gamePlaylists?: Playlist[];
	children: React.ReactNode;
}

export function CollectionContextMenu({
	gameId,
	userId,
	playlists,
	gamePlaylists,
	children,
}: CollectionContextMenuProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>{children}</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuSub>
					<ContextMenuSubTrigger>Add to playlist</ContextMenuSubTrigger>
					<ContextMenuSubContent>
						{playlists.map((playlist) => (
							<PlaylistSubMenuItem
								key={playlist.id}
								playlist={playlist}
								gameId={gameId}
								userId={userId}
								gamePlaylists={gamePlaylists}
							/>
						))}
					</ContextMenuSubContent>
				</ContextMenuSub>
			</ContextMenuContent>
		</ContextMenu>
	);
}

interface PlaylistSubMenuItemProps {
	playlist: Playlist;
	gameId: number;
	userId: string;
	gamePlaylists?: Playlist[];
}

function PlaylistSubMenuItem({
	playlist,
	gameId,
	userId,
	gamePlaylists,
}: PlaylistSubMenuItemProps) {
	const addToPlaylistFetcher = useFetcher();

	// This was just trying to validate the input, but it is kind of stupid
	// because the submit method has no validation.
	const gameInsert = {
		addedBy: userId,
	};

	return (
		<ContextMenuCheckboxItem
			key={playlist.id}
			checked={gamePlaylists?.some((p) => p.id === playlist.id)}
			onCheckedChange={(checked) => {
				if (checked) {
					addToPlaylistFetcher.submit(gameInsert, {
						method: "POST",
						action: `/api/playlists/${playlist.id}/games/${gameId}`,
					});
				} else {
					addToPlaylistFetcher.submit(
						{ gameId },
						{
							method: "DELETE",
							action: `/api/playlists/${playlist.id}/games/${gameId}`,
						},
					);
				}
			}}
		>
			{playlist.name}
		</ContextMenuCheckboxItem>
	);
}
