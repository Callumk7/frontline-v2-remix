import { WORKER_URL } from "@/constants";
import { ActionFunctionArgs, json } from "@remix-run/node";

// /api/games/:gameId/save
// I don't believe this route is in use right now.. we do the same thing in
// the api/collection action after a user saves a search result.
// Probably a candidate for removal
export const action = ({ params }: ActionFunctionArgs) => {
	const gameId = params.gameId;

	fetch(`${WORKER_URL}/games/${gameId}`, {
		method: "POST",
	}).then((res) => {
		if (res.ok) {
			console.log(`Successfully saved ${gameId} to our database.`);
		} else {
			console.error(`Failed to save ${gameId} to our database.`);
		}
	});

	return json("request received");
};
