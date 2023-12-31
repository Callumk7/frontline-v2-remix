import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { AuthError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import { zx } from "zodix";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  if (session) {
    return redirect("/", { headers });
  }

  return null;
};

///
/// ACTION
///
export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, {
    email: z.string().email(),
    password: z.string(),
  });

  if (!result.success) {
    return json({ error: result.error });
  }

  const { supabase, headers } = createServerClient(request);
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return json({ error: error }, { headers });
  }

  return redirect("/", { headers });
};

export default function LoginPage() {
  // TODO: Good error handling.. this ain't it chief
  //
  // const data = useActionData<typeof action>();
  //
  // let zodError: ZodError | null = null;
  // let supaError: AuthError | null = null;
  // if (data) {
  //   if (data.error instanceof ZodError) {
  //     zodError = data.error;
  //     console.log(zodError)
  //   } else if (data.error instanceof AuthError) {
  //     supaError = data.error;
  //     console.log(supaError);
  //   }
  // }

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
        <Button>Sign In</Button>
      </form>
    </Container>
  );
}
