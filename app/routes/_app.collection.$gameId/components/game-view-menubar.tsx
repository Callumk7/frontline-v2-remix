import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components";
import { useUserCacheStore } from "@/store/cache";
import { Playlist } from "@/types";

interface GameViewMenubarProps {
	gameId: number;
	userPlaylists: Playlist[];
}

export function GameViewMenubar({ gameId, userPlaylists }: GameViewMenubarProps) {
	const userCollection = useUserCacheStore((state) => state.userCollection);
	const isInCollection = userCollection.includes(gameId);
	return (
		<Menubar className="w-fit">
			<MenubarMenu>
				<MenubarTrigger>Actions</MenubarTrigger>
				<MenubarContent>
					{isInCollection ? (
						<>
							<MenubarItem>Remove from collection</MenubarItem>
							<MenubarItem>Rate</MenubarItem>
							<MenubarItem>Mark as Played</MenubarItem>
							<MenubarItem>Mark as Completed</MenubarItem>
						</>
					) : (
						<MenubarItem>Add to collection</MenubarItem>
					)}
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Playlists</MenubarTrigger>
				<MenubarContent>
					<MenubarSub>
						<MenubarSubTrigger>Add to playlist</MenubarSubTrigger>
						<MenubarSubContent>
							{userPlaylists.map((pl) => (
								<MenubarCheckboxItem key={pl.id}>{pl.name}</MenubarCheckboxItem>
							))}
						</MenubarSubContent>
					</MenubarSub>
					<MenubarItem>Find playlists..</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
