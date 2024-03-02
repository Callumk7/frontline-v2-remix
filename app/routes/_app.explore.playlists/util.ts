interface Sortable {
	followerCount: number;
	aggRating: number;
}
type SortOption = "rating" | "follows";
export const applySorting = <I extends Sortable>(items: I[], sortOption: SortOption) => {
	const sortedItems = [...items];
	switch (sortOption) {
		case "follows":
			sortedItems.sort((a, b) => b.followerCount - a.followerCount);
			break;
		case "rating":
			sortedItems.sort((a, b) => b.aggRating - a.aggRating);
			break;

		default:
			break;
	}

	return sortedItems;
};
