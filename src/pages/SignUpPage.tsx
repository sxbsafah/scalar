import Loader from '@/components/Loader'
import { SignUp, ClerkLoading, ClerkLoaded } from '@clerk/clerk-react'


const SignUpPage = () => {
  return (
    <>
      <ClerkLoading>
        <div className="min-h-screen flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex items-center justify-center">
          <SignUp/>
        </div>
      </ClerkLoaded>
    </>
  )
}

export default SignUpPage