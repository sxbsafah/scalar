import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";


const RecordOptions = () => {
  const user = useUser();
  return (
    <div className="flex items-center justify-between mb-8">
      <Avatar>
        <AvatarImage src={user.user?.imageUrl} className="rounded-full" />
        <AvatarFallback>User Avatar</AvatarFallback>
      </Avatar>
      <Button variant={"ghost"} size="icon">
        <XIcon />
      </Button>
    </div>
  );
};

export default RecordOptions;
