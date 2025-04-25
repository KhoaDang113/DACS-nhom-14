import { SignUp } from "@clerk/clerk-react";

const signUpPage = () => {
  return (
    <div className="flex mt-12 items-center justify-center">
      <SignUp />
    </div>
  );
};

export default signUpPage;
