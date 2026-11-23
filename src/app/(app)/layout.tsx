import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { env } from "@/lib/env";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  let supabase;
  try {
    const authData = await requireUser();
    user = authData.user;
    supabase = authData.supabase;
  } catch {
    redirect("/login");
  }

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const [profileRes, quotaRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfDay.toISOString())
      .neq("status", "failed"),
  ]);

  return (
    <AppShell
      displayName={profileRes.data?.display_name ?? null}
      email={user.email}
      quotaUsed={quotaRes.count ?? 0}
      quotaLimit={env.quizDailyLimit}
    >
      {children}
    </AppShell>
  );
}
