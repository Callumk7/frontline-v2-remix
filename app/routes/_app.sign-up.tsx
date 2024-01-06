import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createServerClient } from "@/features/auth/supabase/supabase.server";
import { Container } from "@/features/layout";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "db";
import { users } from "db/schema/users";
import { z } from "zod";
import { zx } from "zodix";

///
/// ACTION
///
export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, {
    email: z.string().email(),
    password: z.string().min(5),
  });

  const { supabase, headers } = createServerClient(request);
  if (result.success) {
    const res = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
    });

    if (res.error) {
      return json({ failure: res.error });
    }

    await db.insert(users).values({
      username: result.data.email,
      email: result.data.email,
      password: result.data.password,
      id: res.data.user!.id, // this is from supabase
    });

    return redirect("/sign-up-confirmation", { headers });
  } else return json({ failure: result.error });
};

export default function SignUpPage() {
  return (
    <Container className="mt-10 flex h-[80vh] flex-col items-center justify-center">
      <form method="POST" className="flex w-2/3 flex-col gap-9">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="text" id="email" placeholder="enter your email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="enter your password"
          />
        </div>
        <Button>Sign Up</Button>
      </form>
    </Container>
  );
}
