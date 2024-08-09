import { RateGameDialog } from "@/components";
import { transformCollectionIntoGames } from "@/model";
import { authenticate } from "@/services";
import { GameWithCollection } from "@/types";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
	typedjson,
	useTypedRouteLoaderData,
} from "remix-typedjson";

import { CollectionView } from "./components/CollectionView";
import { useHandleRateGameDialog } from "./hooks/rate-game-dialog";
import { getCollectionData } from "./queries.server";

///
/// LOADER FUNCTION
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	const { userCollection, userPlaylists, userGenres } = await getCollectionData(
		session.user.id,
	);

	// Not sure about this transform function. At this point, it might be too
	// arbitrary. Consider the data needs and review at a later date.
	const games: GameWithCollection[] = transformCollectionIntoGames(userCollection);
	const genreNames = userGenres.map((genre) => genre.name);

	return typedjson({ session, userPlaylists, games, genreNames });
};

///
/// ROUTE
///
export default function CollectionIndex() {
	const {
		isRateGameDialogOpen,
		setIsRateGameDialogOpen,
		dialogGameId,
		handleOpenRateGameDialog,
	} = useHandleRateGameDialog();

	return (
		<>
			<CollectionView handleOpenRateGameDialog={handleOpenRateGameDialog} />
			<RateGameDialog
				gameId={dialogGameId}
				isRateGameDialogOpen={isRateGameDialogOpen}
				setIsRateDialogOpen={setIsRateGameDialogOpen}
			/>
		</>
	);
}

export function useCollectionData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app.collection._index");
	if (data === undefined) {
		throw new Error(
			"useCollectionData must be used within the _app.collection._index route or its children",
		);
	}
	return data;
}
