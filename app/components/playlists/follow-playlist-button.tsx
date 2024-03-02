import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";

interface FollowPlaylistButtonProps {
	userId: string;
	playlistId: string;
	isFollowedByUser: boolean;
}
export function FollowPlaylistButton({
	isFollowedByUser,
	userId,
	playlistId,
}: FollowPlaylistButtonProps) {
	const followFetcher = useFetcher();
	return (
		<Button
			size={"icon"}
			variant={isFollowedByUser ? "secondary" : "ghost"}
			onClick={() =>
				followFetcher.submit(
					{ userId: userId, playlistId: playlistId },
					{ method: isFollowedByUser ? "DELETE" : "POST", action: "/api/followers" },
				)
			}
		>
			{followFetcher.state === "submitting" ? (
				<UpdateIcon className="animate-spin" />
			) : (
				<BookmarkFilledIcon />
			)}
		</Button>
	);
}
