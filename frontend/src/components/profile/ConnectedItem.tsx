interface ConnectedItemProps {
  icon: React.ReactNode;
  value?: string;
}
export default function ConnectedItem({ icon, value }: ConnectedItemProps) {
  if (!value) return null;
  const isLink = value.startsWith('http') || value.includes('linkedin.com');
  return (
    <div className="flex items-center gap-3 text-[14px] font-semibold text-primary">
      <span className="text-primary [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      {isLink ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="break-all hover:text-primary transition-colors"
        >
          {value.replace(/^https?:\/\//, '')}
        </a>
      ) : (
        <span className="break-all">{value}</span>
      )}
    </div>
  );
}