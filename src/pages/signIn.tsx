import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex mt-12 items-center justify-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
