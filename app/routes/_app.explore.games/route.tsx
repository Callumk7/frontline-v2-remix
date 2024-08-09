import { authenticate, fetchGenresFromIGDB } from "@/services";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { getSearchResultsNew, getTopRatedRecentGames } from "./queries.server";
import { useLoaderData } from "@remix-run/react";
import { GameSearch } from "./components/game-search";
import { ResultsView } from "./components/results-view";
import { PageControls } from "./components/page-control";

export type View = "card" | "list";

function getSearchParams(urlString: string) {
	const url = new URL(urlString);
	const search = url.searchParams.get("search");
	const page = url.searchParams.get("page");

	return {
		search,
		page,
	};
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);
	const { search, page } = getSearchParams(request.url);

	const results = await (search
		? getSearchResultsNew(search, page)
		: getTopRatedRecentGames());

	const genres = await fetchGenresFromIGDB().then((results) =>
		results.map((result) => result.name),
	);

	return typedjson({ results, session, genres });
};

export default function ExploreRoute() {
	const { session } = useLoaderData<typeof loader>();
	const [view, setView] = useState<View>("card");

	return (
		<div className="mb-12">
			<div className="flex flex-col gap-y-6">
				<GameSearch setView={setView} />
				<ResultsView view={view} userId={session.user.id} />
				<PageControls />
			</div>
		</div>
	);
}

export function ErrorBoundary() {
	return <p className="w-full text-center italic text-red-300">Oops</p>;
}

export function useGameSearchData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.explore.games");
	if (data === undefined) {
		throw new Error(
			"useGameSearchData must be used within the _app.explore.games route or its children",
		);
	}
	return data;
}
