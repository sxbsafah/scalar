import { Outlet } from 'react-router';
import { ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import Loader from '@/components/Loader';
import AppSidebar  from "@/components/AppSidebar"
import { useState } from 'react';
import { Doc } from "../../convex/_generated/dataModel";
import { SidebarProvider } from '@/components/ui/sidebar';
const Home = () => {
  const [workspace, setWorkspace] = useState<Doc<"workspaces"> | null>(null);
  return (
    <>
      <ClerkLoading>
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SidebarProvider>
          <AppSidebar workspace={workspace} setWorkspace={setWorkspace} />
        </SidebarProvider>
        <Outlet context={{
          workspace,
          setWorkspace
        }} />
      </ClerkLoaded>
    </>
  )
}

export default Home