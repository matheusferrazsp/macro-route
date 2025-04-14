import { Beef } from "lucide-react";

import { AccountMenu } from "./account-menu";

import { ModeToggle } from "../theme/theme-toggle";
import { Separator } from "../ui/separator";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center md:gap-6 md:px-6 gap-4 px-6">
        <Beef className="hidden sm:flex md:h-6 md:w-6" />

        <Separator orientation="vertical" className="md:h-6" />

        <nav className="flex items-center whitespace-nowrap space-x-4 md:space-x-4 lg:space-x-6"></nav>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
