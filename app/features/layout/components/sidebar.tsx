import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlaylistContextMenu } from "@/features/playlists/components/playlist-context-menu";
import { Playlist } from "@/types/playlists";
import { PlusIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface SidebarProps {
  playlists: Playlist[];
  setDialogOpen: (open: boolean) => void;
  hasSession: boolean;
}

export function Sidebar({ playlists, setDialogOpen, hasSession }: SidebarProps) {
  return (
    <div className="h-full w-full border py-3 pl-8 pr-3">
      <div className="flex w-full justify-between">
        <h2 className="pb-2 pt-4 font-bold">Playlists</h2>
        <Button onClick={() => setDialogOpen(true)} variant={"ghost"} disabled={!hasSession}>
          <PlusIcon />
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-2 py-4">
        {playlists.map((playlist) => (
          <SidebarPlaylistEntry key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}

interface SidebarPlaylistEntryProps {
  playlist: Playlist;
}

function SidebarPlaylistEntry({ playlist }: SidebarPlaylistEntryProps) {
  return (
    <PlaylistContextMenu asChild>
      <Link
        to={`playlists/${playlist.id}`}
        className="rounded-md p-4 hover:bg-background-hover"
      >
        <span className="text-sm font-bold">{playlist.name}</span>
      </Link>
    </PlaylistContextMenu>
  );
}
