import { Container } from "@/components";
import { authenticate } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ActivityFeedCard } from "./components/feed";
import { getSortedFriendActivity } from "./queries.server";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticate(request);

  const feed = await getSortedFriendActivity(session.user.id);

	return typedjson({ session, feed });
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
