import { notFound } from "next/navigation";
import { requireRole } from "@/lib/roles";
import { requireCompanyForAdmin } from "@/lib/company";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/app/app-shell";
import { JobForm } from "../job-form";

const NAV = [
  { label: "ホーム", href: "/company/dashboard" },
  { label: "求人", href: "/company/jobs" },
  { label: "面談", href: "/company/meetings" },
  { label: "面接官", href: "/company/managers" },
  { label: "料金プラン", href: "/company/billing" },
];

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireRole("COMPANY_ADMIN");
  const { companyId } = await requireCompanyForAdmin(userId);
  const { id } = await params;
  const job = await prisma.jobPosting.findFirst({ where: { id, companyId } });
  if (!job) notFound();

  return (
    <AppShell title="企業管理者" nav={NAV}>
      <header className="max-w-3xl">
        <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)]">EDIT JOB</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight">求人を編集</h1>
      </header>
      <section className="mt-8 max-w-3xl">
        <JobForm
          mode="edit"
          jobId={job.id}
          initial={{
            title: job.title,
            description: job.description,
            requiredSkills: job.requiredSkills,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            workStyle: job.workStyle,
            status: job.status,
          }}
        />
      </section>
    </AppShell>
  );
}
