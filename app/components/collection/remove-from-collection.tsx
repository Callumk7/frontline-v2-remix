import { Button } from "@/components/ui/button";
import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface RemoveFromCollectionButtonProps {
	gameId: number;
	userId: string;
	label?: string;
}

export function RemoveFromCollectionButton({
	gameId,
	userId,
	label,
}: RemoveFromCollectionButtonProps) {
	const deleteFetcher = useFetcher();

	return (
		<deleteFetcher.Form method="delete" action="/api/collections">
			<input type="hidden" value={gameId} name="gameId" />
			<input type="hidden" value={userId} name="userId" />
			{deleteFetcher.state === "idle" ? (
				<Button variant={"ghost"} size={"icon"}>
					{label ? label : <TrashIcon />}
				</Button>
			) : (
				<div className="p-2">
					<UpdateIcon className="animate-spin" />
				</div>
			)}
		</deleteFetcher.Form>
	);
}
