interface SmallTagBlockProps {
  title: string;
  items: string[];
}
export default function SmallTagBlock({ title, items }: SmallTagBlockProps) {
  return (
    <div className="mb-5 last:mb-0">
      <h3 className="mb-2 text-[12px] text-[var(--text-muted)]">{title}</h3>
      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-[var(--background)] px-3 py-1 text-[12px] text-white"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-[var(--text-muted)]">N/A</p>
      )}
    </div>
  );
}