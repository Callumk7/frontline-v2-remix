import { useEffect, useState } from "react";
import { useTypedFetcher, useTypedLoaderData } from "remix-typedjson";

export const useRouteData = <L>() => {
	const loaderData = useTypedLoaderData<L>();
	const [data, setData] = useState(loaderData);
	const fetcher = useTypedFetcher<L>();
	useEffect(() => {
		if (fetcher.data !== undefined && fetcher.data !== data) {
			setData(fetcher.data);
		}
	}, [fetcher, data]);
	return {
		data,
		fetcher,
	};
};
