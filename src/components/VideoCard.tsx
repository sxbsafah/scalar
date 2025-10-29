import { Eye, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type VideoCardProps = {
  thumbnail: string;
  title: string;
  user: string;
  avatar: string;
  time: string;
  watchCount: number;
  commentsCount: number;
};

const VideoCard = ({
  thumbnail,
  title,
  user,
  avatar,
  time,
  watchCount,
  commentsCount,
}: VideoCardProps) => {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border w-[300px] hover:cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all">
      <img src={thumbnail} alt="Thumbnail" className="rounded-t-xl w-full h-[169px] object-cover" />
      <div className="p-3">
        <h1 className="text-[14px] font-medium mb-3 line-clamp-2 h-[40px]">{title}</h1>
        <div className="flex items-center gap-1.5 mb-4">
          <Avatar>
            <AvatarImage src={avatar} alt={`@${user}`} />
            <AvatarFallback>{user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-[14px] font-medium">{user}</h4>
            <h5 className="text-[12px] text-muted-foreground">{time}</h5>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="gap-1 flex items-center text-muted-foreground">
            <h5>{watchCount}</h5>
            <Eye />
          </div>
          <div className="gap-1 flex items-center text-muted-foreground">
            <h5>{commentsCount}</h5>
            <MessageSquare />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;