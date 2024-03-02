import {
	Button,
	CollectionDropdownToggleItem,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItemDestructive,
	DropdownMenuTrigger,
} from "@/components";
import { useCollectionControls } from "@/components/collection/hooks/controls";
import {
	HamburgerMenuIcon,
	StarFilledIcon,
	StarIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { usersToGames } from "db/schema/games";
import { and, eq } from "drizzle-orm";
import { useEffect } from "react";
import { z } from "zod";
import { zx } from "zodix";

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const result = zx.parseParamsSafe(params, {
		userId: z.string(),
		gameId: zx.NumAsString,
	});

	if (!result.success) {
		return null;
	}

	const collectionData = await db
		.select()
		.from(usersToGames)
		.where(
			and(
				eq(usersToGames.gameId, result.data.gameId),
				eq(usersToGames.userId, result.data.userId),
			),
		);

	if (collectionData.length > 0) {
		return collectionData[0];
	}

	return null;
};

interface CollectionMenuProps {
	userId: string;
	gameId: number;
}

export function CollectionMenu({ userId, gameId }: CollectionMenuProps) {
	const fetcher = useFetcher<typeof loader>();
	const { handleRemove, handleMarkAsPlayed, handleMarkAsCompleted } =
		useCollectionControls(userId, gameId);
	// biome-ignore lint/correctness/useExhaustiveDependencies: only run on mount
	useEffect(() => {
		fetcher.submit(new FormData(), {
			method: "GET",
			action: `/res/collection/${gameId}/${userId}`,
		});
	}, []);
	const isLoaded = fetcher.data !== undefined ? true : false;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger disabled={!fetcher.data} asChild>
				<Button variant={"outline"} size={"icon"}>
					<HamburgerMenuIcon />
				</Button>
			</DropdownMenuTrigger>
			{isLoaded && (
				<DropdownMenuContent>
					<CollectionDropdownToggleItem
						onClick={handleMarkAsPlayed}
						toggle={fetcher.data!.played}
						toggleOnComponent={<StarFilledIcon className="mr-3 text-primary" />}
						toggleOffComponent={<StarIcon className="mr-3" />}
					>
						<span>Mark as played</span>
					</CollectionDropdownToggleItem>
					<CollectionDropdownToggleItem
						onClick={handleMarkAsCompleted}
						toggle={fetcher.data!.completed}
						toggleOnComponent={<StarFilledIcon className="mr-3 text-primary" />}
						toggleOffComponent={<StarIcon className="mr-3" />}
					>
						<span>Mark as completed</span>
					</CollectionDropdownToggleItem>
					<DropdownMenuItemDestructive onClick={handleRemove}>
						<TrashIcon className="mr-3" />
						<span>Remove from collection</span>
					</DropdownMenuItemDestructive>
				</DropdownMenuContent>
			)}
		</DropdownMenu>
	);
}
