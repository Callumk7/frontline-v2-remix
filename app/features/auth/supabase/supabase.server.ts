import { redirect } from "@remix-run/node";
import {
	createServerClient as _createServerClient,
	parse,
	serialize,
} from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

export function createServerClient(request: Request) {
	const cookies = parse(request.headers.get("Cookie") ?? "");
	const headers = new Headers();

	const supabase = _createServerClient(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(key) {
					return cookies[key];
				},
				set(key, value, options) {
					headers.append("Set-Cookie", serialize(key, value, options));
				},
				remove(key, options) {
					headers.append("Set-Cookie", serialize(key, "", options));
				},
			},
		},
	);

	return { supabase, headers };
}

export async function getSession(supabase: SupabaseClient) {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
}

