import { useFetcher } from "@remix-run/react";

export const useCollectionControls = (
	userId: string,
	gameId: number,
	played: boolean,
	completed: boolean,
	pinned: boolean,
) => {
	const deleteFetcher = useFetcher();
	const playedFetcher = useFetcher();
	const completedFetcher = useFetcher();
	const togglePinFetcher = useFetcher();

	const handleRemove = () => {
		deleteFetcher.submit(
			{
				gameId,
				userId,
			},
			{
				method: "delete",
				action: "/api/collections",
			},
		);
	};

	const handleMarkAsPlayed = () => {
		playedFetcher.submit(
			{
				gameId,
				played: !played,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	const handleMarkAsCompleted = () => {
		completedFetcher.submit(
			{
				gameId,
				completed: !completed,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	const handleTogglePinned = () => {
		togglePinFetcher.submit(
			{
				gameId,
				pinned: !pinned,
			},
			{
				method: "put",
				action: `/api/collections/${userId}`,
			},
		);
	};

	return {
		handleRemove,
		handleMarkAsPlayed,
		handleMarkAsCompleted,
		handleTogglePinned,
	};
};
