import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { createBrowserClient } from "@supabase/ssr";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Input, Button, Label, Container } from "@/components";
import { createServerClient, getSession } from "@/services";

///
/// LOADER
///
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { supabase, headers } = createServerClient(request);
	const session = await getSession(supabase);

	const ENV = {
		SUPABASE_URL: process.env.SUPABASE_URL!,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
	};

	if (session) {
		return redirect("/", { headers });
	}

	return ENV;
};

// Used with react-hook-form
const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(5),
});

///
/// UI ROUTE
///
export default function LoginPage() {
	// Create client side supabase client
	const ENV = useLoaderData<typeof loader>();
	const supabase = createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

	// create navigation hook
	const navigate = useNavigate();

	// SUPABASE LOGIN HANDLERS
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

	const [authError, setAuthError] = useState<AuthError | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		const { error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password,
		});

		if (error) {
			setAuthError(error);
		} else {
			navigate("/");
		}
	};

	console.log(watch("email"));

	return (
		<>
			{
				// An alert that is rendered if we have issues returned from Supabase.
				// It might work better as toast, something to consider.
				authError && (
					<div className="absolute top-0 p-6">
						<Alert variant={"destructive"} className="w-full">
							<ExclamationTriangleIcon className="h-4 w-4" />
							<AlertTitle>Error Logging In</AlertTitle>
							<AlertDescription>{authError.message}</AlertDescription>
						</Alert>
					</div>
				)
			}
			<Container className="mt-10 flex h-[80vh] flex-col items-center justify-center">
				<form
					className="mx-auto flex w-11/12 flex-col gap-9 md:w-2/3"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							type="text"
							id="email"
							placeholder="enter your email"
							{...register("email")}
						/>
						<p className="min-h-4 text-sm font-medium leading-none text-destructive">
							{errors.email?.message}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							id="password"
							placeholder="enter your password"
							{...register("password")}
						/>
						<p className="min-h-4 text-sm font-medium leading-none text-destructive">
							{errors.password?.message}
						</p>
					</div>
					<Button>Sign In</Button>
				</form>
				<div className="mx-auto mt-9 flex w-11/12 flex-col justify-between gap-4 md:w-2/3">
					<Button variant={"secondary"} className="w-full" onClick={handleGitHubLogin}>
						Sign In With Github
					</Button>
					<Button variant={"secondary"} className="w-full" onClick={handleGoogleLogin}>
						Sign In With Google
					</Button>
					<Button
						variant={"outline"}
						className="w-full"
						onClick={() => navigate("/sign-up")}
					>
						Need an account? Sign Up!
					</Button>
				</div>
			</Container>
		</>
	);
}
