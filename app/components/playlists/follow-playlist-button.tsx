import { Button } from "@/components/ui/button";
import { useUserCacheStore } from "@/store";
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
	const appendToFollowedPlaylists = useUserCacheStore(
		(state) => state.appendToFollowedPlaylists,
	);
	const removeFromFollowedPlaylists = useUserCacheStore(
		(state) => state.removeFromFollowedPlaylists,
	);
	const handleToggle = () => {
		followFetcher.submit(
			{ userId: userId, playlistId: playlistId },
			{ method: isFollowedByUser ? "DELETE" : "POST", action: "/api/followers" },
		);
		if (isFollowedByUser) {
			removeFromFollowedPlaylists(playlistId);
		} else {
			appendToFollowedPlaylists(playlistId);
		}
	};
	return (
		<Button
			size={"icon"}
			variant={isFollowedByUser ? "secondary" : "ghost"}
			onClick={handleToggle}
		>
			{followFetcher.state === "submitting" ? (
				<UpdateIcon className="animate-spin" />
			) : (
				<BookmarkFilledIcon />
			)}
		</Button>
	);
}
