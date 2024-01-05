import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { friends, users } from "db/schema/users";
import { eq, ne } from "drizzle-orm";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (!session) {
    return redirect("/?index", {
      headers,
    });
  }

  const allUsers = await db.query.users.findMany({
    with: {
      friends: {
        with: {
          user: true,
          friend: true,
        }
      },
      friendsOf: {
        with: {
          friend: true,
          user: true
        }
      }
    }
  })

  const userFriends = await db.query.friends.findMany({
    where: eq(friends.userId, session.user.id),
    with: {
      friend: true,
    }
  });

  return json({ userFriends, allUsers }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  const formData = await request.formData();
  const friendId = String(formData.get("friendId"));

  console.log(friendId);

  const newFriend = await db.insert(friends).values({
    userId: session!.user.id,
    friendId: friendId,
  });

  const newConnection = await db.insert(friends).values({
    userId: friendId,
    friendId: session!.user.id
  })

  return { newFriend, newConnection };
};

export default function FriendsRoute() {
  const { userFriends, allUsers } = useLoaderData<typeof loader>();
  return (
    <Container className="flex flex-col gap-5">
      <div>
        {allUsers.map(user => (
          <div key={user.id}>
            <h1>{user.email}</h1>
            <Form method="post" className="flex flex-col gap-2 p-1">
              <input type="hidden" value={user.id} name="friendId" />
              <Button variant={"outline"} size={"sm"}>Add</Button>
            </Form>
          </div>
        ))}
      </div>
      <Separator />
      <div className="whitespace-pre-wrap">{JSON.stringify(allUsers, null, "\t")}</div>
    </Container>
  );
}
