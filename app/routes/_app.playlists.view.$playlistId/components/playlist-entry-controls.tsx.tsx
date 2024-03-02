import { Button, SaveToCollectionButton } from "@/components";
import { CollectionMenu } from "@/routes/res.collection.$gameId.$userId";
import { Game, GameWithCollection } from "@/types";
import { HamburgerMenuIcon, MixIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

interface PlaylistEntryControlsProps {
	gameId: number;
	inCollection: boolean;
	userId: string;
	isEditing: boolean;
}
export function PlaylistEntryControls({
	gameId,
	inCollection,
	userId,
	isEditing,
}: PlaylistEntryControlsProps) {
	return (
		<div className="flex gap-2">
			{inCollection ? (
				<CollectionMenu userId={userId} gameId={gameId} />
			) : (
				<SaveToCollectionButton gameId={gameId} userId={userId} />
			)}
			{isEditing && (
				<Button variant={"destructive"} size={"icon"}>
					<TrashIcon />
				</Button>
			)}
		</div>
	);
}
