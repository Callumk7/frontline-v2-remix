import { FULL_GAME_FIELDS, IGDB_BASE_URL } from "@/constants";

export interface FetchOptions {
	fields?: string[] | "full";
	limit?: number;
	offset?: number;
	filters?: string[];
	sort?: string[];
	search?: string;
}

// TODO: Migrate to the better sdk below
export const fetchGamesFromIGDB = async (
	baseUrl: string,
	options: FetchOptions,
	headersOverride?: Record<string, string>,
): Promise<unknown[]> => {
	let body = "";

	if (options.search) {
		body += `search "${options.search}";`;
	}

	if (options.fields) {
		if (options.fields === "full") {
			body += FULL_GAME_FIELDS;
		} else {
			body += `fields ${options.fields.join(", ")};`;
		}
	}

	if (options.limit) {
		body += `limit ${options.limit};`;
	}

	if (options.offset) {
		body += `offset ${options.offset};`;
	}

	if (options.filters) {
		body += `where ${options.filters.join("& ")};`;
	}

	if (options.sort) {
		body += `sort ${options.sort.join(", ")};`;
	}

	// TODO: Add pagination

	let headers: Record<string, string> = {
		"Client-ID": process.env.IGDB_CLIENT_ID!,
		Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
		"content-type": "text/plain",
	};

	if (headersOverride) {
		headers = headersOverride;
	}

	try {
		const res = await fetch(`${baseUrl}/games`, { method: "POST", headers, body });
		const json = await res.json();
		return json as unknown[];
	} catch (e) {
		console.error(e);
		throw new Error("Error fetching games from IGDB");
	}
};

export const fetchGenresFromIGDB = async () => {
	const url = "https://api.igdb.com/v4/genres";
	const body = "fields name; limit 50;";

	const headers: Record<string, string> = {
		"Client-ID": process.env.IGDB_CLIENT_ID!,
		Authorization: `Bearer ${process.env.IGDB_BEARER_TOKEN!}`,
		"content-type": "text/plain",
	};

	try {
		const res = await fetch(url, { method: "POST", headers, body });
		const json = await res.json();
		return json as {id: string, name: string}[];
	} catch (e) {
		console.error(e);
		throw new Error("Error fetching games from IGDB");
	}
};

////////////////////////////////////////////////////////////////////////////////
//                           IGDB TYPESCRIPT SDK
////////////////////////////////////////////////////////////////////////////////

export class IGDBClient {
	private baseUrl: string = IGDB_BASE_URL;
	private clientId: string;
	private accessToken: string;

	constructor(clientId: string, accessToken: string) {
		this.clientId = clientId;
		this.accessToken = accessToken;
	}

	games(preset: "full" | "default" = "default"): QueryBuilder {
		return new QueryBuilder().selectPreset(preset);
	}

	async execute(endpoint: string, queryBuilder: QueryBuilder): Promise<unknown[]> {
		const query = queryBuilder.build();
		const response = await fetch(`${this.baseUrl}/${endpoint}`, {
			method: "POST",
			headers: {
				"Client-ID": this.clientId,
				Authorization: `Bearer ${this.accessToken}`,
				Accept: "application/json",
				"Content-Type": "text/plain",
			},
			body: query,
		});

		if (!response.ok) {
			console.error(response.statusText)
			console.error(await response.text())
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}
}

class QueryBuilder {
	private fields: string[] = [];
	private whereConditions: string[] = [];
	private searchTerm: string | null = null;
	private sortOptions: string[] = [];
	private limitValue: number | null = null;
	private offsetValue: number | null = null;

	private readonly presetSelections = {
		full: [
			"name",
			"artworks.image_id",
			"screenshots.image_id",
			"aggregated_rating",
			"aggregated_rating_count",
			"cover.image_id",
			"storyline",
			"first_release_date",
			"genres.name",
			"follows",
			"involved_companies",
			"rating",
		],
		default: ["name", "cover.image_id", "rating"],
	};

	selectPreset(preset: "full" | "default" = "default"): QueryBuilder {
		this.fields = [...this.presetSelections[preset]];
		return this;
	}

	select(...fields: string[]): QueryBuilder {
		this.fields.push(...fields);
		return this;
	}

	where(condition: string): QueryBuilder {
		this.whereConditions.push(condition);
		return this;
	}

	search(searchTerm: string | null): QueryBuilder {
		this.searchTerm = searchTerm;
		return this;
	}

	sort(field: string, order: "asc" | "desc" = "asc"): QueryBuilder {
		this.sortOptions.push(`${field} ${order}`);
		return this;
	}

	limit(value: number | null): QueryBuilder {
		this.limitValue = value;
		return this;
	}

	offset(value: number | null): QueryBuilder {
		this.offsetValue = value;
		return this;
	}

	build(): string {
		let query = "";
		if (this.searchTerm) {
			query += ` search "${this.searchTerm}";`
		}
		if (this.fields.length > 0) {
			query += `fields ${this.fields.join(", ")};`;
		}
		if (this.whereConditions.length > 0) {
			query += ` where ${this.whereConditions.join(" & ")};`;
		}
		if (this.sortOptions.length > 0 && this.searchTerm === null) {
			query += ` sort ${this.sortOptions.join(", ")};`;
		}
		if (this.limitValue !== null) {
			query += ` limit ${this.limitValue};`;
		}
		if (this.offsetValue !== null) {
			query += ` offset ${this.offsetValue};`;
		}
		console.log(query);
		return query;
	}
}
