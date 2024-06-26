import { Menu } from "lucide-react";
import NavigationSidebar from "./navigation/NavigationSidebar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import ServerSidebar from "./server/ServerSidebar";

const MobileTogggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className=" md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side={"left"} className=" p-0 flex gap-0">
        <div className=" w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileTogggle;
