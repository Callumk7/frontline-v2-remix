import { Tag, TagToggle } from "@/components/ui/tag";

interface GenreFilterProps {
	genres: string[];
	genreFilter: string[];
	handleGenreToggled: (genre: string) => void;
	handleToggleAllGenres: (genres: string[]) => void;
}

export function GenreFilter({
	genres,
	genreFilter,
	handleGenreToggled,
	handleToggleAllGenres,
}: GenreFilterProps) {
	return (
		<div className="flex flex-wrap gap-2 self-start">
			<button type="button" onClick={() => handleToggleAllGenres(genres)}>
				<Tag variant={genreFilter.length === genres.length ? "primary" : "secondary"}>
					All
				</Tag>
			</button>
			{genres.map((genre) => (
				<button type="button" onClick={() => handleGenreToggled(genre)} key={genre}>
					<Tag variant={genreFilter.includes(genre) ? "primary" : "default"} key={genre}>
						{genre}
					</Tag>
				</button>
			))}
		</div>
	);
}

export function GenreTags({ genres }: { genres: string[] }) {
	return (
		<div className="flex flex-wrap gap-2 self-start">
			{genres.map((genre) => (
				<Tag variant={"default"} key={genre}>
					{genre}
				</Tag>
			))}
		</div>
	);
}

export function GenreToggles({
	genres,
	genreFilter,
	handleGenreToggled,
	handleToggleAllGenres,
}: GenreFilterProps) {
	return (
		<div className="flex flex-wrap gap-2 self-start">
			<Tag variant={genreFilter.length === genres.length ? "primary" : "secondary"}>
				<button type="button" onClick={() => handleToggleAllGenres(genres)}>
					All
				</button>
			</Tag>
			{genres.map((genre) => (
				<TagToggle
					key={genre}
					pressed={genreFilter.includes(genre)}
					onPressedChange={() => handleGenreToggled(genre)}
					name="genres"
					value={genre}
				>
					{genre}
				</TagToggle>
			))}
		</div>
	);
}
