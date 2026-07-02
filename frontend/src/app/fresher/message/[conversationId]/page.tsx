import { Suspense } from "react";
import ConversationPageClient from "@/components/chat/ConversationPageClient";
import MessageLayoutFallback from "@/components/chat/MessageLayoutFallback";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function FresherConversationPage({ params }: PageProps) {
  const { conversationId } = await params;

  return (
    <Suspense fallback={<MessageLayoutFallback />}>
      <ConversationPageClient conversationId={conversationId} />
    </Suspense>
  );
}