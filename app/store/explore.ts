import { SortOption } from "@/components";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ExploreFilterStore {
	showFilters: boolean;
	genreFilter: string[];
	sortOption: SortOption; // might need a different type here
	filterCollectionOut: boolean;
	toggleShowFilters: () => void;
	setGenreFilter: (genreFilter: string[]) => void;
	setSortOption: (sortOption: SortOption) => void;
	setFilterCollectionOut: (filter: boolean) => void;
	handleFilterCollectionOutToggled: () => void;
	handleGenreToggled: (genre: string) => void;
	handleToggleAllGenres: (genres: string[]) => void;
}

export const useExploreStore = create<ExploreFilterStore>()(
	devtools((set) => ({
		showFilters: false,
		genreFilter: [],
		sortOption: "ratingDesc",
		filterCollectionOut: false,
		toggleShowFilters: () => set((state) => ({ showFilters: !state.showFilters })),
		setGenreFilter: (filter) => set({ genreFilter: filter }),
		setSortOption: (sortOption) => set({ sortOption }),
		setFilterCollectionOut: (filter) => set({ filterCollectionOut: filter }),
		handleFilterCollectionOutToggled: () =>
			set((state) => ({ filterCollectionOut: !state.filterCollectionOut })),
		handleGenreToggled: (genre) =>
			set((state) => ({
				genreFilter: state.genreFilter.includes(genre)
					? [...state.genreFilter].filter((g) => g !== genre)
					: [...state.genreFilter, genre],
			})),
		handleToggleAllGenres: (genres) =>
			set((state) => {
				if (genres.length > state.genreFilter.length) {
					return { genreFilter: genres };
				}
				return { genreFilter: [] };
			}),
	})),
);
