import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  CollectionGameMenu,
} from "@/components";
import { useCollectionStore } from "@/store/collection";
import { GameWithCollection, Playlist } from "@/types";
import { CheckIcon, DrawingPinIcon } from "@radix-ui/react-icons";
import { Link } from "@remix-run/react";

interface CollectionTableViewProps {
  sortedGames: GameWithCollection[];
  userPlaylists: Playlist[];
  userId: string;
  handleOpenRateGameDialog: (gameId: number) => void;
}

export function CollectionTableView({
  sortedGames,
  userPlaylists,
  userId,
  handleOpenRateGameDialog,
}: CollectionTableViewProps) {
  const store = useCollectionStore();
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => store.handleToggleSortName()}
              className="cursor-pointer"
            >
              Title
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => store.handleToggleSortRating()}
            >
              Aggregated Rating
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => store.handleTogglePlayerRating()}
            >
              Your Rating
            </TableHead>
            <TableHead>Played?</TableHead>
            <TableHead>Completed?</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => store.handleToggleSortReleaseDate()}
            >
              Release Date
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => store.handleToggleSortDateAdded()}
            >
              Date Saved
            </TableHead>
            <TableHead>Menu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedGames.map((game) => (
            <TableRow key={game.id}>
              <TableCell className="font-semibold flex items-center">
                <DrawingPinIcon className={game.pinned ? "text-primary" : ""} />
                <Link to={`/collection/${game.gameId}`} className="ml-3">
                  <span>{game.title}</span>
                </Link>
              </TableCell>
              <TableCell>{game.rating}</TableCell>
              <TableCell>{game.playerRating}</TableCell>
              <TableCell>{game.played && <CheckIcon />}</TableCell>
              <TableCell>{game.completed && <CheckIcon />}</TableCell>
              <TableCell>
                {game.firstReleaseDate
                  ? game.firstReleaseDate.toDateString()
                  : "unknown"}
              </TableCell>
              <TableCell>{game.createdAt.toDateString()}</TableCell>
              <TableCell>
                <CollectionGameMenu
                  gameId={game.gameId}
                  isPlayed={game.played}
                  isCompleted={game.completed ?? false}
                  userId={userId}
                  playlists={userPlaylists}
                  gamePlaylists={game.playlists}
                  handleOpenRateGameDialog={handleOpenRateGameDialog}
                  isPinned={game.pinned}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
