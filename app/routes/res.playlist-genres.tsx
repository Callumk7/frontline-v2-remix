import { Tag } from "@/components/ui/tag";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { db } from "db";
import { genresToGames } from "db/schema/games";
import { inArray } from "drizzle-orm";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const gameIdsFromUrl = url.searchParams.getAll("game_ids");
	const gameIds = gameIdsFromUrl.map((id) => Number(id));

	if (gameIds.length === 0) {
		return [];
	}

	const playlistGenres = await db.query.genresToGames.findMany({
		where: inArray(genresToGames.gameId, gameIds),
		with: {
			genre: {
				columns: {
					name: true,
				},
			},
		},
	});

	const resultSet = new Set(playlistGenres.map((result) => result.genre.name));
	const result = [...resultSet];
	return result;
};

export function PlaylistGenres({
	gameIds,
}: {
	gameIds: number[];
}) {
	const genreFetcher = useFetcher<typeof loader>();
	const formData = new FormData();
	gameIds.forEach((id) => formData.append("game_ids", String(id)));

	useEffect(() => {
		genreFetcher.submit(formData, {
			method: "get",
			action: "/res/playlist-genres",
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-wrap gap-2 h-12">
			{genreFetcher.data?.slice(0, 4).map((genre) => (
				<Tag key={genre}>{genre}</Tag>
			))}
		</div>
	);
}
