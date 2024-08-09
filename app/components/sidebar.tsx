import { PlaylistContextMenu, PlaylistDropdownMenu } from "@/features/playlists/components/playlist-context-menu";
import { PlaylistWithCreator } from "@/types/playlists";
import { UserWithActivityFeedEntry } from "@/types/users";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button, ScrollArea, usePlaylistDialogOpen } from ".";
interface SidebarProps {
	userId: string;
	playlists: PlaylistWithCreator[];
	hasSession: boolean;
}

export function Sidebar({ playlists, hasSession }: SidebarProps) {
	const { setPlaylistDialogOpen } = usePlaylistDialogOpen();
	return (
		<div className="py-3 px-3 w-full h-screen border">
			<h3>Playlists</h3>
			<div className="flex gap-5 mt-5">
				<Button
					onClick={() => setPlaylistDialogOpen(true)}
					variant={"outline"}
					size={"sm"}
					disabled={!hasSession}
					className="w-full"
				>
					<span className="mr-3">Create new</span>
					<PlusIcon />
				</Button>
			</div>
			<ScrollArea className="mt-5 w-full h-[90vh]">
				<div className="flex flex-col gap-2 py-4">
					{playlists.map((playlist) => (
						<SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

interface SidebarPlaylistEntryProps {
	playlist: PlaylistWithCreator;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
	return (
		<PlaylistContextMenu playlist={playlist}>
			<Link
				to={`playlists/view/${playlist.id}`}
				className="flex gap-2 justify-between items-start p-4 w-full rounded-md hover:bg-background-hover"
			>
				<div className="flex flex-col gap-1 w-3/5">
					<span className="text-sm font-bold">{playlist.name}</span>
					<span className="text-sm font-light text-gray-400">
						{playlist.creator.username}
					</span>
				</div>
        <PlaylistDropdownMenu playlist={playlist} />
			</Link>
		</PlaylistContextMenu>
	);
}

// Removing this incomplete feature from demo project.

//interface ActivityFeedProps {
//  activityFeed: UserWithActivityFeedEntry[];
//}
//function ActivityFeed({ activityFeed }: ActivityFeedProps) {
//  return (
//    <div className="flex flex-col gap-5 w-full text-sm divide-y">
//      {activityFeed.map((activity) =>
//        activity.activity.type === "col_add" ? (
//          <AddedToCollectionActivity
//            user={activity}
//            game={activity.activity.game}
//          />
//        ) : activity.activity.type === "pl_create" ? (
//          <PlaylistCreatedActivity
//            user={activity}
//            playlist={activity.activity.playlist}
//          />
//        ) : activity.activity.type === "game_rated" ? (
//          <GameRatedActivity activity={activity} />
//        ) : activity.activity.type === "comment_add" ? (
//          <CommentLeftActivity activity={activity} />
//        ) : activity.activity.type === "pl_follow" ? (
//          <PlaylistFollowedActivity activity={activity} />
//        ) : activity.activity.type === "pl_add_game" ? (
//          <AddedGameToPlaylistActivity
//            user={activity}
//            game={activity.activity.game}
//            playlist={activity.activity.playlist}
//          />
//        ) : null
//      )}
//    </div>
//  );
//}
//function GameRatedActivity({
//  activity,
//}: {
//  activity: UserWithActivityFeedEntry;
//}) {
//  return <div>playlist created work in progress</div>;
//}
//function CommentLeftActivity({
//  activity,
//}: {
//  activity: UserWithActivityFeedEntry;
//}) {
//  return <div>playlist created work in progress</div>;
//}
//
//function PlaylistFollowedActivity({
//  activity,
//}: {
//  activity: UserWithActivityFeedEntry;
//}) {
//  return <div>playlist created work in progress</div>;
//}
