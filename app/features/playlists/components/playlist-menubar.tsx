import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Game } from "@/types/games";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface PlaylistMenubarProps {
  games: Game[];
  playlistId: string;
  userId: string;
  setRenameDialogOpen: (renameDialogOpen: boolean) => void;
}

export function PlaylistMenubar({ games, playlistId, userId, setRenameDialogOpen }: PlaylistMenubarProps) {
  const addGameFetcher = useFetcher();
  return (
    <div className="flex justify-between">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Playlist</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Delete</MenubarItem>
            <MenubarItem onClick={() => setRenameDialogOpen(true)}>Rename</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Add Games</MenubarTrigger>
          <MenubarContent>
            {games.map((game) => (
              <MenubarItem
                key={game.id}
                onClick={() =>
                  addGameFetcher.submit(
                    {
                      addedBy: userId,
                    },
                    {
                      action: `/api/playlists/${playlistId}/games/${game.gameId}`,
                      method: "POST",
                    },
                  )
                }
              >
                {game.title}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
