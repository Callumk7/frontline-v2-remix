import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SortOption } from "../hooks/sort";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

interface GameSortProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
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

export function GameSortAndFilterMenu({
  sortOption,
  setSortOption,
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
}: GameSortProps) {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Sort</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={sortOption}>
            <MenubarRadioItem value="rating" onClick={() => setSortOption("rating")}>
              Rating
            </MenubarRadioItem>
            <MenubarRadioItem
              className="flex justify-between"
              value={sortOption === "nameAsc" ? "nameAsc" : "nameDesc"}
              onClick={
                sortOption === "nameAsc"
                  ? () => setSortOption("nameDesc")
                  : () => setSortOption("nameAsc")
              }
            >
              <span>Alphabetical</span>
              {sortOption === "nameAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </MenubarRadioItem>
            <MenubarRadioItem
              className="flex justify-between"
              value={
                sortOption === "releaseDateAsc" ? "releaseDateAsc" : "releaseDateDesc"
              }
              onClick={
                sortOption === "releaseDateAsc"
                  ? () => setSortOption("releaseDateDesc")
                  : () => setSortOption("releaseDateAsc")
              }
            >
              <span>Release Date</span>
              {sortOption === "releaseDateAsc" ? <ArrowDownIcon /> : <ArrowUpIcon />}
            </MenubarRadioItem>
            <MenubarRadioItem
              value="dateAdded"
              onClick={() => setSortOption("dateAdded")}
            >
              Date Added
            </MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Filters</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={filterOnCompleted}
            onClick={handleToggleFilterOnCompleted}
          >
            Completed
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={filterOnPlayed}
            onClick={handleToggleFilterOnPlayed}
          >
            Played
          </MenubarCheckboxItem>
          <MenubarItem inset>Starred</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
