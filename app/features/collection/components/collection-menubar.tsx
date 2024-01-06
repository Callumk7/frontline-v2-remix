import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { ChangeEvent } from "react";
import { SortOption } from "@/features/library/hooks/sort";
import { GameSortAndFilterMenu } from "@/features/library";
import { GameSearchDialog } from "./game-search-dialog";

interface CollectionMenubarProps {
  userId: string;
  searchTerm: string;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  handleSearchTermChanged: (e: ChangeEvent<HTMLInputElement>) => void;
  filterOnPlayed: boolean;
  filterOnCompleted: boolean;
  filterOnStarred: boolean;
  filterOnRated: boolean;
  filterOnUnrated: boolean;
  handleToggleFilterOnPlayed: () => void;
  handleToggleFilterOnCompleted: () => void;
  handleToggleFilterOnStarred: () => void;
  handleToggleFilterOnRated: () => void;
  handleToggleFilterOnUnrated: () => void;
}

export function CollectionMenubar({
  userId,
  searchTerm,
  sortOption,
  setSortOption,
  handleSearchTermChanged,
  filterOnPlayed,
  filterOnCompleted,
  filterOnRated,
  filterOnUnrated,
  filterOnStarred,
  handleToggleFilterOnPlayed,
  handleToggleFilterOnCompleted,
  handleToggleFilterOnRated,
  handleToggleFilterOnUnrated,
  handleToggleFilterOnStarred,
}: CollectionMenubarProps) {
  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-start gap-4">
        <GameSearchDialog userId={userId} />
        <GameSortAndFilterMenu
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterOnPlayed={filterOnPlayed}
          filterOnCompleted={filterOnCompleted}
          filterOnRated={filterOnRated}
          filterOnUnrated={filterOnUnrated}
          filterOnStarred={filterOnStarred}
          handleToggleFilterOnPlayed={handleToggleFilterOnPlayed}
          handleToggleFilterOnCompleted={handleToggleFilterOnCompleted}
          handleToggleFilterOnRated={handleToggleFilterOnRated}
          handleToggleFilterOnUnrated={handleToggleFilterOnUnrated}
          handleToggleFilterOnStarred={handleToggleFilterOnStarred}
        />
        <Button variant={"outline"}>Select..</Button>
      </div>
      <Input
        name="search"
        type="search"
        value={searchTerm}
        onChange={handleSearchTermChanged}
        placeholder="Search your collection"
      />
    </div>
  );
}
