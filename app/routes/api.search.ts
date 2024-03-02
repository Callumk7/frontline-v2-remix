import { IGDB_BASE_URL, WORKER_URL } from "@/constants";
import { FetchOptions, fetchGamesFromIGDB } from "@/services";
import { IGDBGameSchema } from "@/types/igdb";
import { LoaderFunctionArgs, json } from "@remix-run/node";

// Search IGDB for games.
// An array of genre ids can be passed in to filter the results.
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const search = url.searchParams.get("search");
	const genreIdsParam = url.searchParams.get("genre_ids");

	const genreIds: number[] = genreIdsParam ? genreIdsParam.split(",").map(Number) : [];

	if (search) {
		const options: FetchOptions = {
			search: search,
			limit: 20,
			fields: "full",
			filters: ["cover != null"],
		};

		if (genreIds.length > 0) {
			options.filters?.push(`genres = (${genreIds.join(",")})`);
		}

		console.log(`searching for ${search}`);
		const results = await fetchGamesFromIGDB(IGDB_BASE_URL, options);

		const games = results.map((game) => IGDBGameSchema.parse(game));

		return json(games);
	}

	return json([]);
};

const saveGameToDatabase = (gameId: number) => {
	fetch(`${WORKER_URL}/games/${gameId}`, {
		method: "POST",
	}).then((res) => {
		if (res.ok) {
			console.log(`Successfully saved ${gameId} to our database.`);
		} else {
			console.error(`Failed to save ${gameId} to our database.`);
		}
	});
};
