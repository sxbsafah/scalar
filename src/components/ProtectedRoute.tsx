import { RedirectToSignIn, SignedIn, SignedOut, ClerkLoading, ClerkLoaded } from "@clerk/clerk-react";
import { Outlet } from "react-router";
import Loader from "./Loader";



const ProtectedRoute = () => {
  return (
    <>
      <SignedIn>
        <ClerkLoading>
          <div className="min-h-screen flex justify-center items-center">
            <Loader />
          </div>

        </ClerkLoading>
        <ClerkLoaded >
          <Outlet />
        </ClerkLoaded>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default ProtectedRoute