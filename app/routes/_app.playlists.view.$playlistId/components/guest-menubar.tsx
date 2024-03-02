import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	Button,
	Slider,
	Label,
	FollowPlaylistButton,
} from "@/components";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface GuestMenubarProps {
	isFollowing: boolean;
	playlistId: string;
	userId: string;
	userPlaylistRating: number | null;
}

export function GuestMenubar({
	isFollowing,
	playlistId,
	userId,
	userPlaylistRating,
}: GuestMenubarProps) {
	const [rating, setRating] = useState(0);
	const fetcher = useFetcher();
	return (
		<div className="flex items-center gap-4">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={"outline"} size={"icon"}>
						<MixerHorizontalIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="grid gap-4">
						<h4 className="font-medium leading-none">Rate Playlist</h4>
						<fetcher.Form action={`/api/playlists/${playlistId}/ratings`} method="POST">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2">
									<Label htmlFor="rating">Rating: {rating}</Label>
									<Slider
										value={[rating]}
										onValueChange={(v) => setRating(v[0])}
										name="rating"
										id="rating"
									/>
								</div>
								<input type="hidden" value={userId} name="user_id" />
								<Button variant={"outline"} size={"sm"} type="submit">
									Submit
								</Button>
							</div>
						</fetcher.Form>
					</div>
				</PopoverContent>
			</Popover>
			<FollowPlaylistButton
				isFollowedByUser={isFollowing}
				userId={userId}
				playlistId={playlistId}
			/>
		</div>
	);
}
