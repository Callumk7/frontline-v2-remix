import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components";
import { PaginationAndLimit } from "@/components/explore/pagination";
import { createServerClient, getSession } from "@/services";
import { cap } from "callum-util";
import {
	CardStackIcon,
	ChevronDownIcon,
	PersonIcon,
	StarFilledIcon,
	TableIcon,
} from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { PlaylistCard } from "./components/playlist-card";
import { PlaylistTableView } from "./components/table-view";
import {
	getPlaylistWithDiscoveryData,
	getPopularPlaylists,
	sortByFollowers,
} from "./loader";
import { applySorting } from "./util";
import { db } from "db";
import { eq } from "drizzle-orm";
import { followers } from "db/schema/playlists";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	// Parse the URL searchParams
	const url = new URL(request.url);
	const searchParams = url.searchParams;
	const offset = Number(searchParams.get("offset"));
	let limit: number;
	if (searchParams.get("limit")) {
		limit = Number(searchParams.get("limit"));
	} else {
		limit = 50;
	}

	// Like with popular games, we need a function to get top playlists by followers
	const popularPlaylistIds = await getPopularPlaylists(limit, offset);
	const playlistIds = popularPlaylistIds.map((pl) => pl.playlistId);

	const playlistData = await getPlaylistWithDiscoveryData(playlistIds);
	sortByFollowers(playlistData);

	// for now, we also need to get the list of followed playlists
	const followedPlaylists = await db.query.followers
		.findMany({
			where: eq(followers.userId, session.user.id),
			columns: {
				playlistId: true,
			},
		})
		.then((results) => results.map((result) => result.playlistId));

	return typedjson({ playlistData, session, followedPlaylists });
};

///
/// ROUTE
///
export default function ExplorePlaylists() {
	const { playlistData, session, followedPlaylists } =
		useTypedLoaderData<typeof loader>();

	const [limit, setLimit] = useState("50");
	const [offset, setOffset] = useState(0);

	const [isTableView, setIsTableView] = useState<boolean>(true);

	const [sortOrder, setSortOrder] = useState<"rating" | "follows">("follows");
	const sortedItems = applySorting(playlistData, sortOrder);

	return (
		<main className="flex flex-col gap-4">
			<div className="flex justify-between">
				<PaginationAndLimit
					limit={limit}
					offset={offset}
					setLimit={setLimit}
					setOffset={setOffset}
				/>
				<SortAndViewBox
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					setIsTableView={setIsTableView}
				/>
			</div>
			{isTableView ? (
				<PlaylistTableView
					userId={session.user.id}
					playlists={sortedItems}
					followedPlaylists={followedPlaylists}
				/>
			) : (
				<div className="grid gap-3">
					{sortedItems.map((playlist) => (
						<PlaylistCard
							playlist={playlist}
							userId={session.user.id}
							key={playlist.id}
							games={playlist.games.slice(0, 4).map((g) => g.game)}
							creator={playlist.creator}
						/>
					))}
				</div>
			)}
			<PaginationAndLimit
				limit={limit}
				offset={offset}
				setLimit={setLimit}
				setOffset={setOffset}
			/>
		</main>
	);
}

interface SortAndViewBoxProps {
	sortOrder: "rating" | "follows";
	setSortOrder: (sortOrder: "rating" | "follows") => void;
	setIsTableView: (view: boolean) => void;
}
function SortAndViewBox({
	sortOrder,
	setSortOrder,
	setIsTableView,
}: SortAndViewBoxProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="w-28" variant={"outline"}>
					<span className="mr-3">{cap(sortOrder)}</span> <ChevronDownIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Sort</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => setSortOrder("follows")}>
					<PersonIcon className="mr-3" />
					<span>Follows</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setSortOrder("rating")}>
					<StarFilledIcon className="mr-3" />
					<span>Rating</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>View</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => setIsTableView(true)}>
					<TableIcon className="mr-3" />
					<span>Table</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setIsTableView(false)}>
					<CardStackIcon className="mr-3" />
					<span>Card</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
