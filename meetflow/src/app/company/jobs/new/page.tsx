import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { AppShell } from "@/components/app/app-shell";
import { JobForm } from "../job-form";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "応募者", href: "/company/applicants" },
  { label: "性格診断", href: "/company/templates" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

export default async function NewJobPage() {
  const { userId } = await requireRole("COMPANY_ADMIN");
  await requireCompanyForAdmin(userId);

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header className="max-w-3xl">
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">NEW JOB</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">求人を作成</h1>
      </header>
      <section className="mt-8 max-w-3xl">
        <JobForm mode="create" />
      </section>
    </AppShell>
  );
}
