import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
      <SignUp appearance={{ elements: { rootBox: "shadow-none" } }} />
    </div>
  );
}
