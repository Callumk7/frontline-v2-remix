import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  Checkbox,
  DropdownMenuItemDestructive,
} from "@/components";
import { Playlist } from "@/types/playlists";
import {
  HamburgerMenuIcon,
  MixIcon,
  PlusIcon,
  SewingPinIcon,
  StarFilledIcon,
  StarIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { useCollectionControls } from "./hooks/controls";
import { ReactNode } from "react";
import { useCollectionStore } from "@/store/collection";

interface CollectionGameMenuProps {
  gameId: number;
  isPlayed: boolean;
  isCompleted: boolean;
  isPinned: boolean;
  userId: string;
  playlists?: Playlist[];
  gamePlaylists?: Playlist[];
  handleOpenRateGameDialog: (gameId: number) => void;
}

export function CollectionGameMenu({
  gameId,
  isPlayed,
  isCompleted,
  isPinned,
  userId,
  playlists,
  gamePlaylists,
  handleOpenRateGameDialog,
}: CollectionGameMenuProps) {
  const {
    handleRemove,
    handleMarkAsPlayed,
    handleMarkAsCompleted,
    handleTogglePinned,
  } = useCollectionControls(userId, gameId, isPlayed, isCompleted, isPinned);

  const selectModeOn = useCollectionStore((state) => state.selectModeOn);
  const selectedGames = useCollectionStore((state) => state.selectedGames);
  const setSelectedGames = useCollectionStore(
    (state) => state.setSelectedGames
  );

  // should this be in the useCollectionControls hook?
  const handleToggleCheck = () => {
    if (selectedGames && setSelectedGames) {
      if (selectedGames.includes(gameId)) {
        setSelectedGames(selectedGames.filter((g) => g !== gameId));
      } else {
        setSelectedGames([...selectedGames, gameId]);
      }
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <HamburgerMenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {playlists && (
            <PlaylistSubMenu
              userId={userId}
              gameId={gameId}
              playlists={playlists}
              gamePlaylists={gamePlaylists}
            />
          )}

          <DropdownMenuItem onClick={() => handleOpenRateGameDialog(gameId)}>
            <MixIcon className="mr-3" />
            <span>Rate game</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMarkAsPlayed}>
            {isPlayed ? (
              <StarFilledIcon className="mr-3 text-primary" />
            ) : (
              <StarIcon className="mr-3" />
            )}
            <span>Mark as played</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleMarkAsCompleted}>
            {isCompleted ? (
              <StarFilledIcon className="mr-3 text-primary" />
            ) : (
              <StarIcon className="mr-3" />
            )}
            <span>Mark as completed</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleTogglePinned}>
            <SewingPinIcon
              className={`mr-3 ${isPinned ? "text-primary" : ""}`}
            />
            <span>Pin game</span>
          </DropdownMenuItem>

          <DropdownMenuItemDestructive onClick={handleRemove}>
            <TrashIcon className="mr-3" />
            <span>Remove from collection</span>
          </DropdownMenuItemDestructive>
        </DropdownMenuContent>
      </DropdownMenu>
      {selectModeOn && selectedGames && (
        <Checkbox
          checked={selectedGames.includes(gameId)}
          onCheckedChange={handleToggleCheck}
          className="w-5 h-5"
        />
      )}
    </div>
  );
}

interface PlaylistSubMenuProps {
  userId: string;
  gameId: number;
  playlists: Playlist[];
  gamePlaylists?: Playlist[];
}

function PlaylistSubMenu({
  playlists,
  userId,
  gameId,
  gamePlaylists,
}: PlaylistSubMenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <PlusIcon className="mr-2" />
        <span>Add to playlist</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {playlists.map((playlist) => (
          <PlaylistSubMenuItem
            key={playlist.id}
            playlist={playlist}
            gameId={gameId}
            userId={userId}
            gamePlaylists={gamePlaylists}
          />
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
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

  const gameInsert = {
    addedBy: userId,
  };

  return (
    <DropdownMenuCheckboxItem
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
            }
          );
        }
      }}
    >
      {playlist.name}
    </DropdownMenuCheckboxItem>
  );
}

interface CollectionDropdownToggleItemProps {
  onClick: () => void;
  toggle: boolean;
  toggleOnComponent: ReactNode;
  toggleOffComponent: ReactNode;
  children: ReactNode;
}
export function CollectionDropdownToggleItem({
  onClick,
  toggle,
  toggleOnComponent,
  toggleOffComponent,
  children,
}: CollectionDropdownToggleItemProps) {
  return (
    <DropdownMenuItem onClick={onClick}>
      {toggle ? toggleOnComponent : toggleOffComponent}
      {children}
    </DropdownMenuItem>
  );
}
