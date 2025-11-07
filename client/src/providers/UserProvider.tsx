import { createContext } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";


export const userContext = createContext<Doc<"users"> | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userIdentity = useAuth();
  const user = useQuery(api.users.getUserByClerkId, {
    clerkId: userIdentity.userId as string,
  });
  return (
    <userContext.Provider value={user}>
      { children }
    </userContext.Provider>
  )
};

