import { Outlet } from "react-router";
import { ClerkLoaded, ClerkLoading, useAuth } from "@clerk/clerk-react";
import Loader from "@/components/Loader";
import AppSidebar from "@/components/AppSidebar";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";

const Home = () => {
  const userIdentity = useAuth();
  const workspaces = useQuery(api.workspaces.getUserWorkspaces);
  const user = useQuery(api.users.getUserByClerkId, {
    clerkId: userIdentity.userId as string,
  });
  const [workspace, setWorkspace] = useState<Doc<"workspaces"> | null>(null);

  useEffect(() => {
    if (workspaces && user && !workspace) {
      setWorkspace(
        workspaces.find(
          (workspace) => workspace?._id === user.defaultWorkSpace
        ) as Doc<"workspaces">
      );
    }
  }, [workspaces]);

  return (
    <>
      <ClerkLoading>
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="w-screen h-screen">
          <SidebarProvider>
            <AppSidebar
              workspace={workspace}
              setWorkspace={setWorkspace}
              workspaces={workspaces}
            />
            <main className="px-5 grow h-screen overflow-y-auto flex flex-col">
              {workspace ? (
                <Header />
              ) : (
                <div className="flex items-center justify-between py-4 w-full mb-12">
                  <div>
                    <Skeleton className="h-9 w-[400px] rounded-md" />
                  </div>

                  {/* Right side — buttons + user avatar */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-9 w-[90px] rounded-md" />
                      <Skeleton className="h-9 w-[90px] rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </div>
                </div>
              )}
              <Outlet context={workspace} />
            </main>
          </SidebarProvider>
        </div>
      </ClerkLoaded>
      <Toaster />
    </>
  );
};

export default Home;
