import {
	PlaylistCreatedActivity,
	AddedToCollectionActivity,
	AddedGameToPlaylistActivity,
	RemovedGameFromPlaylistActivity,
	PlaylistFollowedActivity,
	RemovedGameFromCollectionActivity,
	GamePlayedActivity,
	GameCompletedActivity,
	GameRatedActivity,
	Card,
} from "@/components";
import { UserWithActivityFeedEntry } from "@/types";
import { ReactNode } from "react";

interface ActivityFeedCardProps {
	activity: UserWithActivityFeedEntry;
}
export function ActivityFeedCard({ activity }: ActivityFeedCardProps) {
	const type = activity.activity.type;

	let content: ReactNode = null;
	switch (type) {
		case "pl_create":
			content = (
				<PlaylistCreatedActivity user={activity} playlist={activity.activity.playlist} />
			);
			break;

		case "col_add":
			content = (
				<AddedToCollectionActivity user={activity} game={activity.activity.game} />
			);
			break;

		case "pl_add_game":
			content = (
				<AddedGameToPlaylistActivity
					user={activity}
					game={activity.activity.game}
					playlist={activity.activity.playlist}
				/>
			);
			break;

		case "pl_remove_game":
			content = (
				<RemovedGameFromPlaylistActivity
					user={activity}
					game={activity.activity.game}
					playlist={activity.activity.playlist}
				/>
			);
			break;

		case "pl_follow":
			content = (
				<PlaylistFollowedActivity user={activity} playlist={activity.activity.playlist} />
			);
			break;

		case "col_remove":
			content = (
				<RemovedGameFromCollectionActivity
					user={activity}
					game={activity.activity.game}
				/>
			);
			break;

		// TODO: this needs to be more granular
		case "comment_add":
			content = (
				<div>
					<p>{activity.username}</p>
					<p>Added a comment</p>
				</div>
			);
			break;

		case "game_played":
			content = <GamePlayedActivity user={activity} game={activity.activity.game} />;
			break;

		case "game_completed":
			content = <GameCompletedActivity user={activity} game={activity.activity.game} />;
			break;

		case "game_rated":
			content = (
				<GameRatedActivity
					user={activity}
					game={activity.activity.game}
					rating={activity.activity.rating}
				/>
			);
			break;

		default:
			return <div>something went wrong</div>;
	}

	const Feed: ReactNode = (
		<Card className="p-3">
			<div className="flex justify-between w-full pb-4">
				<span className="text-sm font-light">
					{activity.activity.timestamp.toDateString()}
				</span>
				<span className="text-sm font-light">
					{activity.activity.timestamp.getHours()}:
					{activity.activity.timestamp.getMinutes()}
				</span>
			</div>
			{content}
		</Card>
	);
	return Feed;
}
