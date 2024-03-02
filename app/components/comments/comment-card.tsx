import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { User } from "@/types";
import { Note } from "@/types/notes";
import { ChatBubbleIcon, CheckIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { ButtonWithTooltip } from "../ui/custom/button-with-tooltip";
import { useEffect, useState } from "react";

interface PlaylistCommentProps {
	comment: Note;
	author: User;
}

export function Comment({ comment, author }: PlaylistCommentProps) {
	const [editContent, setEditContent] = useState<string>(comment.content);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	return (
		<Card className="relative">
			<CardHeader>
				<CardTitle>{author.username}</CardTitle>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<textarea
						className="bg-background text-foreground w-full h-full resize-y"
						value={editContent}
						onInput={(e) => setEditContent(e.currentTarget.value)}
					/>
				) : (
					<div>{comment.content}</div>
				)}
				<CommentControls
					comment={comment}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					editContent={editContent}
				/>
			</CardContent>
		</Card>
	);
}

interface CommentControlsProps {
	comment: Note;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	editContent: string;
}

function CommentControls({
	comment,
	isEditing,
	setIsEditing,
	editContent,
}: CommentControlsProps) {
	const deleteFetcher = useFetcher();
	const editFetcher = useFetcher();

	const handleToggleEdit = () => {
		if (isEditing) {
			editFetcher.submit(
				{
					commentId: comment.id,
					content: editContent,
				},
				{
					action: `/api/notes/${comment.id}`,
					method: "PATCH",
				},
			);
		}
		setIsEditing(!isEditing);
	};
	return (
		<div className="absolute top-3 right-3 flex gap-3">
			<ButtonWithTooltip tooltip="Reply">
				<ChatBubbleIcon />
			</ButtonWithTooltip>
			<ButtonWithTooltip
				tooltip={isEditing ? "Save Changes" : "Edit"}
				onClick={handleToggleEdit}
			>
				{isEditing ? <CheckIcon /> : <Pencil1Icon />}
			</ButtonWithTooltip>
			<ButtonWithTooltip
				tooltip="Delete"
				variant={"destructive"}
				onClick={() =>
					deleteFetcher.submit(
						{},
						{ method: "DELETE", action: `/api/notes/${comment.id}` },
					)
				}
			>
				<TrashIcon />
			</ButtonWithTooltip>
		</div>
	);
}
