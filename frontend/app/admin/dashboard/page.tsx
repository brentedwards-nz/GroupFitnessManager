// app/admin/dashboard/page.tsx
import { createSupabaseServerClient } from "../../../lib/superbase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <div>Welcome, {user.email}</div>;
}
