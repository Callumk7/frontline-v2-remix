import { Button } from "@/components/ui/button";
import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface SaveToCollectionButtonProps {
	gameId: number;
	userId: string;
	variant?: "ghost" | "outline" | "default";
}

export function SaveToCollectionButton({
	gameId,
	userId,
	variant = "ghost",
}: SaveToCollectionButtonProps) {
	const saveFetcher = useFetcher();

	return (
		<saveFetcher.Form method="post" action="/api/collections">
			<input type="hidden" value={gameId} name="gameId" />
			<input type="hidden" value={userId} name="userId" />
			{saveFetcher.state === "idle" ? (
				<Button variant={variant} size={"icon"}>
					<PlusIcon />
				</Button>
			) : (
				<div className="p-2">
					<UpdateIcon className="animate-spin" />
				</div>
			)}
		</saveFetcher.Form>
	);
}
