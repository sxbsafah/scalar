import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import Loader from "@/components/Loader";

const Library = () => {
  return (
    <>
      <ClerkLoaded>
        <div>
          <UserButton />
        </div>
      </ClerkLoaded>
      <ClerkLoading>
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      </ClerkLoading>
    </>
  );
};

export default Library;
