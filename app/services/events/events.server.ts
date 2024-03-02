import { uuidv4 } from "@/util/generate-uuid";
import { db } from "db";
import { activity } from "db/schema/activity";
import { EventEmitter } from "node:events";

class ActivityManager extends EventEmitter {
	createPlaylist(userId: string, playlistId: string) {
		this.emit("pl_create", userId, playlistId, Date.now());
	}

	addGameToPlaylist(userId: string, playlistId: string, gameId: number) {
		this.emit("pl_add_game", userId, playlistId, gameId, Date.now());
	}

	removeGameFromPlaylist(userId: string, playlistId: string, gameId: number) {
		this.emit("pl_remove_game", userId, playlistId, gameId, Date.now());
	}

	followPlaylist(userId: string, playlistId: string) {
		this.emit("pl_follow", userId, playlistId, Date.now());
	}

	addToCollection(userId: string, gameId: number) {
		this.emit("col_add", userId, gameId, Date.now());
	}

	removeFromCollection(userId: string, gameId: number) {
		this.emit("col_remove", userId, gameId, Date.now());
	}

	leaveComment(userId: string, noteId: string) {
		this.emit("comment_add", userId, noteId, Date.now());
	}

	markGameAsPlayed(userId: string, gameId: number) {
		this.emit("game_played", userId, gameId, Date.now());
	}

	markGameAsCompleted(userId: string, gameId: number) {
		this.emit("game_completed", userId, gameId, Date.now());
	}

	rateGame(userId: string, gameId: number, rating: number) {
		this.emit("game_rated", userId, gameId, rating, Date.now());
	}
}

export const activityManager = new ActivityManager();
activityManager.on(
	"pl_create",
	(userId: string, playlistId: string, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				playlistId: playlistId,
				userId: userId,
				type: "pl_create",
			})
			.then(() =>
				console.log(
					`pl_create logged; user: ${userId}, playlist: ${playlistId} at: ${timestamp}`,
				),
			);
	},
);

activityManager.on(
	"pl_add_game",
	(userId: string, playlistId: string, gameId: number, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				playlistId: playlistId,
				userId: userId,
				gameId: gameId,
				type: "pl_add_game",
			})
			.then(() =>
				console.log(
					`pl_add_game logged; user: ${userId}, playlist: ${playlistId}, game: ${gameId}, at: ${timestamp}`,
				),
			);
	},
);

activityManager.on(
	"pl_remove_game",
	(userId: string, playlistId: string, gameId: number, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				playlistId: playlistId,
				userId: userId,
				gameId: gameId,
				type: "pl_remove_game",
			})
			.then(() =>
				console.log(
					`pl_remove_game logged; user: ${userId}, playlist: ${playlistId}, game: ${gameId}, at: ${timestamp}`,
				),
			);
	},
);

activityManager.on(
	"pl_follow",
	(userId: string, playlistId: string, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				playlistId: playlistId,
				userId: userId,
				type: "pl_follow",
			})
			.then(() =>
				console.log(
					`pl_follow logged; user: ${userId}, playlist: ${playlistId}, at: ${timestamp}`,
				),
			);
	},
);

activityManager.on("col_add", (userId: string, gameId: number, timestamp: string) => {
	db.insert(activity)
		.values({
			id: `act_${uuidv4()}`,
			userId: userId,
			gameId: gameId,
			type: "col_add",
		})
		.then(() =>
			console.log(
				`col_add logged; user: ${userId}, game: ${gameId}, at: ${timestamp}`,
			),
		);
});

activityManager.on("col_remove", (userId: string, gameId: number, timestamp: string) => {
	db.insert(activity)
		.values({
			id: `act_${uuidv4()}`,
			userId: userId,
			gameId: gameId,
			type: "col_remove",
		})
		.then(() =>
			console.log(
				`col_remove logged; user: ${userId}, game: ${gameId}, at: ${timestamp}`,
			),
		);
});

activityManager.on("game_played", (userId: string, gameId: number, timestamp: string) => {
	db.insert(activity)
		.values({
			id: `act_${uuidv4()}`,
			userId: userId,
			gameId: gameId,
			type: "game_played",
		})
		.then(() =>
			console.log(
				`game_played logged; user: ${userId}, game: ${gameId}, at: ${timestamp}`,
			),
		);
});

activityManager.on(
	"game_completed",
	(userId: string, gameId: number, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				userId: userId,
				gameId: gameId,
				type: "game_completed",
			})
			.then(() =>
				console.log(
					`game_completed logged; user: ${userId}, game: ${gameId}, at: ${timestamp}`,
				),
			);
	},
);

activityManager.on(
	"comment_add",
	(userId: string, noteId: string, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				userId: userId,
				noteId: noteId,
				type: "comment_add",
			})
			.then(() =>
				console.log(
					`comment_add logged; user: ${userId}, note: ${noteId}, at: ${timestamp}`,
				),
			);
	},
);

activityManager.on(
	"game_rated",
	(userId: string, gameId: number, rating: number, timestamp: string) => {
		db.insert(activity)
			.values({
				id: `act_${uuidv4()}`,
				userId: userId,
				gameId: gameId,
				rating: rating,
				type: "game_rated",
			})
			.then(() =>
				console.log(
					`game_rated logged; user: ${userId}, gameId: ${gameId}, rating: ${rating} at: ${timestamp}`,
				),
			);
	},
);
