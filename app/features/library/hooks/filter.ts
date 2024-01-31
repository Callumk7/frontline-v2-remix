import useFilterStore from "@/store/filters";
import { Genre } from "@/types/games";

interface WithGenres {
	genres: Genre[];
}

interface WithUserData {
	played: boolean | null;
	completed: boolean | null;
	playerRating: number | null;
}

export const useFilter = <G extends WithGenres & WithUserData>(
	games: G[],
	genres: string[],
) => {
	let output = [...games];

	const store = useFilterStore();

	output = output.filter((game) => {
		if (game.genres.length === 0) {
			return true;
		}

		if (
			store.genreFilter.every((filterGenre) =>
				game.genres.some((gameGenre) => gameGenre.name === filterGenre),
			)
		) {
			return true;
		}
	});

	if (store.filterOnPlayed) {
		output = output.filter((game) => game.played);
	}
	if (store.filterOnCompleted) {
		output = output.filter((game) => game.completed);
	}
	if (store.filterOnRated) {
		output = output.filter((game) => game.playerRating !== null);
	}
	if (store.filterOnUnrated) {
		output = output.filter((game) => game.playerRating === null);
	}

	const filteredGames = output;

	const handleGenreToggled = (genre: string) => {
		// handle genre toggled
		store.setGenreFilter(
			store.genreFilter.includes(genre)
				? store.genreFilter.filter((g) => g !== genre)
				: [...store.genreFilter, genre],
		);
	};

	const handleToggleAllGenres = () => {
		if (genres.length > store.genreFilter.length) {
			store.setGenreFilter(genres);
		} else {
			store.setGenreFilter([]);
		}
	};

	return {
		filteredGames,
		handleGenreToggled,
		handleToggleAllGenres,
	};
};
