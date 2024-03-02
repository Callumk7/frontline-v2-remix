import {
	Card,
	CardHeader,
	CardContent,
	Progress,
	Label,
	CardSubTitle,
} from "@/components";
import { playlistProgress } from "@/model/playlists/progress";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get("userId");
	const playlistId = url.searchParams.get("playlistId");

	if (!userId || !playlistId) {
		return {
			inCollectionCount: 0,
			playedCount: 0,
			completedCount: 0,
		};
	}

	const { inCollectionCount, playedCount, completedCount } = await playlistProgress(
		userId,
		playlistId,
	);

	return { inCollectionCount, playedCount, completedCount };
};

interface StatsSidebarProps {
	userId: string;
	playlistId: string;
	max: number;
	followerCount: number;
}
export function StatsSidebar({ userId, playlistId, max }: StatsSidebarProps) {
	const fetcher = useFetcher<typeof loader>();
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run the effect on mount
	useEffect(() => {
		fetcher.submit(
			{ userId: userId, playlistId: playlistId },
			{ method: "get", action: `/res/playlist-sidebar/${userId}` },
		);
	}, []);
	return (
		<Card>
			<CardHeader>
				<CardSubTitle>Progress</CardSubTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-1">
						<Label>In your Collection</Label>
						<Progress
							value={fetcher.data ? fetcher.data.inCollectionCount : 0}
							max={max}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label>Played</Label>
						<Progress value={fetcher.data ? fetcher.data.playedCount : 0} max={max} />
					</div>
					<div className="flex flex-col gap-1">
						<Label>Completed</Label>
						<Progress value={fetcher.data ? fetcher.data.completedCount : 0} max={max} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface PlaylistProgressProps {
	userId: string;
	playlistId: string;
	max: number;
}

export function PlaylistProgress({ userId, playlistId, max }: PlaylistProgressProps) {
	const fetcher = useFetcher<typeof loader>();
	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run the effect on mount
	useEffect(() => {
		fetcher.submit(
			{ userId: userId, playlistId: playlistId },
			{ method: "get", action: `/res/playlist-sidebar/${userId}` },
		);
	}, []);
	return (
		<div className="flex flex-col gap-1">
			<Progress
				value={fetcher.data ? fetcher.data.playedCount : 0}
				max={max}
				className="h-2"
			/>
			<Progress
				value={fetcher.data ? fetcher.data.completedCount : 0}
				max={max}
				className="h-2"
			/>
		</div>
	);
}
