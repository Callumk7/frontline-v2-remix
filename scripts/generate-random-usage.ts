// This script is going to create lots of random usage to test how the
// application works at larger scales

import { InsertFollower, InsertGamesOnPlaylist, InsertUsersToGames } from "@/types";
import { uuidv4 } from "@/util/generate-uuid";
import { db } from "db";
import { games, usersToGames } from "db/schema/games";
import { followers, gamesOnPlaylists, playlists } from "db/schema/playlists";
import { users } from "db/schema/users";
import { sql } from "drizzle-orm";

async function main() {
	const dummyUsers: string[] = [];
	const dummyPlaylists: string[] = [];
	let i = 0;
	while (i < 10) {
		// we are going to create a new user in the user table
		const first = getRandomName(firstNames);
		const last = getRandomName(lastNames);
		const email = createEmail(
			first,
			last,
			emailDomains[Math.floor(Math.random() * emailDomains.length)],
		);
		const newDummyUser = await db
			.insert(users)
			.values({
				id: `DUMMY_${uuidv4()}`,
				firstName: first,
				lastName: last,
				email: email,
				password: "password",
				username: createRandomUsername(videoGameWords),
			})
			.returning();

		console.log(`New dummy user created: ${newDummyUser[0].username}`);
		console.log("Creating collection");

		const userId = newDummyUser[0].id;
		// add user to the array of created users so we can keep track of what we are making
		dummyUsers.push(userId);
		// get 10-50 random games
		const randomGames = await db
			.select()
			.from(games)
			.orderBy(sql`RANDOM()`)
			.limit(Math.floor(Math.random() * 40) + 10);

		console.log(`Selected ${randomGames.length} random games`);

		const collectionInsert: InsertUsersToGames[] = [];
		for (const game of randomGames) {
			collectionInsert.push({
				userId: userId,
				gameId: game.gameId,
				playerRating: Math.floor(Math.random() * 100),
				played: Math.random() > 0.5,
			});
		}

		console.log("inserting collection");
		await db.insert(usersToGames).values(collectionInsert);

		// Creating playlists and adding random games
		console.log("creating playlists");
		let j = 0;
		while (j < 10) {
			const newPlaylist = await db
				.insert(playlists)
				.values({
					id: `DUMMY_${uuidv4()}`,
					name: getRandomName(playlistNames),
					creatorId: userId,
				})
				.returning();

			console.log(`Playlist created: ${newPlaylist[0].name}`);
			const playlistId = newPlaylist[0].id;
			// keep track of dummy playlists that have been created so we can use them for follows
			dummyPlaylists.push(playlistId);

			console.log("adding random games");
			const playlistGamesInsert: InsertGamesOnPlaylist[] = [];
			const gameCount = Math.floor(Math.random() * randomGames.length + 1);
			let k = 0;
			while (k < gameCount) {
				playlistGamesInsert.push({
					playlistId: playlistId,
					gameId: randomGames[Math.floor(Math.random() * randomGames.length)]
						.gameId,
					addedBy: userId,
				});
				k++;
			}

			await db
				.insert(gamesOnPlaylists)
				.values(playlistGamesInsert)
				.onConflictDoNothing();
			j++;
		}
		i++;
	}

	console.log("created users and playlists");

	// after the users and playlists have been created, its time to follow and rate
	// each user should follow 1-15 playlists, and give it a random rating between 15 and 100
	console.log("starting to follow and rate playlists");
	for (const userId of dummyUsers) {
		const followInserts: InsertFollower[] = [];
		const playlistCount = Math.floor(Math.random() * 15);
		console.log(`following ${playlistCount} playlists`);
		for (let i = 0; i < playlistCount; i++) {
			followInserts.push({
				userId: userId,
				playlistId:
					dummyPlaylists[Math.floor(Math.random() * dummyPlaylists.length)],
				rating: Math.floor(Math.random() * 89) + 10,
			});
		}

		console.log("writing to database...");
		await db.insert(followers).values(followInserts).onConflictDoNothing();
		console.log(`Complete for user ${userId}`);
	}
}

