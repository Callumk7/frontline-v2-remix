import {
  Menubar,
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
}

export function GameSortAndFilterMenu({ sortOption, setSortOption }: GameSortProps) {
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
          <MenubarItem>Completed</MenubarItem>
          <MenubarItem>Playing</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
