import { SearchEntryControls } from "..";
import { IGDBGame } from "@/types/igdb";
import { GameWithCover } from "@/types/games";
import { GameCover } from "@/components";

interface ExploreGameProps {
	game: IGDBGame;
	coverId: string;
	gameId: number;
	userId: string;
}

export function ExploreGame({ game, coverId, gameId, userId }: ExploreGameProps) {
	return (
		<div>
			<GameCover coverId={coverId} gameId={gameId} />
			<SearchEntryControls
				gameId={gameId}
				userId={userId}
				isSaved={game.saved}
				className="mt-3"
			/>
		</div>
	);
}

interface GameIsSaved extends GameWithCover {
	saved: boolean;
}

interface ExploreGameInternalProps {
	game: GameIsSaved;
	userId: string;
}
export function ExploreGameInternal({ game, userId }: ExploreGameInternalProps) {
	return (
		<div className="flex flex-col gap-3">
			<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
			<SearchEntryControls gameId={game.gameId} userId={userId} isSaved={game.saved} />
		</div>
	);
}
