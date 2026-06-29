export function ValueTags({ tags, limit }: { tags: string[]; limit?: number }) {
  const visible = typeof limit === "number" ? tags.slice(0, limit) : tags;

  if (!visible.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tag) => (
        <span key={tag} className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-slate-500">
          {tag}
        </span>
      ))}
    </div>
  );
}
