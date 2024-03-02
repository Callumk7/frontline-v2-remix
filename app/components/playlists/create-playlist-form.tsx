import { Button, Input, Label, Switch } from "@/components";
import { Form, useNavigation } from "@remix-run/react";
import { useEffect } from "react";

interface CreatePlaylistFormProps {
	userId: string;
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
}

export function CreatePlaylistForm({
	userId,
	dialogOpen,
	setDialogOpen,
}: CreatePlaylistFormProps) {
	const navigation = useNavigation();
	const isSubmitting = navigation.formAction === "/playlists";

	// Close the modal when the navigation begins
	useEffect(() => {
		if (isSubmitting && dialogOpen) {
			setDialogOpen(false);
		}
	}, [isSubmitting, dialogOpen, setDialogOpen]);

	return (
		<Form method="POST" action="/playlists" className="flex flex-col gap-6">
			<div className="flex flex-row items-center space-x-3">
				<Input
					type="text"
					name="playlistName"
					placeholder="Best RPGs ever.."
					disabled={isSubmitting}
				/>
				<input type="hidden" name="userId" value={userId} />
				<Button variant={"outline"} size={"sm"} disabled={isSubmitting}>
					add
				</Button>
			</div>
			<div className="flex items-center gap-4">
				<Switch name="isPrivate" id="private" />
				<Label htmlFor="private">Private</Label>
			</div>
		</Form>
	);
}
