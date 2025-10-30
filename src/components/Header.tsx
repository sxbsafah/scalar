import { UserButton } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Upload, Video } from "lucide-react";
import { Input } from "./ui/input";

const Header = () => {
  // Implementing Vector Search 
  return (
    <header className="flex items-center justify-between py-4 w-full mb-12">
      <div>
        <Input className={"w-[400px]"} />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Button size="sm">
            <Video />
            Record
          </Button>
          <Button size="sm">
            <Upload />
            Record
          </Button>
        </div>
          <UserButton />
      </div>
    </header>
  );
};

export default Header;
