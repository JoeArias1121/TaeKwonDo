import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useLocation, Link } from "react-router-dom";

export default function NavBar() {
  const textStyle = `text-xl text-center whitespace-nowrap py-5 hover:bg-slate-200 hover:rounded-3xl active:rounded-3xl transiton-all duration-200`;
  const location = useLocation();
  return (
    <nav className="my-3">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex w-full text-slate-700 gap-x-10">
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}` + (location.pathname === "/" ? " bg-slate-300" : "")}>
              <Link to="/" >Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}` + (location.pathname === "/aboutme" ? " bg-slate-300" : "")}>
              <Link to="/aboutme">About Me</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}` + (location.pathname === "/members" ? " bg-slate-300" : "")}>
              <Link to="/members">Members</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}` + (location.pathname === "/events" ? " bg-slate-300" : "")}>
              <Link to="/events">Events</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}` + (location.pathname === "/contact" ? " bg-slate-300" : "")}>
              <Link to="/contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
