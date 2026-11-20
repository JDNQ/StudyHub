import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("quizzes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfDay.toISOString())
    .neq("status", "failed");

  return (
    <AppShell
      displayName={profile?.display_name ?? null}
      email={user.email}
      quotaUsed={count ?? 0}
      quotaLimit={env.quizDailyLimit}
    >
      {children}
    </AppShell>
  );
}
