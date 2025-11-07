import { useContext } from "react"
import { userContext } from "@/providers/UserProvider"


const useConvexUser = () => {
  return useContext(userContext);
}

export default useConvexUser