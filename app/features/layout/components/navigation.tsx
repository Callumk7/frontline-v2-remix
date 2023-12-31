import { Button } from "@/components/ui/button";
import { Link, NavLink } from "@remix-run/react";

const links = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/explore",
    name: "Explore",
  },
  {
    to: "/collection",
    name: "Collection",
  },
  {
    to: "/playlists",
    name: "Playlists",
  },
];

export function Navbar() {
  return (
    <nav className="top-0 z-50 flex w-full flex-row items-center justify-between bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex flex-row justify-start gap-4">
        {links.map((link) => (
          <NavigationLink key={link.name} link={link} />
        ))}
      </div>
      <form action="/sign-out" method="POST">
        <Button variant={"outline"}>Sign Out</Button>
      </form>
    </nav>
  );
}

const NavigationLink = ({ link }: { link: { to: string; name: string } }) => (
  <NavLink key={link.name} to={link.to}>
    {({ isActive, isPending }) => (
      <Button variant={isActive ? "default" : isPending ? "secondary" : "ghost"}>
        {link.name}
      </Button>
    )}
  </NavLink>
);
