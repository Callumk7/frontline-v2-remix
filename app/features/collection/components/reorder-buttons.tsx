import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface ReorderButtonsProps {
	gameId: number;
	userId: string;
}

export function ReorderButtons({ gameId, userId }: ReorderButtonsProps) {
	return (
		<div>
			<Button variant={"ghost"} size={"icon"}>
				<ArrowUpIcon />
			</Button>
			<Button variant={"ghost"} size={"icon"}>
				<ArrowDownIcon />
			</Button>
		</div>
	);
}
