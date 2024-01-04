import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { createServerClient, getSession } from "@/features/auth";
import { Container } from "@/features/layout";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthError } from "@supabase/supabase-js";
import { ZodError, z } from "zod";
import { zx } from "zodix";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

  const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!
  }

  if (session) {
    return redirect("/", { headers });
  }

  return ENV;
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
  const ENV = useLoaderData<typeof loader>()
  const supabase = createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

  const handleGitHubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/callback`,
      },
    });

    if (error) {
      console.log({ error });
    }
  };
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/callback`,
      },
    });

    if (error) {
      console.log({ error });
    }
  };

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
      <div className="mt-9 flex w-2/3 justify-between gap-4">
        <Button variant={"secondary"} className="w-full" onClick={handleGitHubLogin}>
          Sign In With Github
        </Button>
        <Button variant={"secondary"} className="w-full" onClick={handleGoogleLogin}>
          Sign In With Google
        </Button>
      </div>
    </Container>
  );
}
