import { useCollectionStore } from "@/store/collection";

interface GameHasTitle {
	title: string;
}

export const useSearch = <G extends GameHasTitle>(games: G[]) => {
	const searchTerm = useCollectionStore((state) => state.searchTerm);

	let output: G[] = [...games];
	if (searchTerm !== "") {
		output = output.filter((game) =>
			game.title.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	const searchedGames = output;

	return {
		searchedGames,
	};
};
