import { memo } from 'react';
import { useChatContext } from '../contexts/chat-context';
import { useMessages } from '@/hooks/use-messages';
import { motion } from 'framer-motion';
import { PreviewMessage, ThinkingMessage } from './message';
import equal from 'fast-deep-equal';

function PureArtifactMessages({
  chatId,
  status,
  votes,
  artifactStatus,
}: {
  chatId: string;
  status: string;
  votes: Array<any> | undefined;
  artifactStatus: 'streaming' | 'idle';
}) {
  const { messages, setMessages, reload, isReadonly } = useChatContext();
  
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative px-4"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === 'streaming' && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
          isArtifactView={true}
        />
      ))}

      {(status === 'submitted' || artifactStatus === 'streaming') &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const ArtifactMessages = memo(
  PureArtifactMessages,
  (prevProps, nextProps) => {
    if (prevProps.status !== nextProps.status) return false;
    if (prevProps.artifactStatus !== nextProps.artifactStatus) return false;
    if (!equal(prevProps.votes, nextProps.votes)) return false;
    return true;
  },
);