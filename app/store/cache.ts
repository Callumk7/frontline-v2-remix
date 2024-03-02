import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserCacheStore {
	userCollection: number[];
	userPlaylists: string[];
	followedPlaylists: string[];
	userFriends: string[];
	setUserCollection: (userCollection: number[]) => void;
	appendToUserCollection: (gameId: number) => void;
	removeFromUserCollection: (gameId: number) => void;
	setUserFriends: (userFriends: string[]) => void;
	appendFriend: (friendId: string) => void;
	removeFriend: (friendId: string) => void;
	setUserPlaylists: (userPlaylists: string[]) => void;
	appendToUserPlaylists: (playlistId: string) => void;
	removeFromUserPlaylists: (playlistId: string) => void;
	setFollwedPlaylists: (followedPlaylists: string[]) => void;
	appendToFollowedPlaylists: (playlistId: string) => void;
	removeFromFollowedPlaylists: (playlistId: string) => void;
}

export const useUserCacheStore = create<UserCacheStore>()(
	devtools((set) => ({
		userCollection: [],
		userFriends: [],
		userPlaylists: [],
		followedPlaylists: [],
		setUserCollection: (userCollection) => set({ userCollection }),
		appendToUserCollection: (gameId) =>
			set((state) => ({ userCollection: [...state.userCollection, gameId] })),
		removeFromUserCollection: (gameId) =>
			set((state) => ({
				userCollection: [...state.userCollection].filter((id) => id !== gameId),
			})),
		setUserFriends: (userFriends) => set({ userFriends }),
		appendFriend: (friendId) =>
			set((state) => ({ userFriends: [...state.userFriends, friendId] })),
		removeFriend: (friendId) =>
			set((state) => ({
				userFriends: [...state.userFriends].filter((id) => id !== friendId),
			})),
		setUserPlaylists: (userPlaylists) => set({ userPlaylists }),
		appendToUserPlaylists: (playlistid) =>
			set((state) => ({ userPlaylists: [...state.userPlaylists, playlistid] })),
		removeFromUserPlaylists: (playlistid) =>
			set((state) => ({
				userPlaylists: [...state.userPlaylists].filter((id) => id !== playlistid),
			})),
		setFollwedPlaylists: (followedPlaylists) => set({ followedPlaylists }),
		appendToFollowedPlaylists: (playlistid) =>
			set((state) => ({
				followedPlaylists: [...state.followedPlaylists, playlistid],
			})),
		removeFromFollowedPlaylists: (playlistid) =>
			set((state) => ({
				followedPlaylists: [...state.followedPlaylists].filter(
					(id) => id !== playlistid,
				),
			})),
	})),
);
