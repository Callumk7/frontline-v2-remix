import { UsersToGames } from "@/types/games";
import { splitArray } from "./split-array";

export function addPositionsToCollection(arr: UsersToGames[]) {
	// Type guard
	function hasPosition(
		item: UsersToGames,
	): item is UsersToGames & { position: number } {
		return item.position !== null;
	}

	// Type guard didn't work here... sad.
	const [withPos, withoutPos] = splitArray(arr, hasPosition);

	// 'position' can't be null now
	withPos.sort((a, b) => a.position! - b.position!);

	let maxPos = withPos.length > 0 ? withPos[withPos.length - 1].position! : 0;

	for (const item of withoutPos) {
		item.position = ++maxPos;
	}

	return [...withPos, ...withoutPos];
}
