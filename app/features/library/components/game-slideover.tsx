import {
	SlideOver,
	SlideOverContent,
	SlideOverDescription,
	SlideOverHeader,
	SlideOverTitle,
	SlideOverTrigger,
} from "@/components/ui/custom/slide-over";
import { GameWithCollection } from "@/types/games";
import { DBImage } from "./game-cover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface GameSlideOverProps {
	game: GameWithCollection;
	children: React.ReactNode;
}
export function GameSlideOver({ game, children }: GameSlideOverProps) {
	const [rating, setRating] = useState<number>(() => {
		if (game.playerRating === null) {
			return 0;
		} else {
			return game.playerRating;
		}
	});
	return (
		<SlideOver>
			<SlideOverTrigger>{children}</SlideOverTrigger>
			<SlideOverContent>
				<ScrollArea className="h-full w-full p-9">
					<div className="flex flex-col gap-2">
						<h1 className="py-3 text-5xl font-bold">{game.title}</h1>
						<Separator />
						<div className="grid grid-cols-4">
							<div className="col-span-1">
								<h3 className="font-semibold">Stats</h3>
								<div className="flex flex-col gap-4">
									<p>Rating</p>
									<Slider value={[rating]} onValueChange={(v) => setRating(v[0])} />
								</div>
							</div>
						</div>
					</div>
				</ScrollArea>
			</SlideOverContent>
		</SlideOver>
	);
}
