import { ClerkLoading, ClerkLoaded, SignIn } from '@clerk/clerk-react'
import Loader from '@/components/Loader'

const SignInPage = () => {
  return (
    <>
      <ClerkLoading>
        <div className='h-screen flex justify-center items-center'>
          <Loader />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="min-h-screen flex items-center justify-center">
          <SignIn/>
        </div>
      </ClerkLoaded>
    </>
  )
}

export default SignInPage