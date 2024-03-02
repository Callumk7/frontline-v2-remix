import { ArrowLeftIcon, ArrowRightIcon, CaretSortIcon } from "@radix-ui/react-icons";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "..";
import { useState } from "react";
import { useSearchParams } from "@remix-run/react";

interface PaginationAndLimitProps {
	limit: string;
	offset: number;
	setLimit: (limit: string) => void;
	setOffset: (offset: number) => void;
}
export function PaginationAndLimit({
	limit,
	offset,
	setLimit,
	setOffset,
}: PaginationAndLimitProps) {
	const [searchParams, setSearchParams] = useSearchParams();

	const handleValueChange = (v: string) => {
		const params = new URLSearchParams();
		params.set("limit", v);
		params.set("offset", "0");
		setOffset(0);
		setLimit(v);
		setSearchParams(params);
	};

	const handleOffsetIncrease = () => {
		const newOffset = offset + Number(limit);
		setOffset(newOffset);
		const params = new URLSearchParams(searchParams);
		params.set("offset", String(newOffset));
		params.set("limit", limit);
		setSearchParams(params);
	};

	const handleOffsetDecrease = () => {
		const newOffset = offset - Number(limit);
		setOffset(newOffset);
		const params = new URLSearchParams(searchParams);
		params.set("offset", String(newOffset));
		params.set("limit", limit);
		setSearchParams(params);
	};

	return (
		<div className="flex gap-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={"outline"} size={"sm"} className="relative w-20">
						<span className="absolute left-4">{limit}</span>{" "}
						<CaretSortIcon className="absolute right-3" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuRadioGroup value={limit} onValueChange={handleValueChange}>
						<DropdownMenuRadioItem value="25">25</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="150">150</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="200">200</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<Button
				variant={"outline"}
				size={"sm"}
				onClick={handleOffsetDecrease}
				disabled={offset === 0}
			>
				<ArrowLeftIcon />
			</Button>
			<Button variant={"outline"} size={"sm"} onClick={handleOffsetIncrease}>
				<ArrowRightIcon />
			</Button>
		</div>
	);
}
