import { RemoveFromCollectionButton, SaveToCollectionButton } from "@/components";
import { cn } from "@/util/cn";

interface SearchEntryControlsProps {
	gameId: number;
	userId: string;
	isSaved: boolean | undefined;
	className?: string;
}

export function SearchEntryControls({
	gameId,
	userId,
	isSaved,
	className,
}: SearchEntryControlsProps) {
	return (
		<div
			className={cn(
				className,
				"flex w-fit flex-row items-center justify-end gap-2 rounded-md border bg-background-3 p-1",
			)}
		>
			{isSaved ? (
				<RemoveFromCollectionButton gameId={gameId} userId={userId} />
			) : (
				<SaveToCollectionButton gameId={gameId} userId={userId} />
			)}
		</div>
	);
}
