import { IGDBGame } from "@/types/igdb";

export const markResultsAsSaved = (
	searchResults: IGDBGame[],
	userCollection: number[],
) => {
	return searchResults.map((game) => {
		if (userCollection.includes(game.id)) {
			return {
				...game,
				saved: true,
			};
		} else {
			return {
				...game,
				saved: false,
			};
		}
	});
};

export const markInternalResultsAsSaved = <G extends { games: { gameId: number } }>(
	searchResults: G[],
	userCollection: number[],
) => {
	return searchResults.map((game) => {
		if (userCollection.includes(game.games.gameId)) {
			return {
				...game,
				saved: true,
			};
		} else {
			return {
				...game,
				saved: false,
			};
		}
	});
};
