import { NewCommentForm } from "@/components";

interface PlaylistCommentFormProps {
	userId: string;
	playlistId: string;
}
export function PlaylistCommentForm({ userId, playlistId }: PlaylistCommentFormProps) {
	return (
		<NewCommentForm action={`/api/playlists/${playlistId}/comments`} userId={userId} />
	);
}
