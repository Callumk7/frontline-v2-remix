import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
	ScrollArea,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components";
import { Game, Tag } from "@/types";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { useState } from "react";

interface PlaylistMenubarProps {
	isPrivate: boolean;
	userCollection: Game[];
	playlistId: string;
	playlistGames: number[];
	userId: string;
	setRenameDialogOpen: (renameDialogOpen: boolean) => void;
	setDeletePlaylistDialogOpen: (deletePlaylistDialogOpen: boolean) => void;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	tags: Tag[];
}

export function PlaylistMenubar({
	isPrivate,
	userCollection,
	playlistGames,
	playlistId,
	userId,
	setRenameDialogOpen,
	setDeletePlaylistDialogOpen,
	isEditing,
	setIsEditing,
	tags,
}: PlaylistMenubarProps) {
	const markAsPrivateFetcher = useFetcher();

	const handleTogglePrivate = () => {
		markAsPrivateFetcher.submit(
			{ isPrivate: !isPrivate },
			{ action: `/api/playlists/${playlistId}`, method: "PATCH" },
		);
	};

	const addTagFetcher = useFetcher();
	const handleAddTag = (tagId: string) => {
		addTagFetcher.submit({ playlistId, tagId }, { method: "POST", action: "/api/tags" });
	};

	return (
		<div className="flex gap-3">
			<Menubar>
				<MenubarMenu>
					<MenubarTrigger>Menu</MenubarTrigger>
					<MenubarContent>
						<MenubarItem onClick={() => setDeletePlaylistDialogOpen(true)}>
							Delete
						</MenubarItem>
						<MenubarItem onClick={() => setRenameDialogOpen(true)}>Rename</MenubarItem>
						<MenubarItem onClick={handleTogglePrivate}>
							{isPrivate ? "Make Public" : "Set as Private"}
						</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Tags</MenubarTrigger>
					<MenubarContent>
						{tags.map((tag) => (
							<MenubarCheckboxItem key={tag.id} onClick={() => handleAddTag(tag.id)}>
								{tag.name}
							</MenubarCheckboxItem>
						))}
					</MenubarContent>
				</MenubarMenu>
			</Menubar>
			<Button
				variant={isEditing ? "default" : "outline"}
				onClick={() => setIsEditing(!isEditing)}
			>
				Edit
			</Button>
			<AddGameToPlaylistDialog
				userCollection={userCollection}
				playlistGames={playlistGames}
				userId={userId}
				playlistId={playlistId}
			/>
		</div>
	);
}

interface AddGameToPlaylistDialogProps {
	userCollection: Game[];
	playlistGames: number[];
	userId: string;
	playlistId: string;
}

function AddGameToPlaylistDialog({
	userCollection,
	playlistGames,
	userId,
	playlistId,
}: AddGameToPlaylistDialogProps) {
	const addGameFetcher = useFetcher();
	const [open, setOpen] = useState<boolean>(false);
	return (
		<Dialog aria-label="Add game to playlist dialog" open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"outline"} aria-label="Add games button">
					<PlusCircledIcon className="mr-3" aria-hidden="true" />
					<span>Add Games</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<addGameFetcher.Form
					method="POST"
					action={`/api/playlists/${playlistId}/games`}
					aria-labelledby="addGameForm"
					onSubmit={() => setOpen(false)}
				>
					<input type="hidden" name="addedBy" value={userId} />
					<ScrollArea className="h-[50vh] w-full">
						<Table aria-label="Games list">
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Select</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{userCollection.map((game) => (
									<AddGameTableRow
										key={game.id}
										game={game}
										inPlaylist={playlistGames.includes(game.gameId)}
									/>
								))}
							</TableBody>
						</Table>
					</ScrollArea>
					<DialogFooter>
						<Button aria-label="Submit button" type="submit">
							Add
						</Button>
					</DialogFooter>
				</addGameFetcher.Form>
			</DialogContent>
		</Dialog>
	);
}

function AddGameTableRow({ game, inPlaylist }: { game: Game; inPlaylist: boolean }) {
	const [checked, setChecked] = useState(inPlaylist);
	return (
		<TableRow key={game.id}>
			<TableCell onClick={() => setChecked(!checked)}>{game.title}</TableCell>
			<TableCell>{game.rating ?? 0}</TableCell>
			<TableCell className="flex items-center">
				<Checkbox
					value={game.gameId}
					name="gameIds"
					aria-label={`Select game ${game.title}`}
					checked={checked}
					onCheckedChange={() => setChecked(!checked)}
				/>
			</TableCell>
		</TableRow>
	);
}
