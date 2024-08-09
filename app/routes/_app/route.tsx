import {
	Container,
	CreatePlaylistDialog,
	Navbar,
	Sidebar,
	usePlaylistDialogOpen,
} from "@/components";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Outlet, useFetcher } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import {
	redirect,
	typedjson,
	useTypedLoaderData,
	useTypedRouteLoaderData,
} from "remix-typedjson";
import { getCreatedAndFollowedPlaylists } from "./queries.server";

import { ErrorBoundary as _ErrorBoundary } from "@/components/error-boundary";
import { getUserDetails } from "@/model/users/database-queries";
import { getUserCollectionGameIds } from "@/model";
export const ErrorBoundary = _ErrorBoundary;

export const meta: MetaFunction = () => {
	return [{ title: "playQ" }, { name: "description", content: "What are you playing?" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const ENV = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	};

	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const userPlaylistsPromise = getCreatedAndFollowedPlaylists(session.user.id);
  const userCollectionIdsPromise = getUserCollectionGameIds(session.user.id);

	const userDetailsPromise = getUserDetails(session.user.id);

	const [userPlaylists, userCollectionIds, userDetails] = await Promise.all([
		userPlaylistsPromise,
    userCollectionIdsPromise,
		userDetailsPromise,
	]);

	return typedjson(
		{ ENV, session, userPlaylists, userCollectionIds, userDetails },
		{ headers },
	);
};

export default function AppLayout() {
	const { ENV, session, userPlaylists, userDetails } =
		useTypedLoaderData<typeof loader>();

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
						userId={session.user.id}
						playlists={userPlaylists}
						hasSession={!!session}
					/>
				</div>
				<div className={`h-full ${sidebarOpen ? "lg:pl-64" : ""}`}>
					<Navbar
						supabase={supabase}
						session={session}
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
						userDetails={userDetails}
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

// Custom hook to access _app loader data anywhere in the tree.
// Note, this is not currently revalidated, so it isn't a particularly
// good solution at the moment. It also isn't very remix'y. Probably a
// better solution somewhere.
export function useAppData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app");
	if (data === undefined) {
		throw new Error("useAppData must be used within the _app route or its children");
	}
	return data;
}
