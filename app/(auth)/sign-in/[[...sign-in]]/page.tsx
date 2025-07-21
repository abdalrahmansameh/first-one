import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return <main className='container mx-auto w-full flex justify-center items-center h-screen '>
    <SignIn />
  </main>
}
export default SignInPage