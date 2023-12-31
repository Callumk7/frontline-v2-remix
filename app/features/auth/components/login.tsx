import { Button } from '@/components/ui/button';
import { Link } from '@remix-run/react';
import { Session, SupabaseClient } from '@supabase/supabase-js';

export function Login({
	supabase,
	session
}: {
	supabase: SupabaseClient;
	session: Session | null;
}) {
	const handleEmailLogin = async () => {
		const { error } = await supabase.auth.signInWithPassword({
			email: 'callumkloos@gmail.com',
			password: 'password'
		});

		if (error) {
			console.log({ error });
		}
	};

	const handleGitHubLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${location.origin}/callback`
			}
		});

		if (error) {
			console.log({ error });
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.log(error);
		}

    // TODO: add navigation to the home page
	};

	return session ? (
		<Button variant={"outline"} onClick={handleLogout}>Sign Out</Button>
	) : (
			<Button asChild>
        <Link to={"/login"}>Login</Link>
      </Button>
	);
}
