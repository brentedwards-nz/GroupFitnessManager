import SignInComponent from "../../../components/auth/SignInComponent";

export default async function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <SignInComponent />
    </div>
  );
}
