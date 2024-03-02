import { useFetcher } from "@remix-run/react";
import { Button, TextArea } from "..";
import { useState } from "react";

interface NewCommentFormProps {
	userId: string;
	action: string;
}
export function NewCommentForm({ action, userId }: NewCommentFormProps) {
	const [content, setContent] = useState<string>("");
	const fetcher = useFetcher();
	return (
		<fetcher.Form
			className="flex flex-col gap-3"
			method="POST"
			action={action}
			onSubmit={() => setContent("")}
		>
			<TextArea
				className="resize-none h-36"
				placeholder="What have you got to say?"
				name="body"
				value={content}
				onInput={(e) => setContent(e.currentTarget.value)}
			/>
			<input type="hidden" name="user_id" value={userId} />
			<Button>Post</Button>
		</fetcher.Form>
	);
}
