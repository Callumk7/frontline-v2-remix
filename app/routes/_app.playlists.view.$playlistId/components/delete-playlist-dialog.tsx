import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	Button,
} from "@/components";
import { Form } from "@remix-run/react";

interface DeletePlaylistDialogProps {
	deletePlaylistDialogOpen: boolean;
	setDeletePlaylistDialogOpen: (dialogOpen: boolean) => void;
	playlistId: string;
}

export function DeletePlaylistDialog({
	deletePlaylistDialogOpen,
	setDeletePlaylistDialogOpen,
	playlistId,
}: DeletePlaylistDialogProps) {
	return (
		<Dialog
			open={deletePlaylistDialogOpen}
			onOpenChange={setDeletePlaylistDialogOpen}
			modal={true}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Are you sure that you really want to delete this playlist?
					</DialogTitle>
				</DialogHeader>
				<div>
					Once you delete a playlist it is impossible to recover. All saved games will be
					lost to the void forever.
				</div>
				<div className="flex gap-6">
					<Form method="delete" action={`/api/playlists/${playlistId}`}>
						<Button variant={"destructive"} type="submit">
							Delete
						</Button>
					</Form>
					<Button
						variant={"outline"}
						type="button"
						onClick={() => setDeletePlaylistDialogOpen(false)}
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
