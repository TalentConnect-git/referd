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
          className="badge"
        >
          {item}
        </span>
      ))}
    </div>
  );
}