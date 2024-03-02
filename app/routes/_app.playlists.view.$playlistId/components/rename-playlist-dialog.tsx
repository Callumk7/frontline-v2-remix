import { DialogHeader, Input, Dialog, DialogContent, DialogTitle } from "@/components";
import { useFetcher } from "@remix-run/react";

interface RenamePlaylistDialogProps {
	renameDialogOpen: boolean;
	setRenameDialogOpen: (dialogOpen: boolean) => void;
	playlistId: string;
}

export function RenamePlaylistDialog({
	renameDialogOpen,
	setRenameDialogOpen,
	playlistId,
}: RenamePlaylistDialogProps) {
	const renameFetcher = useFetcher();
	return (
		<Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Choose a new name</DialogTitle>
				</DialogHeader>
				<renameFetcher.Form method="PATCH" action={`/api/playlists/${playlistId}`}>
					<Input name="playlistName" type="text" />
				</renameFetcher.Form>
			</DialogContent>
		</Dialog>
	);
}
