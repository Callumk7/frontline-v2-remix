import { FetcherWithComponents } from "@remix-run/react";
import { loader } from "../route";
import { Button, Input, Label } from "@/components";

interface SearchFormProps {
	searchFetcher: FetcherWithComponents<typeof loader>;
	offset: number;
	limit: number;
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
}

export function SearchForm({
	searchFetcher,
	offset,
	limit,
	searchTerm,
	setSearchTerm,
}: SearchFormProps) {
	return (
		<searchFetcher.Form method="get">
			<div className="grid grid-cols-2 gap-2">
				<Label>Search</Label>
				<Input
					type="text"
					name="search"
					value={searchTerm}
					onInput={(e) => setSearchTerm(e.currentTarget.value)}
				/>
			</div>
			<input type="hidden" name="offset" value={offset} />
			<input type="hidden" name="limit" value={limit} />
			<Button>Search</Button>
		</searchFetcher.Form>
	);
}
