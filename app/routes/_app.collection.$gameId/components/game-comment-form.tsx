import { NewCommentForm } from "@/components";

interface GameCommentFormProps {
	userId: string;
	gameId: number;
}
export function GameCommentForm({ userId, gameId }: GameCommentFormProps) {
	return <NewCommentForm action={`/api/games/${gameId}/comments`} userId={userId} />;
}
