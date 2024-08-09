import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "@remix-run/react";

export function PageControls() {
	const [searchParams] = useSearchParams();
	const search = searchParams.get("search");
	let page = Number(searchParams.get("page"));
	if (!page) page = 1;
	let queryString = "?";
	if (search) queryString += `search=${search}`;

	return (
		<Pagination>
			<PaginationContent>
				{page > 1 && (
					<PaginationItem>
						<PaginationPrevious to={`${queryString}&page=${page - 1}`} />
					</PaginationItem>
				)}
				<PaginationItem>
					<PaginationNext to={`${queryString}&page=${page + 1}`} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
