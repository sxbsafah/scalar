import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { Check, X } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

type NotificationProps = {
  src: string;
  username: string;
  workspaceName: string;
  timestamp: number;
  onAccept: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<Id<"memberships">>;
  onDecline: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<null>;
};

const Notification = ({
  src,
  username,
  workspaceName,
  timestamp,
  onAccept,
  onDecline
}: NotificationProps) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isDeclineLoading, setIsDeclineLoading] = useState(false);
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-xl p-3 shadow-2xs">
      <div className="flex gap-1.5 items-center">
        <Avatar>
          <AvatarImage src={src} alt="Avatar" />
          <AvatarFallback>User Avatar</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-muted-foreground text-[14px] font-medium">
            <span className="text-card-foreground">{username}</span> invited you
            into {workspaceName}
          </p>
          <span className="text-muted-foreground text-[12px]">
            {timestamp} ago
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={async () => {
          setIsAcceptLoading(isAcceptLoading => !isAcceptLoading);
          try {
            const membereship = await onAccept()
            if (!membereship) {
              throw new Error("Failed to accept invitation");
            }
          } catch (err) {
            toast.error((err as Error).message, {
              position: "bottom-right",
            })
          } finally {
            setIsAcceptLoading(isAcceptLoading => !isAcceptLoading);
          }
        }} disabled={isAcceptLoading || isDeclineLoading}>{isAcceptLoading ? (
            <>
              <Spinner />
              processing
            </>
          ) : (
              <>
                <Check />
                Accept
              </>

        )}</Button>
        <Button variant={"destructive"} disabled={isDeclineLoading || isAcceptLoading} onClick={async () => {
          setIsDeclineLoading(isDeclineLoading => !isDeclineLoading);
          try {
            await onDecline();
          } catch (err) {
            toast.error((err as Error).message, {
              position: "bottom-right"
            })
          } finally {
            setIsDeclineLoading(isDeclineLoading => !isDeclineLoading);
          }
        }}>{isDeclineLoading ? (
            <>
              <Spinner />
              processing
            </>
          ) : (
              <>
                <X />
                Decline
              </>

        )}</Button>
      </div>
    </div>
  );
};

export default Notification;
