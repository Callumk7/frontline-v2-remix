import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	Container,
	GameCover,
	Label,
	LibraryView,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	Toggle,
} from "@/components";
import {
	genresToStrings,
	getAllGenres,
} from "@/features/collection/queries/get-user-genres";
import { SaveToCollectionButton } from "@/features/explore";
import {
	combinePopularGameData,
	getPopularGamesByCollection,
	getPopularGamesByPlaylist,
} from "@/features/home/queries/popular-games";
import { getUserCollectionGameIds } from "@/model";
import { createServerClient, getSession } from "@/services";
import { cn } from "@/util/cn";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CubeIcon,
	PlayIcon,
} from "@radix-ui/react-icons";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getTopTenByRating, getTopTenByRatingCount } from "./loading";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const popularGamesByPlaylistPromise = getPopularGamesByPlaylist();
	const popularGamesByCollectionPromise = getPopularGamesByCollection();
	const userCollectionGameidsPromise = getUserCollectionGameIds(session.user.id);
	const allGenres = await getAllGenres();
	const genreStrings = genresToStrings(allGenres);
	genreStrings.forEach((s, i) => {
		genreStrings[i] = s.toLowerCase();
	});

	// fetch gameIds in parallel
	const [popularGamesByCollection, popularGamesByPlaylist, userCollectionGameIds] =
		await Promise.all([
			popularGamesByCollectionPromise,
			popularGamesByPlaylistPromise,
			userCollectionGameidsPromise,
		]);

	// I should create an explcit type for the return type of this function
	// WARN: this actually has missing data because each list may (and wont) contain the same
	// games. I need to either cache two lists, or change the logic so that only shared games are fetched
	const processedData = await combinePopularGameData({
		popularGamesByCollection,
		popularGamesByPlaylist,
	});

	const topTenGames = await getTopTenByRating();
	const topTenGamesByCount = await getTopTenByRatingCount();

	return json(
		{
			processedData,
			userCollectionGameIds,
			session,
			genreStrings,
			topTenGames,
			topTenGamesByCount,
		},
		{ headers },
	);
};

export default function PopularExplore() {
	const {
		processedData,
		userCollectionGameIds,
		session,
		genreStrings,
		topTenGames,
		topTenGamesByCount,
	} = useLoaderData<typeof loader>();
	// This could be done on the server..
	const maxCollectionCount = processedData.reduce(
		(max, game) => Math.max(max, game.collectionCount),
		0,
	);
	const maxPlaylistCount = processedData.reduce(
		(max, game) => Math.max(max, game.playlistCount),
		0,
	);

	const [sortBy, setSortBy] = useState<"collection" | "playlist">("collection");
	const sortByCollection = sortBy === "collection";

	const handleToggleSortBy = () => {
		if (sortBy === "collection") {
			processedData.sort((a, b) => b.playlistCount - a.playlistCount);
			setSortBy("playlist");
		} else {
			processedData.sort((a, b) => b.collectionCount - a.collectionCount);
			setSortBy("collection");
		}
	};

	return (
		<Container>
			<div className="flex gap-6">
				<Toggle pressed={sortByCollection} onPressedChange={handleToggleSortBy}>
					{sortBy === "collection" ? <CubeIcon /> : <PlayIcon />}
				</Toggle>
				<GenreComboBox genres={genreStrings} />
			</div>
			<LibraryView>
				{topTenGamesByCount.map((game) => (
					<div key={game.id} className="flex flex-col gap-3">
						<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
						<div className="border p-3 rounded-md">
							<span className="font-black text-lg">
								{Math.floor(Number(game.avRating))}
							</span>
							<span>/</span>
							<span>{game.ratingCount}</span>
						</div>
					</div>
				))}
			</LibraryView>
			<LibraryView>
				{processedData.map((game) => (
					<div key={game.id} className="relative flex flex-col gap-3">
						{!userCollectionGameIds.includes(game.gameId) && (
							<div className="absolute right-3 top-3 z-20">
								<SaveToCollectionButton
									variant="outline"
									gameId={game.gameId}
									userId={session.user.id}
								/>
							</div>
						)}
						<GameCover coverId={game.cover.imageId} gameId={game.gameId} />
						<ExploreGameDataRow
							collectionCount={game.collectionCount}
							maxCollectionCount={maxCollectionCount}
							playlistCount={game.playlistCount}
							maxPlaylistCount={maxPlaylistCount}
						/>
					</div>
				))}
			</LibraryView>
		</Container>
	);
}

interface ExploreGameDataRowProps {
	collectionCount: number;
	maxCollectionCount: number;
	playlistCount: number;
	maxPlaylistCount: number;
}

function ExploreGameDataRow({
	collectionCount,
	playlistCount,
	maxCollectionCount,
	maxPlaylistCount,
}: ExploreGameDataRowProps) {
	return (
		<div className="flex flex-col gap-2 rounded-md border p-3">
			<div className="flex w-full flex-col gap-1">
				<Label>Collection Popularity</Label>
				<Progress value={collectionCount} max={maxCollectionCount} className="h-2" />
			</div>
			<div className="flex w-full flex-col gap-1">
				<Label>Playlist Popularity</Label>
				<Progress value={playlistCount} max={maxPlaylistCount} className="h-2" />
			</div>
		</div>
	);
}

function GenreComboBox({ genres }: { genres: string[] }) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? genres.find((genre) => genre === value) : "Filter on a genre"}
					{open ? (
						<ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					) : (
						<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Filter on a genre" />
					<CommandEmpty>No genre found.</CommandEmpty>
					<CommandGroup>
						{genres.map((genre) => (
							<CommandItem
								key={genre}
								value={genre}
								onSelect={(currentValue) => {
									setValue(currentValue === value ? "" : currentValue);
									setOpen(false);
								}}
							>
								<CheckIcon
									className={cn(
										"mr-2 h-4 w-4",
										value === genre ? "opacity-100" : "opacity-0",
									)}
								/>
								{genre}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
