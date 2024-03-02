import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveToCollectionButton } from "@/features/explore/components/save-to-collection-button";
import { IGDBGame } from "@/types/igdb";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import type { loader } from "@/routes/api.search";

interface GameSearchProps {
	userId: string;
}

export function GameSearch({ userId }: GameSearchProps) {
	// recommended from discord: you can import the type from the route,
	// and then use it as a type arg.
	const fetcher = useFetcher<typeof loader>();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant={"outline"}>
					<MagnifyingGlassIcon className="w-4 h-4 mr-3" />
					<span>Add more</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[500px]">
				<fetcher.Form method="get" action="/api/search" className="w-full">
					<Input
						name="search"
						placeholder="Search for a game"
						onChange={(e) => fetcher.submit(e.target.form)}
						className="w-full"
						autoComplete="off"
					/>
				</fetcher.Form>
				<ScrollArea className="h-80 w-full">
					<div>
						{fetcher.data
							? fetcher.data.map((game) => (
									<SearchResult key={game.id} game={game} userId={userId} />
							  ))
							: null}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}

interface SearchResultProps {
	game: IGDBGame;
	userId: string;
}

function SearchResult({ game, userId }: SearchResultProps) {
	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex items-center gap-2 py-2">
				<img
					src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`}
					alt={game.name}
					width={45}
					height={64}
					className="overflow-hidden rounded-md"
				/>
				<div>{game.name}</div>
			</div>
			<SaveToCollectionButton gameId={game.id} userId={userId} />
		</div>
	);
}
