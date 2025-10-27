import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { navigationItems } from "@/constants/constant";
import { Link } from "react-router";
import { useLocation } from "react-router";
import Logo from "@/components/Logo";
import { Button } from "./ui/button";
import { ChevronDown, Plus, Zap } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Doc } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@clerk/clerk-react";

const AppSidebar = ({
  workspace,
  setWorkspace,
}: {
  workspace: Doc<"workspaces"> | null;
  setWorkspace: React.Dispatch<React.SetStateAction<Doc<"workspaces"> | null>>;
}) => {
  const location = useLocation();
  const userIdentity = useAuth();
  const workspaces = useQuery(api.workspaces.getUserWorkspaces);
  const user = useQuery(api.users.getUserByClerkId, {
    clerkId: userIdentity.userId as string,
  });
  console.log("Sidebar render", { user, workspaces });

  return (
    <Sidebar>
      <SidebarHeader className="">
        {workspaces ? (
          <Logo />
        ) : (
          <div className="flex items-center gap-3">
            <Skeleton className="w-7 h-7 rounded-xs" />
            <Skeleton className="w-20 h-6 rounded-xs" />
          </div>
        )}
        <Collapsible
          className={
            workspaces && `bg-card px-2  border-border border rounded-md`
          }
        >
          <CollapsibleTrigger asChild>
            {workspaces ? (
              <div className={"flex items-center justify-between py-0.5"}>
                <p className={"text-[14px] font-bold text-card-foreground ca"}>
                  {!workspace
                    ? workspaces.find(
                        (workspace) => workspace?._id === user?.defaultWorkSpace
                      )?.name
                    : `${workspace?.name}'s Workspace`}
                </p>
                <ChevronDown
                  width={24}
                  height={24}
                  className="text-muted-foreground"
                />
              </div>
            ) : (
              <Skeleton className="w-full h-4 rounded-xl" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <div className=" flex flex-col gap-2 py-2">
              {workspaces?.map((workspace) => (
                <Button
                  key={workspace?._id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setWorkspace(workspace)}
                  className="w-full h-auto justify-start px-2 py-1 rounded-xs font-normal "
                >
                  {`${workspace?.name}'s Workspace`}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        {workspaces ? (
          <Button
            size={"sm"}
            className={"h-auto px-2 py-1 font-semibold gap-1.5"}
          >
            <p className="text-[12px]">Invite To Workspace</p>
            <Plus width={12} height={12} className="text-primary-foreground" />
          </Button>
        ) : (
          <Skeleton className="h-4 w-full rounded-xl" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className={"font-medium text-base text-sidebar-foreground mb-2"}
          >
            {workspaces ? "Menu" : <Skeleton className="w-20 h-3" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={""}>
              {workspaces
                ? navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={location.pathname === item.to}
                      >
                        {item.icon}
                        <Link to={item.to}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                : navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <Skeleton className="w-full h-4 rounded-xl" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator orientation={"horizontal"} className="max-w-1/2 mx-auto" />
        <SidebarGroup>
          <SidebarGroupLabel
            className={"font-medium text-base text-sidebar-foreground mb-2"}
          >
            {workspaces ? "Workspaces" : <Skeleton className="w-20 h-3" />}
          </SidebarGroupLabel>
          <ScrollArea
            className={`h-[150px] ${workspaces ? "fade-top-bottom" : ""}`}
          >
            <SidebarGroupContent>
              <SidebarMenu className={"px-1"}>
                <SidebarMenuItem className="flex flex-col gap-2 ">
                  {workspaces ? (
                    workspaces.map((workspace) => (
                      <div
                        className="flex items-center gap-3 "
                        key={workspace?._id}
                      >
                        <Button size="icon-sm">
                          {workspace?.name[0].toUpperCase()}
                        </Button>
                        <p className="font-medium text-[16px]">
                          {`${workspace?.name}'s Workspace`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <Skeleton className="h-4 w-full rounded-xl" />
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && user.activeSubscriptionId ? (
          <div
            className={
              "p-4 bg-card rounded-2xl relative overflow-hidden broder-border border"
            }
          >
            <Button variant={"outline"} size={"icon"} className="mb-[12px]">
              <Zap />
            </Button>
            <h5 className="text-[12px] text-primary font-semibold mb-1">
              {" "}
              Upgrade To Pro
            </h5>
            <p className="text-[12px] font-semibold text-muted-foreground w-full mb-4">
              Unlock AI Features, 1080p Video Uploading , more premium features
            </p>
            <Button className="w-full font-semibold text-[14px]">
              {" "}
              Upgrade Now
            </Button>
            <div className="size-[150px] rounded-full absolute blur-[100px] bg-[#d9d9d9] opacity-15 top-[-50px] left-[-50px]"></div>
          </div>
        ) : (
          <div
            className={
              "p-4 bg-card rounded-2xl relative overflow-hidden broder-border border"
            }
          >
            <Button variant={"outline"} size={"icon"} className="mb-[12px]">
              <Zap />
            </Button>
            <h5 className="text-[12px] text-primary font-semibold mb-1">
              {" "}
              Upgrade To Pro
            </h5>
            <p className="text-[12px] font-semibold text-muted-foreground w-full mb-4">
              Unlock AI Features, 1080p Video Uploading , more premium features
            </p>
            <Button className="w-full font-semibold text-[14px]">
              {" "}
              Upgrade Now
            </Button>
            <div className="size-[150px] rounded-full absolute blur-[100px] bg-[#d9d9d9] opacity-15 top-[-50px] left-[-50px]"></div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
