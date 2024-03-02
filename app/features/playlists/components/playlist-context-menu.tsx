import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Share1Icon, TrashIcon } from "@radix-ui/react-icons";

interface PlaylistContextMenuProps {
	children: React.ReactNode;
	asChild?: boolean;
}

export function PlaylistContextMenu({
	children,
	asChild = false,
}: PlaylistContextMenuProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild={asChild}>{children}</ContextMenuTrigger>
			<ContextMenuContent alignOffset={24}>
				<ContextMenuItem>
					<TrashIcon className="mr-2" />
					<span>Delete</span>
				</ContextMenuItem>
				<ContextMenuItem>
					<Share1Icon className="mr-2" />
					<span>Share</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
