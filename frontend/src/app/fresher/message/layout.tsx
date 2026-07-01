import { Suspense } from "react";
import MessageLayoutShell from "@/components/chat/MessageLayoutShell";
import MessageLayoutFallback from "@/components/chat/MessageLayoutFallback";

export default function FresherMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<MessageLayoutFallback />}>
      <MessageLayoutShell>{children}</MessageLayoutShell>
    </Suspense>
  );
}