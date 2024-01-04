import { Tag } from "@/components/ui/tag";

interface GenreFilterProps {
  genres: string[];
  genreFilter: string[];
  handleGenreToggled: (genre: string) => void;
  handleToggleAllGenres: () => void;
}

export function GenreFilter({
  genres,
  genreFilter,
  handleGenreToggled,
  handleToggleAllGenres,
}: GenreFilterProps) {
  return (
    <div className="self-start flex flex-wrap gap-2">
      <button onClick={handleToggleAllGenres}>
        <Tag variant={genreFilter.length === genres.length ? "primary" : "secondary"}>
          All
        </Tag>
      </button>
      {genres.map((genre, index) => (
        <button onClick={() => handleGenreToggled(genre)} key={index}>
          <Tag variant={genreFilter.includes(genre) ? "primary" : "default"} key={index}>
            {genre}
          </Tag>
        </button>
      ))}
    </div>
  );
}
