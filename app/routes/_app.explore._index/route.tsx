import { ReactNode, useEffect, useState } from "react";

export default function ExploreIndex() {
	return (
		<main>
			<div className="grid grid-cols-3 gap-12">
				<ExploreTile>Games</ExploreTile>
				<ExploreTile>Playlists</ExploreTile>
				<ExploreTile>Popular</ExploreTile>
				<ExploreTile>People</ExploreTile>
			</div>
		</main>
	);
}

const gradients = [
	"from-lime-200 to-sky-600",
	"from-pink-500 to-yellow-500",
	"from-red-500 to-blue-500",
	"from-purple-400 to-green-500",
	"from-blue-400 to-yellow-300",
	"from-indigo-500 to-pink-400",
	"from-red-400 to-yellow-200",
	"from-green-500 to-blue-400",
	"from-blue-300 to-green-300",
	"from-purple-400 to-red-300",
	"from-yellow-400 to-indigo-500",
	"from-green-400 to-pink-300",
	"from-red-300 to-blue-200",
	"from-blue-400 to-purple-300",
	"from-yellow-300 to-green-200",
	"from-pink-400 to-blue-400",
	"from-purple-300 to-yellow-200",
	"from-indigo-400 to-red-300",
	"from-green-300 to-indigo-200",
	"from-yellow-400 to-purple-300",
	"from-pink-300 to-green-200",
	"from-indigo-400 to-yellow-300",
	"from-red-200 to-blue-200",
	"from-green-400 to-purple-300",
	"from-blue-300 to-red-200",
];

function ExploreTile({ children }: { children: ReactNode }) {
	const [gradient, setGradient] = useState("");

	useEffect(() => {
		const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
		setGradient(randomGradient);
	}, []);

	return (
		<div
			className={`flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br text-center text-background shadow-xl shadow-black ${gradient}`}
		>
			{children}
		</div>
	);
}