// random AI generated playlist names:
const playlistNames = [
	//Serious Video Game Playlists
	"Epic Role-Playing Saga",
	"Survival Horror Collection",
	"World War II Experiences",
	"War-torn Strategy Series",
	"Sci-Fi Space Stories",
	"Historical Strategy Anthology",
	"Detective Crime Thrillers",
	"Apocalyptic Survival Journey",
	"Grand Strategy Games",
	"Real-Time Tactical Combat",
	"Nautical Adventures Trio",
	"Tactical Espionage Action",
	"Military Shooter Precision",
	"Realistic Racing Circuit",
	"Simulator Enthusiasts' Picks",
	"Hardcore Roguelike Challenge",
	"Post-Apocalyptic Roadtrip",
	"Medieval Knight Adventures",
	"Stealth Action Classics",
	"Mapping Fantasy RPGs",

	//Somewhat Serious to Neutral Video Game Playlists
	"Retro Platformer Picks",
	"Pixel Art Enthusiasts",
	"Massive Multiplayer Extravaganza",
	"Action Role-Playing Gems",
	"Epic Storyline Collection",
	"Family-Friendly MMOs",
	"Memorable Indie Surprises",
	"Charming Adventure Trips",
	"Classic Monster Slaying",
	"Solitude Exploration Gems",
	"Pirate Life For Me",
	"Timeless 90's Hits",
	"Farming and Crafting",
	"Cinematic Action Showcase",
	"Heroic Quest Compilation",
	"Zombie Outbreak Response",
	"Arena Battle Favorites",
	"Dystopian Future Vision",
	"Nostalgic 8-Bit Collection",
	"Single-Player Story Adventures",

	//Somewhat Wacky to Wacky Video Game Playlists
	"Quirky Indie Creations",
	"Party Game Extravaganza",
	"80s Arcade Nostalgia",
	"Fun with Physics",
	"Lightsaber Dueling Madness",
	"Cartoonish Caper Collection",
	"Weird and Wonderful Indies",
	"Bizarre Puzzle Frenzy",
	"Kingdoms of Whimsy",
	"Superhero Superfights",
	"Ridiculous Racing Rounds",
	"Aliens Everywhere",
	"Haunted Funhouse Frights",
	"Mad Scientist Experiments",
	"Chaotic Fighter Free-for-All",
	"Time-Traveling Antics",
	"Mythical Creature Mayhem",
	"Holiday Hijinks Extravaganza",
	"Pixelated Prankster Games",
	"Alien Invasion Survival",

	//Extremely Wacky Video Game Playlists
	"Absurdly Fun Chaos",
	"Interdimensional Shenanigans Series",
	"Celestial Cheese Chase",
	"Kitten Conjurer Capers",
	"Wild Wildlife Adventures",
	"Intergalactic Disco Dance Off",
	"Rainbow Unicorn Uprising",
	"Penguin Superhero Showdown",
	"Banana-Suit Duel Mania",
	"Valiant Vegetable Vengeance",
	"Space-Chicken Samba",
	"Dinosaur Dress-up Dance Party",
	"Crazy Clown Car Combat",
	"Robot Rodeo Rampage",
	"Invincible Taco Invasion",
	"Space Bandit Bread Bakers",
	"Mutant Pizza Party Massacre",
	"Hoverboard Hamster Heroes",
	"Glittering Gummy Bear Galaxy",
	"Extreme Extraterrestrial Eggplant Extravaganza",
];

const firstNames = [
	"John",
	"Ava",
	"Michael",
	"Emma",
	"Trevor",
	"Olivia",
	"Brad",
	"Mia",
	"Nathan",
	"Sophia",
	"Liam",
	"Grace",
	"Ethan",
	"Chloe",
	"Troy",
	"Avery",
	"Oscar",
	"Isabella",
	"Isaac",
	"Ella",
	"Jake",
	"Madison",
	"George",
	"Caitlin",
	"Ryan",
	"Hannah",
	"Luke",
	"Emily",
	"Jack",
	"Anna",
	"Benjamin",
	"Lilly",
	"Jacob",
	"Abigail",
	"Matthew",
	"Amelia",
	"Adam",
	"Harper",
	"Mason",
	"Charlotte",
	"Daniel",
	"Sophie",
	"Noah",
	"Evelyn",
	"Joshua",
	"Lauren",
	"David",
	"Mila",
	"Henry",
	"Victoria",
];

const lastNames = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Miller",
	"Davis",
	"Garcia",
	"Rodriguez",
	"Wilson",
	"Martinez",
	"Anderson",
	"Taylor",
	"Thomas",
	"Hernandez",
	"Moore",
	"Martin",
	"Jackson",
	"Thompson",
	"White",
	"Lopez",
	"Lee",
	"Gonzalez",
	"Harris",
	"Clark",
	"Lewis",
	"Robinson",
	"Walker",
	"Perez",
	"Hall",
	"Young",
	"Allen",
	"Sanchez",
	"Wright",
	"King",
	"Scott",
	"Green",
	"Baker",
	"Adams",
	"Nelson",
	"Hill",
	"Ramirez",
	"Campbell",
	"Mitchell",
	"Roberts",
	"Carter",
	"Phillips",
	"Evans",
	"Turner",
	"Torres",
];

const emailDomains = [
	"@clearSky.com",
	"@blueOcean.net",
	"@sunnyValley.org",
	"@silverMoon.co",
	"@greenMeadow.us",
	"@glitterStar.biz",
	"@goldenSun.io",
	"@dreamyCloud.info",
	"@rainbowLight.co.uk",
	"@twinklingStar.com.au",
	"@whisperingWinds.ca",
	"@frostyPeaks.cn",
	"@floatingLeaves.in",
	"@mysticRiver.jp",
	"@shimmeringLake.de",
	"@velvetNight.fr",
	"@emeraldForest.es",
	"@sparklingSnow.ru",
	"@dazzlingDesert.com.br",
	"@gentleRain.nl",
];

const videoGameWords = [
	"Gamer",
	"Cyber",
	"Ninja",
	"Pixel",
	"Knight",
	"Master",
	"Elite",
	"Legend",
	"Warrior",
	"Hero",
	"Quest",
	"Arcade",
	"Retro",
	"Sonic",
	"Mage",
	"Hunter",
	"Zelda",
	"Assassin",
	"Doom",
	"Valor",
	"Galaxy",
	"Empire",
	"Titan",
	"Champion",
	"Spartan",
	"Dragon",
	"Forge",
	"Pirate",
	"Warp",
	"Stealth",
	"Cosmic",
	"Rogue",
	"Dungeon",
	"Glitch",
	"Genesis",
	"Nova",
	"Blade",
	"Tank",
	"Fable",
	"Journey",
];

function getRandomName(names: string[]) {
	return names[Math.floor(Math.random() * names.length)];
}

function createRandomUsername(words: string[]) {
	return `${words[Math.floor(Math.random() * words.length)]}${
		words[Math.floor(Math.random() * words.length)]
	}`;
}

function createEmail(first: string, last: string, domain: string) {
	return `${first}-${last}${domain}`;
}

main();
