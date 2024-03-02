
///
/// LOADER

import { createServerClient, getSession } from "@/services";
import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "remix-typedjson";

///
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = createServerClient(request);
  const session = await getSession(supabase);

    if (!session) {
    return redirect("/?index", {
      headers,
    });
  }
}

