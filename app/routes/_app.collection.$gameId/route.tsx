import { getCompleteGame } from "@/model/games";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Button, Comment, DBImage, GenreTags, Separator } from "@/components";
import { GameViewMenubar } from "./components/game-view-menubar";
import { createServerClient, getSession } from "@/services";
import { getUserPlaylists } from "@/features/playlists";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import { useState } from "react";
import { GameCommentForm } from "./components/game-comment-form";
import { getGameComments } from "./loading";

///
/// LOADER
///
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);
	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	const gameId = Number(params.gameId);

	// TODO: make these parallel
	const game = await getCompleteGame(gameId);
	const gameComments = await getGameComments(gameId);
	const userPlaylists = await getUserPlaylists(session.user.id);

	if (!game) {
		return redirect("/");
	}

	return typedjson({ game, userPlaylists, gameComments, session });
};

export default function GamesRoute() {
	const { game, userPlaylists, gameComments, session } =
		useTypedLoaderData<typeof loader>();
	const [isCommenting, setIsCommenting] = useState<boolean>(false);

	return (
		<main className="mt-10">
			{game.artworks[0] && (
				<DBImage
					imageId={game.artworks[0].imageId}
					size="1080p"
					className="rounded-2xl"
				/>
			)}
			<div className="relative flex flex-col gap-5">
				<h1 className="pt-4 text-6xl font-semibold">{game.title}</h1>
				<GenreTags genres={game.genres.map((g) => g.genre.name)} />
				<div className="mt-7">
					<GameViewMenubar gameId={game.gameId} userPlaylists={userPlaylists} />
				</div>
				<Separator />
				<div className="flex gap-5 items-center">
					<h2 className="text-2xl font-semibold">Comments</h2>
					<Button
						variant={"outline"}
						size={"sm"}
						onClick={() => setIsCommenting(!isCommenting)}
					>
						{isCommenting ? "Hide" : "Post a Comment"}
					</Button>
				</div>
				{isCommenting && (
					<GameCommentForm userId={session.user.id} gameId={game.gameId} />
				)}
				{gameComments.map((comment) => (
					<Comment key={comment.id} comment={comment} author={comment.author} />
				))}
			</div>
		</main>
	);
}
