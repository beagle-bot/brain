export function ValueTags({ tags, limit }: { tags: string[]; limit?: number }) {
  const visible = typeof limit === "number" ? tags.slice(0, limit) : tags;

  if (!visible.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tag) => (
        <span key={tag} className="rounded-md border border-line bg-white px-2 py-1 text-xs font-medium text-zinc-600">
          {tag}
        </span>
      ))}
    </div>
  );
}
