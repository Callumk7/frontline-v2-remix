import { PlaylistContextMenu } from "@/features/playlists/components/playlist-context-menu";
import { Playlist } from "@/types/playlists";
import { UserWithActivityFeedEntry } from "@/types/users";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from ".";
import { SavedToCollectionActivity } from "@/routes/res.game.$gameId";

interface SidebarProps {
	userId: string;
	playlists: Playlist[];
	setDialogOpen: (open: boolean) => void;
	hasSession: boolean;
	activityFeed: UserWithActivityFeedEntry[];
}

export function Sidebar({
	userId,
	playlists,
	setDialogOpen,
	hasSession,
	activityFeed,
}: SidebarProps) {
	return (
		<div className="h-full w-full border px-5 py-3">
			<Tabs defaultValue="playlists">
				<TabsList className="w-full">
					<TabsTrigger value="playlists" className="w-full">
						Playlists
					</TabsTrigger>
					<TabsTrigger value="activity" className="w-full">
						Activity
					</TabsTrigger>
				</TabsList>
				<TabsContent value="playlists">
					<div className="mt-5 flex gap-5">
						<Button
							onClick={() => setDialogOpen(true)}
							variant={"outline"}
							size={"sm"}
							disabled={!hasSession}
						>
							<span className="mr-3">Create new</span>
							<PlusIcon />
						</Button>
						<Button size={"sm"} variant={"outline"}>
							<HamburgerMenuIcon />
						</Button>
					</div>
					<div className="flex flex-col gap-2 py-4">
						{playlists.map((playlist) => (
							<SidebarPlaylistEntry
								key={playlist.id}
								playlist={playlist}
								isCreator={playlist.creatorId === userId}
							/>
						))}
					</div>
				</TabsContent>
				<TabsContent value="activity" className="pt-10">
					<ActivityFeed activityFeed={activityFeed} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

interface SidebarPlaylistEntryProps {
	playlist: Playlist;
	isCreator: boolean;
}

function SidebarPlaylistEntry({ playlist, isCreator }: SidebarPlaylistEntryProps) {
	return (
		<PlaylistContextMenu asChild>
			<Link
				to={`playlists/view/${playlist.id}`}
				className="flex items-center gap-2 rounded-md p-4 hover:bg-background-hover"
			>
				{isCreator && <div className="h-2 w-2 rounded-full bg-primary" />}
				<span className="text-sm font-bold">{playlist.name}</span>
			</Link>
		</PlaylistContextMenu>
	);
}

interface ActivityFeedProps {
	activityFeed: UserWithActivityFeedEntry[];
}
function ActivityFeed({ activityFeed }: ActivityFeedProps) {
	return (
		<div className="flex w-full flex-col gap-5">
			{activityFeed.map((activity) =>
				activity.activity.type === "col_add" ? (
					<SavedToCollectionActivity activity={activity} />
				) : activity.activity.type === "pl_create" ? (
					<PlaylistCreateActivity activity={activity} />
				) : activity.activity.type === "game_rated" ? (
					<GameRatedActivity activity={activity} />
				) : activity.activity.type === "comment_add" ? (
					<CommentLeftActivity activity={activity} />
				) : activity.activity.type === "pl_follow" ? (
					<PlaylistFollowedActivity activity={activity} />
				) : activity.activity.type === "pl_add_game" ? (
					<PlaylistAddGameActivity activity={activity} />
				) : null,
			)}
		</div>
	);
}

function PlaylistCreateActivity({ activity }: { activity: UserWithActivityFeedEntry }) {
	return <div>playlist created work in progress</div>;
}

function GameRatedActivity({ activity }: { activity: UserWithActivityFeedEntry }) {
	return <div>playlist created work in progress</div>;
}
function CommentLeftActivity({ activity }: { activity: UserWithActivityFeedEntry }) {
	return <div>playlist created work in progress</div>;
}

function PlaylistFollowedActivity({ activity }: { activity: UserWithActivityFeedEntry }) {
	return <div>playlist created work in progress</div>;
}

function PlaylistAddGameActivity({ activity }: { activity: UserWithActivityFeedEntry }) {
	return <div>playlist created work in progress</div>;
}
