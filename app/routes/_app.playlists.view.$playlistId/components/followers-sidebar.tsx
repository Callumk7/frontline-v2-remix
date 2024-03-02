import { Card, CardHeader, CardSubTitle, CardContent } from "@/components";

interface FollowerSidebarProps {
	followers: number;
	rating: number;
}

export function FollowerSidebar({ followers, rating }: FollowerSidebarProps) {
	return (
		<Card>
			<CardHeader>
				<CardSubTitle>Playlist Stats</CardSubTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-5">
					<div className="flex justify-between">
						<p className="font-semibold">Followers:</p>
						<p>{followers}</p>
					</div>
					<div className="flex justify-between">
						<p className="font-semibold">Rating:</p>
						<p>{rating}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
