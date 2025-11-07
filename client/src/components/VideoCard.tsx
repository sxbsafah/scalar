import { Eye, MessageSquare, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="group bg-linear-to-br from-card to-card/80 rounded-2xl border border-border/30 overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer backdrop-blur-sm">
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-[180px] object-cover transition-transform duration-700 group-hover:scale-110"
        />

          <div className="absolute inset-0 bg-gradien  from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          <div className="bg-white/95 rounded-full p-3.5 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-black fill-black" />
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
          {time}
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-[15px] font-semibold mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
          {title}
        </h1>

        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8 ring-1 ring-border group-hover:ring-primary/40 transition-all duration-300">
            <AvatarImage src={avatar} alt={user} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
              {user.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{user}</h4>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-border/30 text-muted-foreground">
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{watchCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{commentsCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
