import { Container } from "@/components";
import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData, redirect } from "remix-typedjson";
import { getFriendActivity, transformActivity } from "@/model";
import { ActivityFeedCard } from "./components/feed";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	if (!session) {
		return redirect("/login");
	}

	const activity = await getFriendActivity(session.user.id);
	// This sorts by timestamp, might want to move that out of this function
	const feed = transformActivity(activity);

	return typedjson({ session, feed }, { headers });
};

export default function AppIndex() {
	const { feed } = useTypedLoaderData<typeof loader>();
	return (
		<Container className="flex flex-col gap-10 my-20">
			{feed.map((a) => (
				<ActivityFeedCard key={a.activity.id} activity={a} />
			))}
		</Container>
	);
}
