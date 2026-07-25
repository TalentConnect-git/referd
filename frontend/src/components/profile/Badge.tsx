interface BadgeProps {
  icon: React.ReactNode;
  text: string;
}
export default function Badge({ icon, text }: BadgeProps) {
  return (
    <span className="badge badge-primary inline-flex items-center gap-1.5 px-3 py-1 text-[12px]">
      <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span>
      {text}
    </span>
  );
}