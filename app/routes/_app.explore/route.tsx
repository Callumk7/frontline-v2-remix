import { NavigationLink } from "@/components";
import { Outlet } from "@remix-run/react";

export default function ExploreRoute() {
	return (
		<main>
			<ExploreNav />
			<div className="my-10">
				<Outlet />
			</div>
		</main>
	);
}

const exploreLinks = [
	{
		name: "Games",
		to: "/explore/games",
	},
	{
		name: "Playlists",
		to: "/explore/playlists",
	},
	{
		name: "People",
		to: "/explore/people",
	},
];

function ExploreNav() {
	return (
		<nav className="flex gap-4">
			{exploreLinks.map((link) => (
				<NavigationLink key={link.name} link={link} />
			))}
		</nav>
	);
}
