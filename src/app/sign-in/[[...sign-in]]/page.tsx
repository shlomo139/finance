import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4" dir="rtl">
      <SignIn forceRedirectUrl="/dashboard" />
    </div>
  );
}
