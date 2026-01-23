import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

export default function NavBar() {
  const textStyle = "text-xl text whitespace-nowrap -center py-5 hover: hover:bg-slate-100 hover:rounded-3xl active:rounded-3xl";
  return (
    <nav className="my-3">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex w-full text-slate-700 gap-x-10">
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}`}>
              <Link to="/" >Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}`}>
              <Link to="/aboutme">About Me</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}`}>
              <Link to="/members">Members</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}`}>
              <Link to="/events">Events</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${textStyle}`}>
              <Link to="/contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
