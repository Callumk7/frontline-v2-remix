interface RatingCardProps {
	avRating: number;
	ratingCount: number;
}

export function RatingCard({ avRating, ratingCount }: RatingCardProps) {
	return (
		<div className="p-3 rounded-md border">
			<span className="text-lg font-black">
				{Math.floor(avRating)}{" "}
				<span className="text-xs font-light text-foreground-muted">av. rating</span>
			</span>
			<div>
				<span className="text-xs">/</span>
				<span>{ratingCount}</span>{" "}
				<span className="text-xs font-light text-foreground-muted">users</span>
			</div>
		</div>
	);
}
