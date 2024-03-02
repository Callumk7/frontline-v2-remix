import { useCollectionStore } from "@/store/collection";

export type SortOption =
	| "nameAsc"
	| "nameDesc"
	| "releaseDateAsc"
	| "releaseDateDesc"
	| "ratingAsc"
	| "ratingDesc"
	| "aggregatedRatingAsc"
	| "aggregatedRatingDesc"
	| "aggregatedRatingCountAsc"
	| "aggregatedRatingCountDesc"
	| "playerRatingAsc"
	| "playerRatingDesc"
	| "dateAddedAsc"
	| "dateAddedDesc"
	| "followersAsc"
	| "followersDesc";

interface SortableGame {
	title: string;
	rating: number | null;
	externalFollows: number | null;
	aggregatedRating: number | null;
	aggregatedRatingCount: number | null;
	firstReleaseDate: Date | null;
	playerRating: number | null;
	dateAdded: Date;
	pinned: boolean;
}

export const useSort = <G extends SortableGame>(games: G[]) => {
	const sortOption = useCollectionStore((state) => state.sortOption);
	const sortedGames = applySorting(games, sortOption);

	return {
		sortedGames,
	};
};

const applySorting = <G extends SortableGame>(
	games: G[],
	sortOption: SortOption
): G[] => {
	const pinnedGames = games.filter((game) => game.pinned);
	const sortedGames = games.filter((game) => !game.pinned);
	switch (sortOption) {
		case "nameAsc":
			sortedGames.sort((a, b) =>
				a.title.toUpperCase().localeCompare(b.title.toUpperCase())
			);
			break;

		case "nameDesc":
			sortedGames.sort((a, b) =>
				b.title.toUpperCase().localeCompare(a.title.toUpperCase())
			);
			break;

		case "ratingDesc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.rating === null) {
					bRating = 0;
				} else {
					bRating = b.rating;
				}

				if (a.rating === null) {
					aRating = 0;
				} else {
					aRating = a.rating;
				}
				return bRating - aRating;
			});
			break;
		}
		case "ratingAsc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.rating === null) {
					bRating = 0;
				} else {
					bRating = b.rating;
				}

				if (a.rating === null) {
					aRating = 0;
				} else {
					aRating = a.rating;
				}
				return aRating - bRating;
			});
			break;
		}
		case "aggregatedRatingDesc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.aggregatedRating === null) {
					bRating = 0;
				} else {
					bRating = b.aggregatedRating;
				}

				if (a.aggregatedRating === null) {
					aRating = 0;
				} else {
					aRating = a.aggregatedRating;
				}
				return bRating - aRating;
			});
			break;
		}
		case "aggregatedRatingAsc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.aggregatedRating === null) {
					bRating = 0;
				} else {
					bRating = b.aggregatedRating;
				}

				if (a.aggregatedRating === null) {
					aRating = 0;
				} else {
					aRating = a.aggregatedRating;
				}
				return aRating - bRating;
			});
			break;
		}
		case "aggregatedRatingCountDesc": {
			let bRatingCount = 0;
			let aRatingCount = 0;
			sortedGames.sort((a, b) => {
				if (b.aggregatedRatingCount === null) {
					bRatingCount = 0;
				} else {
					bRatingCount = b.aggregatedRatingCount;
				}

				if (a.aggregatedRatingCount === null) {
					aRatingCount = 0;
				} else {
					aRatingCount = a.aggregatedRatingCount;
				}
				return bRatingCount - aRatingCount;
			});
			break;
		}
		case "aggregatedRatingCountAsc": {
			let bRatingCount = 0;
			let aRatingCount = 0;
			sortedGames.sort((a, b) => {
				if (b.aggregatedRatingCount === null) {
					bRatingCount = 0;
				} else {
					bRatingCount = b.aggregatedRatingCount;
				}

				if (a.aggregatedRatingCount === null) {
					aRatingCount = 0;
				} else {
					aRatingCount = a.aggregatedRatingCount;
				}
				return aRatingCount - bRatingCount;
			});
			break;
		}

		case "releaseDateAsc": {
			let bReleaseDate = 0;
			let aReleaseDate = 0;
			sortedGames.sort((a, b) => {
				if (b.firstReleaseDate === null) {
					bReleaseDate = 0;
				} else {
					bReleaseDate = b.firstReleaseDate.valueOf();
				}
				if (a.firstReleaseDate === null) {
					aReleaseDate = 0;
				} else {
					aReleaseDate = a.firstReleaseDate.valueOf();
				}
				return aReleaseDate - bReleaseDate;
			});
			break;
		}
		case "releaseDateDesc": {
			let bReleaseDate = 0;
			let aReleaseDate = 0;
			sortedGames.sort((a, b) => {
				if (b.firstReleaseDate === null) {
					bReleaseDate = 0;
				} else {
					bReleaseDate = b.firstReleaseDate.valueOf();
				}
				if (a.firstReleaseDate === null) {
					aReleaseDate = 0;
				} else {
					aReleaseDate = a.firstReleaseDate.valueOf();
				}
				return bReleaseDate - aReleaseDate;
			});
			break;
		}
		case "playerRatingAsc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.playerRating === null) {
					bRating = 0;
				} else {
					bRating = b.playerRating;
				}

				if (a.playerRating === null) {
					aRating = 0;
				} else {
					aRating = a.playerRating;
				}
				return bRating - aRating;
			});
			break;
		}
		case "playerRatingDesc": {
			let bRating = 0;
			let aRating = 0;
			sortedGames.sort((a, b) => {
				if (b.playerRating === null) {
					bRating = 0;
				} else {
					bRating = b.playerRating;
				}

				if (a.playerRating === null) {
					aRating = 0;
				} else {
					aRating = a.playerRating;
				}
				return aRating - bRating;
			});
			break;
		}
		case "followersAsc": {
			let bFollowers = 0;
			let aFollowers = 0;
			sortedGames.sort((a, b) => {
				if (b.externalFollows === null) {
					bFollowers = 0;
				} else {
					bFollowers = b.externalFollows;
				}

				if (a.externalFollows === null) {
					aFollowers = 0;
				} else {
					aFollowers = a.externalFollows;
				}
				return bFollowers - aFollowers;
			});
			break;
		}
		case "followersDesc": {
			let bFollowers = 0;
			let aFollowers = 0;
			sortedGames.sort((a, b) => {
				if (b.externalFollows === null) {
					bFollowers = 0;
				} else {
					bFollowers = b.externalFollows;
				}

				if (a.externalFollows === null) {
					aFollowers = 0;
				} else {
					aFollowers = a.externalFollows;
				}
				return aFollowers - bFollowers;
			});
			break;
		}
		// TODO: date added is not working correctly.
		// BUG: date added is not working correctly.
		case "dateAddedAsc": {
			sortedGames.sort(
				(a, b) => b.dateAdded.getDate() - a.dateAdded.getDate()
			);
			break;
		}
		case "dateAddedDesc": {
			sortedGames.sort(
				(a, b) => a.dateAdded.getDate() - b.dateAdded.getDate()
			);
			break;
		}
		default:
			break;
	}
	return [...pinnedGames, ...sortedGames];
};
