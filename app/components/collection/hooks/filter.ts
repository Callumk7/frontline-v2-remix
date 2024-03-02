import { useCollectionStore } from "@/store/collection";
import { Genre } from "@/types/games";

interface WithGenres {
	genres: Genre[];
}

interface WithUserData {
	played: boolean | null;
	completed: boolean | null;
	playerRating: number | null;
}

export const useFilter = <G extends WithGenres & WithUserData>(games: G[]) => {
	let output = [...games];

	const store = useCollectionStore();

	output = output.filter((game) => {
		if (game.genres.length === 0) {
			return true;
		}

		if (
			store.genreFilter.every((filterGenre) =>
				game.genres.some((gameGenre) => gameGenre.name === filterGenre)
			)
		) {
			return true;
		}
	});

	if (store.filterOnPlayed) {
		output = output.filter((game) => game.played);
	}
	if (store.filterOnUnPlayed) {
		output = output.filter((game) => !game.played);
	}
	if (store.filterOnCompleted) {
		output = output.filter((game) => game.completed);
	}
	if (store.filterOnUnCompleted) {
		output = output.filter((game) => !game.completed);
	}
	if (store.filterOnRated) {
		output = output.filter((game) => game.playerRating !== null);
	}
	if (store.filterOnUnrated) {
		output = output.filter((game) => game.playerRating === null);
	}

	const filteredGames = output;

	return {
		filteredGames,
	};
};
