import { useOutletContext } from "react-router";
import { Doc } from "../../convex/_generated/dataModel";

export const useWorkspace = () => {
  return useOutletContext<Doc<"workspaces"> | null>();
};
