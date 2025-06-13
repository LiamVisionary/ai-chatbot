'use client';

import { memo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StopIcon } from '@/components/icons';
import { artifactDefinitions } from '../artifact/artifact-types';
import { ToolbarProps, ToolProps } from './toolbar-types';
import { useToolbar } from './toolbar-hooks';
import { READING_LEVELS } from './toolbar-constants';

// ===== READING LEVEL SELECTOR COMPONENT =====
function ReadingLevelSelector({
  append,
  setSelectedTool,
  isAnimating
}) {
  const handleLevelClick = async (level: string) => {
    if (isAnimating) return;

    // Send message saying to adjust text to this type of reader
    append({
      role: 'user',
      content: `Please adjust your responses to be understandable by a ${level} reader.`,
    });

    // Close the reading level submenu
    setSelectedTool('');
  };

  return (
    <div className="flex flex-col gap-[6px] py-1 px-[5px]">
      {READING_LEVELS.map((level) => (
        <motion.button
          key={level.id}
          className="text-left p-2 rounded-md hover:bg-muted flex items-start"
          onClick={() => handleLevelClick(level.label)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          <div className="ml-2">
            <h4 className="text-sm font-medium leading-none">
              {level.label}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {level.description}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ===== TOOL COMPONENT =====
function Tool({
  tool,
  selectedTool,
  setSelectedTool,
  append,
  isAnimating,
  isToolbarVisible,
  isCompact
}: ToolProps) {
  const isSelected = selectedTool === tool.id;

  const handleClick = () => {
    if (isAnimating) return;

    if (tool.id === 'adjust-reading-level') {
      setSelectedTool(isSelected ? '' : tool.id);
      return;
    }

    if (tool.prompt) {
      append({
        role: 'user',
        content: tool.prompt,
      });
    }

    setSelectedTool('');
  };

  return (
    <motion.button
      data-testid={tool.id}
      className={`relative p-3 focus:bg-muted hover:bg-muted rounded-full ${
        isSelected ? 'bg-muted' : ''
      }`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      {tool.icon}
    </motion.button>
  );
}

// ===== TOOLS CONTAINER COMPONENT =====
function Tools({
  tools,
  selectedTool,
  setSelectedTool,
  append,
  isAnimating,
  isToolbarVisible,
  setIsToolbarVisible,
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      {tools.map((tool) => (
        <Tool
          key={tool.id}
          tool={tool}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          append={append}
          isAnimating={isAnimating}
          isToolbarVisible={isToolbarVisible}
        />
      ))}
    </div>
  );
}

// ===== MAIN TOOLBAR COMPONENT =====
function PureToolbar({
  isToolbarVisible: externalIsToolbarVisible,
  setIsToolbarVisible: externalSetIsToolbarVisible,
  append,
  status,
  stop,
  setMessages,
  artifactKind,
}: ToolbarProps) {
  // Use our custom hook to manage toolbar state
  const {
    toolbarRef,
    selectedTool,
    setSelectedTool,
    isAnimating,
    setIsAnimating,
    isToolbarVisible,
    setIsToolbarVisible,
    startCloseTimer,
    cancelCloseTimer
  } = useToolbar(status);

  // Make sure we're syncing with external toolbar visibility state
  useEffect(() => {
    setIsToolbarVisible(externalIsToolbarVisible);
  }, [externalIsToolbarVisible, setIsToolbarVisible]);

  useEffect(() => {
    externalSetIsToolbarVisible(isToolbarVisible);
  }, [isToolbarVisible, externalSetIsToolbarVisible]);

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifactKind,
  );

  if (!artifactDefinition) {
    throw new Error('Artifact definition not found!');
  }

  const toolsByArtifactKind = artifactDefinition.toolbar;

  if (toolsByArtifactKind.length === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        className="cursor-pointer absolute right-6 bottom-6 p-1.5 border rounded-full shadow-lg bg-background flex flex-col justify-end"
        initial={{ opacity: 0, y: -20, scale: 1 }}
        animate={
          isToolbarVisible
            ? selectedTool === 'adjust-reading-level'
              ? {
                  opacity: 1,
                  y: 0,
                  height: 6 * 43,
                  transition: { delay: 0 },
                  scale: 0.95,
                }
              : {
                  opacity: 1,
                  y: 0,
                  height: toolsByArtifactKind.length * 50,
                  transition: { delay: 0 },
                  scale: 1,
                }
            : { opacity: 1, y: 0, height: 54, transition: { delay: 0 } }
        }
        exit={{ opacity: 0, y: -20, transition: { duration: 0.1 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onHoverStart={() => {
          if (status === 'streaming') return;

          cancelCloseTimer();
          setIsToolbarVisible(true);
        }}
        onHoverEnd={() => {
          if (status === 'streaming') return;

          startCloseTimer();
        }}
        onAnimationStart={() => {
          setIsAnimating(true);
        }}
        onAnimationComplete={() => {
          setIsAnimating(false);
        }}
        ref={toolbarRef}
      >
        {status === 'streaming' ? (
          <motion.div
            key="stop-icon"
            initial={{ scale: 1 }}
            animate={{ scale: 1.4 }}
            exit={{ scale: 1 }}
            className="p-3"
            onClick={() => {
              stop();
              setMessages((messages) => messages);
            }}
          >
            <StopIcon />
          </motion.div>
        ) : selectedTool === 'adjust-reading-level' ? (
          <ReadingLevelSelector
            key="reading-level-selector"
            append={append}
            setSelectedTool={setSelectedTool}
            isAnimating={isAnimating}
          />
        ) : (
          <Tools
            key="tools"
            append={append}
            isAnimating={isAnimating}
            isToolbarVisible={isToolbarVisible}
            selectedTool={selectedTool}
            setIsToolbarVisible={setIsToolbarVisible}
            setSelectedTool={setSelectedTool}
            tools={toolsByArtifactKind}
          />
        )}
      </motion.div>
    </TooltipProvider>
  );
}

// Add memo optimization
export const Toolbar = memo(PureToolbar, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.isToolbarVisible !== nextProps.isToolbarVisible) return false;
  if (prevProps.artifactKind !== nextProps.artifactKind) return false;

  return true;
});
