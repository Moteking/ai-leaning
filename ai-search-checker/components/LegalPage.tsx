import Link from "next/link";

/** 静的ページ(運営会社情報・各種規約)の共通レイアウト */
export default function LegalPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-brand-700 hover:underline">
          ← トップに戻る
        </Link>
      </nav>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
      {lead && <p className="mt-3 text-sm leading-relaxed text-ink-500">{lead}</p>}
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-700">{children}</div>
    </div>
  );
}

/** 見出し付きセクション */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="border-l-4 border-brand-600 pl-3 text-base font-bold text-ink-900">
        {heading}
      </h2>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

/** 定義リスト形式の項目(運営会社情報・特商法表記用) */
export function DefinitionTable({
  rows,
}: {
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="overflow-hidden rounded-xl border border-slate-200">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex flex-col gap-1 p-4 sm:flex-row sm:gap-4 ${
            i % 2 === 0 ? "bg-white" : "bg-slate-50"
          }`}
        >
          <dt className="shrink-0 font-bold text-ink-900 sm:w-48">{row.label}</dt>
          <dd className="text-ink-700">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
