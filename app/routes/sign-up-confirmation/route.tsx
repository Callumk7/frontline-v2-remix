import { Container } from "@/components";
import { Link } from "@remix-run/react";

export default function CheckEmailPage() {
	return (
		<Container className="flex flex-col gap-6 m-40 text-center">
			<Link to={"/"}>Home</Link>
			<h1 className="text-6xl font-bold">Sign up completed!</h1>
			<p>Head to your email inbox now to verify your email and sign in!</p>
		</Container>
	);
}
