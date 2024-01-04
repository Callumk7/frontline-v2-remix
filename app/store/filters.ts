import create from "zustand";

interface FilterStore {
  filterOnPlayed: boolean;
  filterOnCompleted: boolean;
  filterOnRated: boolean;
  filterOnUnrated: boolean;
  filterOnStarred: boolean;
  handleToggleFilterOnPlayed: () => void;
  handleToggleFilterOnCompleted: () => void;
  handleToggleFilterOnRated: () => void;
  handleToggleFilterOnUnrated: () => void;
  handleToggleFilterOnStarred: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
	filterOnPlayed: false,
	filterOnCompleted: false,
	filterOnRated: false,
	filterOnUnrated: false,
	filterOnStarred: false,

	handleToggleFilterOnPlayed: () =>
		set((state) => ({ filterOnPlayed: !state.filterOnPlayed })),
	handleToggleFilterOnCompleted: () =>
		set((state) => ({ filterOnCompleted: !state.filterOnCompleted })),
	handleToggleFilterOnRated: () =>
		set((state) => ({ filterOnRated: !state.filterOnRated })),
	handleToggleFilterOnUnrated: () =>
		set((state) => ({ filterOnUnrated: !state.filterOnUnrated })),
	handleToggleFilterOnStarred: () =>
		set((state) => ({ filterOnStarred: !state.filterOnStarred })),
}));

export default useFilterStore;
