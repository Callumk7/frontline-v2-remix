import {
	Container,
	CreatePlaylistDialog,
	Navbar,
	Sidebar,
	usePlaylistDialogOpen,
} from "@/components";
import { getFriendActivity, getUserCollectionGameIds, transformActivity } from "@/model";
import { createServerClient, getSession } from "@/services";
import { useUserCacheStore } from "@/store";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Outlet, useFetcher } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { getCreatedAndFollowedPlaylists, getUserFriends } from "./loader";

export const meta: MetaFunction = () => {
	return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

// We are going to use this base route for supabase authentication. This is also where
// we define the basic layout, including navigation bar and sidebar.
export const loader = async ({ request }: LoaderFunctionArgs) => {
	// env variables that we need on the browser:
	const ENV = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	};

	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const userPlaylistsPromise = await getCreatedAndFollowedPlaylists(session.user.id);
	const userFriendsPromise = await getUserFriends(session.user.id);
	const friendActivityPromise = await getFriendActivity(session.user.id);

	// Set the store for user gameIds as a cache on the app route.
	const userCollectionPromise = await getUserCollectionGameIds(session.user.id);

	const [userPlaylists, userFriends, friendActivity, userCollection] = await Promise.all([
		userPlaylistsPromise,
		userFriendsPromise,
		friendActivityPromise,
		userCollectionPromise,
	]);

	const activityFeed = transformActivity(friendActivity);

	return typedjson(
		{ ENV, session, userPlaylists, userFriends, userCollection, activityFeed },
		{ headers },
	);
};

export default function AppLayout() {
	const { ENV, session, userPlaylists, userFriends, userCollection, activityFeed } =
		useTypedLoaderData<typeof loader>();
	// set the store for use around the app
	const setUserCollection = useUserCacheStore((state) => state.setUserCollection);
	const setUserFriends = useUserCacheStore((state) => state.setUserFriends);
	const setUserPlaylists = useUserCacheStore((state) => state.setUserPlaylists);
	const setFollowedPlaylists = useUserCacheStore((state) => state.setFollwedPlaylists);

	// SET THE CACHE ON INITIAL LOAD FOR USER DETAILS THAT CAN BE USED AROUND THE APP
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run on initial render
	useEffect(() => {
		setUserCollection(userCollection);
		setUserFriends(userFriends.map((friend) => friend.id));
		setUserPlaylists(
			userPlaylists
				.filter((playlist) => playlist.creator.id === session.user.id)
				.map((playlist) => playlist.id),
		);
		setFollowedPlaylists(
			userPlaylists
				.filter((playlist) => playlist.creator.id !== session.user.id)
				.map((playlist) => playlist.id),
		);
	}, []);

	const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
	const { playlistDialogOpen, setPlaylistDialogOpen } = usePlaylistDialogOpen();

	/// SUPABASE CLIENT AUTHENTICATION
	const supaFetcher = useFetcher();
	// We create a single instance of Supabase to use across client components
	const [supabase] = useState(() =>
		createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY),
	);

	const serverAccessToken = session?.access_token;
	// This is all from the Remix example from supabase:
	// https://github.com/supabase/auth-helpers/blob/main/examples/remix
	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.access_token !== serverAccessToken && supaFetcher.state === "idle") {
				// server and client are out of sync.
				// Remix recalls active loaders after actions are complete
				supaFetcher.submit(null, {
					method: "POST",
					action: "/handle-supabase-auth",
				});
			}
		});

		return () => subscription.unsubscribe();
	}, [serverAccessToken, supabase, supaFetcher]);

	return (
		<>
			<div className="h-full min-h-screen lg:flex-grow">
				<div
					className={`fixed hidden lg:inline h-full min-h-screen w-64 transition-opacity ease-in ${
						sidebarOpen ? "visible opacity-100" : "invisible opacity-0"
					}`}
				>
					<Sidebar
						userId={session!.user.id}
						playlists={userPlaylists}
						hasSession={session ? true : false}
						activityFeed={activityFeed}
					/>
				</div>
				<div className={`h-full ${sidebarOpen ? "lg:pl-64" : ""}`}>
					<Navbar
						supabase={supabase}
						session={session}
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
					/>
					<Container className="py-20 md:pt-0">
						<Outlet />
					</Container>
				</div>
			</div>
			<CreatePlaylistDialog
				userId={session.user.id}
				dialogOpen={playlistDialogOpen}
				setDialogOpen={setPlaylistDialogOpen}
			/>
		</>
	);
}
