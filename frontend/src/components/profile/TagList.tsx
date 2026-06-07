import Empty from './Empty';

interface TagListProps {
  items: string[];
}
export default function TagList({ items }: TagListProps) {
  if (!items.length) return <Empty>No skills added</Empty>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[13px] font-medium text-white"
        >
          {item}
        </span>
      ))}
    </div>
  );
}