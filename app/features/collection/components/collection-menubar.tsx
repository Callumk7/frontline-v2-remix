import { GameSearch } from "./game-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { ChangeEvent } from "react";
import { SortOption } from "@/features/library/hooks/sort";
import { GameSort } from "@/features/library/components/game-sort";

interface CollectionMenubarProps {
  userId: string;
  searchTerm: string;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  handleSearchTermChanged: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function CollectionMenubar({
  userId,
  searchTerm,
  sortOption,
  setSortOption,
  handleSearchTermChanged,
}: CollectionMenubarProps) {
  return (
    <div className="flex justify-between">
      <div className="flex w-full justify-start gap-4">
        <GameSearch userId={userId} />
        <GameSort sortOption={sortOption} setSortOption={setSortOption} />
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
