import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { PersonalInfoForm } from "@/components/common/PersonalInfoForm";

export default async function AccountSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const role = (session.user as { role?: string }).role ?? "customer";
    if (role === "admin" || role === "moderator") {
      redirect("/dashboard");
    }
  }

  return <PersonalInfoForm />;
}
