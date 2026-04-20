import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
      <SignIn appearance={{ elements: { rootBox: "shadow-none" } }} />
    </div>
  );
}
