import { Genre } from "@/types/games";
import { useState } from "react";

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

	const [genreFilter, setGenreFilter] = useState<string[]>([]);
	const [filterOnPlayed, setFilterOnPlayed] = useState<boolean>(false);
	const [filterOnCompleted, setFilterOnCompleted] = useState<boolean>(false);
	const [filterOnStarred, setFilterOnStarred] = useState<boolean>(false);
	const [filterOnRated, setFilterOnRated] = useState<boolean>(false);
	const [filterOnUnrated, setFilterOnUnrated] = useState<boolean>(false);

	output = output.filter((game) => {
		if (game.genres.length === 0) {
			return true;
		}

		if (
			genreFilter.every((filterGenre) =>
				game.genres.some((gameGenre) => gameGenre.name === filterGenre),
			)
		) {
			return true;
		}
	});

	if (filterOnPlayed) {
		output = output.filter((game) => game.played);
	}
	if (filterOnCompleted) {
		output = output.filter((game) => game.completed);
	}
	if (filterOnRated) {
		output = output.filter((game) => game.playerRating !== null);
	}
	if (filterOnUnrated) {
		output = output.filter((game) => game.playerRating === null);
	}

	const filteredGames = output;

	const handleGenreToggled = (genre: string) => {
		// handle genre toggled
		setGenreFilter((prevGenreFilter) =>
			prevGenreFilter.includes(genre)
				? prevGenreFilter.filter((g) => g !== genre)
				: [...prevGenreFilter, genre],
		);
	};

	const handleToggleAllGenres = () => {
		if (genres.length > genreFilter.length) {
			setGenreFilter(genres);
		} else {
			setGenreFilter([]);
		}
	};

	const handleToggleFilterOnPlayed = () => {
		setFilterOnPlayed(!filterOnPlayed);
	};
	const handleToggleFilterOnCompleted = () => {
		setFilterOnCompleted(!filterOnCompleted);
	};
	const handleToggleFilterOnStarred = () => {
		setFilterOnStarred(!filterOnStarred);
	};
	const handleToggleFilterOnRated = () => {
		setFilterOnRated(!filterOnRated);
	};
	const handleToggleFilterOnUnrated = () => {
		setFilterOnUnrated(!filterOnUnrated);
	};

	return {
		genreFilter,
		setGenreFilter,
		filteredGames,
		handleGenreToggled,
		handleToggleAllGenres,
		filterOnPlayed,
		filterOnCompleted,
		filterOnStarred,
		filterOnRated,
		filterOnUnrated,
		handleToggleFilterOnPlayed,
		handleToggleFilterOnCompleted,
		handleToggleFilterOnStarred,
		handleToggleFilterOnRated,
		handleToggleFilterOnUnrated,
	};
};
