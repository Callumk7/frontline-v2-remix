import { GameWithCollection, gameWithCollectionSchema } from "@/types/games";
import { ZodError } from "zod";
import { getUserGameCollection } from "./database-queries";

type PromiseType<T> = T extends Promise<infer U> ? U : T;

/**
 * This function transforms data returned from the database into
 * a shape that we can use in our app, nice and flat. It does mean
 * that I have to maintain this going forward, as I add new features
 * that need different parts from the server.
 * */
export const transformCollectionIntoGames = (
	collection: PromiseType<ReturnType<typeof getUserGameCollection>>,
) => {
	const games: GameWithCollection[] = collection.map((c) => ({
		...c,
		...c.game,
		cover: c.game.cover,
		playlists: c.game.playlists.map((p) => p.playlist),
		genres: c.game.genres.map((g) => g.genre),
		dateAdded: c.createdAt,
	}));

	// validate at runtime
	try {
		games.forEach((g) => gameWithCollectionSchema.parse(g));
		return games;
	} catch (e) {
		console.error("THERE IS AN ERROR HERE");
		if (e instanceof ZodError) {
			console.error(e.flatten());
		} else {
			console.error(e);
		}
		return [];
	}
};
