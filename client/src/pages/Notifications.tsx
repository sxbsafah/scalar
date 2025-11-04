import Notification from "@/components/Notification";
import NotifcationSkeleton from "@/components/NotificationSkeleton";
import Title from "@/components/Title";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const Notifications = () => {
  const userNotifications = useQuery(api.notifications.getUserNotifications);
  const acceptInvitation = useMutation(api.membereships.createMembership);
  const declineInvitation = useMutation(api.notifications.deleteNotification);
  return (
    <div className="">
      <Title Title="Notifications" subTitle="Manage your Notifications" />
      <div className="flex flex-col gap-1.5 ">
        {userNotifications && userNotifications.length > 0 ? (
          <>
            {userNotifications.map((notification) => (
              <Notification
                src={notification.user?.profileImageUrl || ""}
                workspaceName={notification.workspace}
                username={notification.user?.username || "Unknown User"}
                timestamp={notification.timestamp}
                onAccept={async () => await acceptInvitation({ workspaceId: notification.workspace })}
                onDecline={async () => await declineInvitation({ notificationId: notification._id })}
              />
            ))}
          </>
        ) : userNotifications && userNotifications.length === 0 ? (
          <>
            <h1 className="text-3xl text-center">No Notifications To see here</h1>
          </>
        ) : (
          <>
            <NotifcationSkeleton />
            <NotifcationSkeleton />

            <NotifcationSkeleton />

            <NotifcationSkeleton />
            <NotifcationSkeleton />
            <NotifcationSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
