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
		name: "Popular",
		to: "/explore/popular",
	},
	{
		name: "Playlists",
		to: "/explore/playlists",
	},
	{
		name: "People",
		to: "/explore/people",
	},
	{
		name: "Internal",
		to: "/explore/internal",
	},
];

function ExploreNav() {
	return (
		<nav className="flex justify-between w-1/3">
			{exploreLinks.map((link) => (
				<NavigationLink key={link.name} link={link} />
			))}
		</nav>
	);
}
