import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Dispatch, ReactNode, createContext, useContext, useState } from "react";
import { CreatePlaylistForm } from "./create-playlist-form";

interface PlaylistDialogOpenState {
	playlistDialogOpen: boolean;
	setPlaylistDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// create context with undefined as default value
const PlaylistDialogOpenContext = createContext<PlaylistDialogOpenState | undefined>(
	undefined,
);

interface PlaylistDialogOpenProviderProps {
	children: ReactNode;
}

export function PlaylistDialogOpenProvider({
	children,
}: PlaylistDialogOpenProviderProps) {
	const [playlistDialogOpen, setPlaylistDialogOpen] = useState<boolean>(false);

	return (
		<PlaylistDialogOpenContext.Provider
			value={{ playlistDialogOpen, setPlaylistDialogOpen }}
		>
			{children}
		</PlaylistDialogOpenContext.Provider>
	);
}

export function usePlaylistDialogOpen(): PlaylistDialogOpenState {
	const context = useContext(PlaylistDialogOpenContext);
	if (!context) {
		throw new Error(
			"usePlaylistDialogOpen must be used within a PlaylistDialogOpenProvider",
		);
	}
	return context;
}

interface CreatePlaylistDialogProps {
	userId: string;
	dialogOpen: boolean;
	setDialogOpen: Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePlaylistDialog({
	userId,
	dialogOpen,
	setDialogOpen,
}: CreatePlaylistDialogProps) {
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent>
				<DialogTitle>Create playlist</DialogTitle>
				<DialogDescription>
					Create a list that you can use to collect games that you think go together well
				</DialogDescription>
				<CreatePlaylistForm
					userId={userId}
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
				/>
			</DialogContent>
		</Dialog>
	);
}
