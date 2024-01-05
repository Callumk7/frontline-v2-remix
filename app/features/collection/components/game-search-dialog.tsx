import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Link, useFetcher } from "@remix-run/react";
import type { loader } from "@/routes/api.search"
import { Input } from "@/components/ui/form";
import { IGDBGame } from "@/types/igdb";
import { SaveToCollectionButton } from "@/features/explore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GameSearchDialogProps {
  userId: string;
}

interface SearchResultProps {
  game: IGDBGame;
  userId: string;
}

export function GameSearchDialog({ userId }: GameSearchDialogProps) {
  // recommended from discord: you can import the type from the route,
  // and then use it as a type arg.
  const fetcher = useFetcher<typeof loader>();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <MagnifyingGlassIcon className="mr-3 h-4 w-4" />
          <span>Add more</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search for Games</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="get" action="/api/search" className="w-full">
          <Input
            name="search"
            placeholder="Search for a game"
            onChange={(e) => fetcher.submit(e.target.form)}
            className="w-full"
            autoComplete="off"
          />
        </fetcher.Form>
        <ScrollArea className="h-80 w-full">
          <div>
            {fetcher.data
              ? fetcher.data.map((game) => (
                  <SearchResult key={game.id} game={game} userId={userId} />
                ))
              : null}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant={"muted"} asChild>
            <Link to="/explore">
              <span className="mr-3">Full Screen</span>
              <ChevronRightIcon />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SearchResult({ game, userId }: SearchResultProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2 py-2">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`}
          alt={game.name}
          width={45}
          height={64}
          className="overflow-hidden rounded-md"
        />
        <div>{game.name}</div>
      </div>
      <SaveToCollectionButton gameId={game.id} userId={userId} />
    </div>
  );
}
