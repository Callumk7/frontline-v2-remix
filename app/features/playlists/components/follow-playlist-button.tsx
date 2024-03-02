import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon, BookmarkIcon, UpdateIcon } from "@radix-ui/react-icons";
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
		<>
			{isFollowedByUser ? (
				<Button disabled size={"icon"} variant={"outline"}>
					<BookmarkFilledIcon />
				</Button>
			) : (
				<Button
					onClick={() =>
						followFetcher.submit(
							{ userId: userId, playlistId: playlistId },
							{ method: "POST", action: "/api/followers" },
						)
					}
					size={"icon"}
					variant={"secondary"}
				>
					{followFetcher.state === "submitting" ? (
						<UpdateIcon className="animate-spin" />
					) : (
						<BookmarkIcon />
					)}
				</Button>
			)}
		</>
	);
}
