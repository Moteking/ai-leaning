import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <div className="text-6xl font-extrabold text-brand-600">404</div>
      <h1 className="mt-4 text-xl font-bold">ページが見つかりませんでした</h1>
      <p className="mt-2 text-sm text-ink-500">
        お探しのページは移動または削除された可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-brand-700"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
