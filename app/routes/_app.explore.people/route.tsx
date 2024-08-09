import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components";
import { authenticate, createServerClient, getSession } from "@/services";
import { useUserCacheStore } from "@/store/cache";
import { User } from "@/types";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import { TopPlaylists } from "../res.friends-playlists";
import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { getUserFriends } from "./queries.server";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await authenticate(request);

	// for now just get all users, we can think up a good discovery pipeline in the future
	const allUsers = await db.query.users.findMany();

	const userFriends = await getUserFriends(session.user.id).then((results) =>
		results.map((result) => result.id),
	);

	if (!session) {
		return redirect("/?index");
	}

	return typedjson({ allUsers, userFriends });
};

export default function ExplorePeopleRoute() {
	const { allUsers, userFriends } = useTypedLoaderData<typeof loader>();

	return (
		<main className="mt-10">
			<div className="grid gap-4">
				{allUsers.map((user) => (
					<UserPreview
						key={user.id}
						user={user}
						isFriend={userFriends.includes(user.id)}
					/>
				))}
			</div>
		</main>
	);
}

// What do we want to see when viewing people?
// 1. number of completed and saved games? How much compute is this?
// 2. number of playlists
// 3. top.. genres etc?

interface UserPreviewProps {
	user: User;
	isFriend: boolean;
}
function UserPreview({ user, isFriend }: UserPreviewProps) {
	const addFriendFetcher = useFetcher();
	const removeFriendFetcher = useFetcher();
	return (
		<Card className={isFriend ? "border-primary" : ""}>
			<CardHeader>
				<CardTitle>{user.username} </CardTitle>
				<CardDescription> {user.firstName} </CardDescription>
			</CardHeader>
			<CardContent>
				<TopPlaylists userId={user.id} />
			</CardContent>
			<CardFooter>
				{!isFriend ? (
					<Button
						onClick={() =>
							addFriendFetcher.submit(
								{ friend_id: user.id },
								{ method: "POST", action: "/friends" },
							)
						}
					>
						{addFriendFetcher.state === "idle" ? (
							<>
								<PlusCircledIcon className="mr-2" /> <span>Add as Friend</span>
							</>
						) : (
							<span>Saving..</span>
						)}
					</Button>
				) : (
					<Button
						variant={"secondary"}
						onClick={() =>
							removeFriendFetcher.submit(
								{ friend_id: user.id },
								{ method: "DELETE", action: "/friends" },
							)
						}
					>
						{removeFriendFetcher.state === "idle" ? (
							<>
								<Cross1Icon className="mr-2" /> <span>Remove Friend</span>
							</>
						) : (
							<span>Removing..</span>
						)}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
