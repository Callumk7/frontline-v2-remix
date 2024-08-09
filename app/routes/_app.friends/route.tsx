import { createServerClient, getSession } from "@/services";
import { ActionFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "db";
import { friends } from "db/schema/users";
import { and, eq } from "drizzle-orm";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase } = createServerClient(request);
  const session = await getSession(supabase);

  const formData = await request.formData();
  const friendId = String(formData.get("friend_id"));
  if (request.method === "POST") {
    const newFriend = await db.insert(friends).values({
      userId: session!.user.id,
      friendId: friendId,
    });

    const newConnection = await db.insert(friends).values({
      userId: friendId,
      friendId: session!.user.id,
    });

    return { newFriend, newConnection };
  }

  if (request.method === "DELETE") {
    const removeFriend = await db
      .delete(friends)
      .where(and(eq(friends.userId, session!.user.id), eq(friends.friendId, friendId)));

    const removeConnection = await db
      .delete(friends)
      .where(and(eq(friends.userId, friendId), eq(friends.friendId, session!.user.id)));
    return { removeFriend, removeConnection };
  }
  return new Response("Method not allowed", { status: 405 });
};

export default function FriendsRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
