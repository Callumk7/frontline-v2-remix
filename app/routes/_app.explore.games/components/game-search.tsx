import {
	Button,
	Input,
	Toggle,
} from "@/components";
import { Form } from "@remix-run/react";
import { GridIcon } from "@radix-ui/react-icons";
import { View } from "../route";


interface GameSearchProps {
	setView: (view: View) => void;
}
export function GameSearch({ setView }: GameSearchProps) {
	return (
		<div className="flex gap-3">
			<Form className="flex flex-col gap-3">
				<div className="flex gap-3">
					<Input
						name="search"
						type="search"
						placeholder="What are you looking for?"
						className="w-[360px]" // This needs to be responsive
					/>
					<Button variant={"outline"}>Search</Button>
				</div>
			</Form>
			<Toggle
				variant={"outline"}
				onPressedChange={(pressed) => setView(pressed ? "card" : "list")}
			>
				<GridIcon />
			</Toggle>
		</div>
	);
}
