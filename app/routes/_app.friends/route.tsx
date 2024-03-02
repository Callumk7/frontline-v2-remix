import { Container } from "@/components";
import { createServerClient, getSession } from "@/services";
import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { friends } from "db/schema/users";

export const action = async ({ request }: ActionFunctionArgs) => {
	const { supabase } = createServerClient(request);
	const session = await getSession(supabase);

	const formData = await request.formData();
	const friendId = String(formData.get("friend_id"));

	const newFriend = await db.insert(friends).values({
		userId: session!.user.id,
		friendId: friendId,
	});

	const newConnection = await db.insert(friends).values({
		userId: friendId,
		friendId: session!.user.id,
	});

	return { newFriend, newConnection };
};

export default function FriendsRoute() {
	return (
		<Container className="flex flex-col gap-5">
			<Outlet />
		</Container>
	);
}
