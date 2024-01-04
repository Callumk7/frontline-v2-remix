import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Playlist } from "@/types/playlists";
import {
  HamburgerMenuIcon,
  MixIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface GameMenuButtonProps {
  gameId: number;
  userId: string;
  playlists: Playlist[];
}

export function GameMenuButton({ gameId, userId, playlists }: GameMenuButtonProps) {
  const fetcher = useFetcher();
  const handleRemove = () => {
    fetcher.submit(
      {
        gameId,
        userId,
      },
      {
        method: "delete",
        action: "/api/collections",
      },
    );
  };

  const handleMarkAsPlayed = () => {
    fetcher.submit({
      gameId,
      played: true
    }, {
        method: "put",
        action: `/api/collections/${userId}`
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <HamburgerMenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PlusIcon className="mr-2" />
            <span>Add to playlist</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {playlists.map((pl) => (
              <DropdownMenuItem key={pl.id}>{pl.name}</DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <MixIcon className="mr-2" />
          <span>Rate game</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMarkAsPlayed}>
          <StarIcon className="mr-2" />
          <span>Mark as played</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRemove}>
          <TrashIcon className="mr-2" />
          <span>Remove from collection</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
