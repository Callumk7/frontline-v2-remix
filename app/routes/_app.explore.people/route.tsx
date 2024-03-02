import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { useUserCacheStore } from "@/store/cache";
import { User } from "@/types";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import { TopPlaylists } from "../res.friends-playlists";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	// for now just get all users, we can think up a good discovery pipeline in the future
	const allUsers = await db.query.users.findMany();

	// What I really want to do, is check to see if the user is already friends with the currently
	// signed in user. We can do this by getting all the user friends in a separate query (actually, we
	// have these ine sidebar.. lets just use that for a cache)

	if (!session) {
		return redirect("/?index", {
			headers,
		});
	}

	return typedjson({ allUsers });
};

export default function ExplorePeopleRoute() {
	const { allUsers } = useTypedLoaderData<typeof loader>();
	const userFriends = useUserCacheStore((state) => state.userFriends);

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
	return (
		<Card className={isFriend ? "border-primary" : ""}>
			<CardHeader>
				<CardTitle>{user.username}</CardTitle>
				<CardDescription>{user.firstName}</CardDescription>
			</CardHeader>
			<CardContent>
				<TopPlaylists userId={user.id} />
			</CardContent>
			<CardFooter>
				{!isFriend && (
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
				)}
			</CardFooter>
		</Card>
	);
}
