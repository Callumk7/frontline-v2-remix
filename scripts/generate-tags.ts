import { uuidv4 } from "@/util/generate-uuid";
import { db } from "db";
import { tags } from "db/schema/playlists";

const initialTags = [
	"Mystery",
	"Stealth",
	"Survival",
	"Metroidvania",
	"Rogue-like",
	"Turn-based",
	"Narrative",
	"Fantasy",
	"Esports",
	"Psychedelic",
	"Abstract",
	"Pixel-art",
	"Educational",
	"VR",
	"Non-violent",
	"Minimalistic",
	"Cyberpunk",
	"Post-apocalyptic",
	"Historical",
	"Underwater",
	"Space",
	"Dragons",
	"Zombie",
	"Vampire",
	"Aliens",
	"Pirates",
	"Shadow",
	"Neon",
	"Gothic",
	"Retro-futurism",
	"Speedrun",
	"Battle-Royale",
	"Music",
	"Building",
	"Science-Fiction",
	"Crafting",
	"Hack-and-slash",
	"Point-and-click",
	"MOBA",
	"Farming",
	"Co-op",
	"Procedural",
	"Dystopian",
	"Cute",
	"Superhero",
];

async function main() {
	for (const tag of initialTags) {
		const response = await db
			.insert(tags)
			.values({
				id: `tag_${uuidv4()}`,
				name: tag,
			})
			.returning();

		console.log(response);
	}
}

main();
