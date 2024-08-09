import { LibraryView } from "@/components";
import { ExploreGame } from "@/features/explore/components/search-game";
import { GameListItem } from "@/features/library/components/game-list-item";
import { ListView } from "@/features/library/components/list-view";
import { View, useGameSearchData } from "../route";
import { useAppData } from "@/routes/_app/route";
import { IGDBGame } from "@/types";

interface ResultsViewProps {
	view: View;
	userId: string;
}
export function ResultsView({ view, userId }: ResultsViewProps) {
	const { results } = useGameSearchData();
	const { userCollectionIds } = useAppData();
	const resultsWithSaved = markResultsAsSaved(results, userCollectionIds);
	return (
		<>
			{view === "card" ? (
				<LibraryView>
					{resultsWithSaved.map((game) => (
						<ExploreGame
							key={game.id}
							game={game}
							coverId={game.cover.image_id}
							gameId={game.id}
							userId={userId}
						/>
					))}
				</LibraryView>
			) : (
				<ListView>
					{resultsWithSaved.map((game) => (
						<GameListItem
							key={game.id}
							gameTitle={game.name}
							gameId={game.id}
							userId={userId}
							game={game}
						/>
					))}
				</ListView>
			)}
		</>
	);
}

const markResultsAsSaved = (searchResults: IGDBGame[], userCollection: number[]) => {
	return searchResults.map((game) => {
		if (userCollection.includes(game.id)) {
			return {
				...game,
				saved: true,
			};
		}
		return {
			...game,
			saved: false,
		};
	});
};
