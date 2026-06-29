export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="border border-dashed border-line bg-white p-5 text-center shadow-sm">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
