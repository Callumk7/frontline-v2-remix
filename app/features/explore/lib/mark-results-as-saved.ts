
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
		}
			return {
				...game,
				saved: false,
			};
	});
};
