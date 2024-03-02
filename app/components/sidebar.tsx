import { PlaylistContextMenu } from "@/features/playlists/components/playlist-context-menu";
import { PlaylistWithCreator } from "@/types/playlists";
import { UserWithActivityFeedEntry } from "@/types/users";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";
import {
  Button,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  usePlaylistDialogOpen,
} from ".";
import {
  AddedGameToPlaylistActivity,
  AddedToCollectionActivity,
  PlaylistCreatedActivity,
} from "./activity/feed";

interface SidebarProps {
  userId: string;
  playlists: PlaylistWithCreator[];
  hasSession: boolean;
  activityFeed: UserWithActivityFeedEntry[];
}

export function Sidebar({
  userId,
  playlists,
  hasSession,
  activityFeed,
}: SidebarProps) {
  const { setPlaylistDialogOpen } = usePlaylistDialogOpen();
  return (
    <div className="h-screen w-full border px-5 py-3">
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
          <ScrollArea className="w-full h-[90vh] mt-5">
            <div className="flex flex-col gap-2 py-4">
              {playlists.map((playlist) => (
                <SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="activity" className="pt-10">
          <ScrollArea className="w-full h-[90vh]">
            <ActivityFeed activityFeed={activityFeed} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SidebarPlaylistEntryProps {
  playlist: PlaylistWithCreator;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
  return (
    <PlaylistContextMenu>
      <Link
        to={`playlists/view/${playlist.id}`}
        className="flex items-center gap-2 rounded-md p-4 hover:bg-background-hover"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold">{playlist.name}</span>
          <span className="text-sm font-light text-gray-400">
            {playlist.creator.username}
          </span>
        </div>
      </Link>
    </PlaylistContextMenu>
  );
}

interface ActivityFeedProps {
  activityFeed: UserWithActivityFeedEntry[];
}
function ActivityFeed({ activityFeed }: ActivityFeedProps) {
  return (
    <div className="flex w-full flex-col gap-5 divide-y text-sm">
      {activityFeed.map((activity) =>
        activity.activity.type === "col_add" ? (
          <AddedToCollectionActivity
            user={activity}
            game={activity.activity.game}
          />
        ) : activity.activity.type === "pl_create" ? (
          <PlaylistCreatedActivity
            user={activity}
            playlist={activity.activity.playlist}
          />
        ) : activity.activity.type === "game_rated" ? (
          <GameRatedActivity activity={activity} />
        ) : activity.activity.type === "comment_add" ? (
          <CommentLeftActivity activity={activity} />
        ) : activity.activity.type === "pl_follow" ? (
          <PlaylistFollowedActivity activity={activity} />
        ) : activity.activity.type === "pl_add_game" ? (
          <AddedGameToPlaylistActivity
            user={activity}
            game={activity.activity.game}
            playlist={activity.activity.playlist}
          />
        ) : null
      )}
    </div>
  );
}
function GameRatedActivity({
  activity,
}: {
  activity: UserWithActivityFeedEntry;
}) {
  return <div>playlist created work in progress</div>;
}
function CommentLeftActivity({
  activity,
}: {
  activity: UserWithActivityFeedEntry;
}) {
  return <div>playlist created work in progress</div>;
}

function PlaylistFollowedActivity({
  activity,
}: {
  activity: UserWithActivityFeedEntry;
}) {
  return <div>playlist created work in progress</div>;
}
