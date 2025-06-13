'use client';

import { memo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';
import { useArtifactContext } from '@/contexts/artifact-context';
import { useChatContext } from '@/contexts/chat-context';
import { useSidebar } from '@/components/ui/sidebar';
import { ArtifactMessages } from '@/components/artifact-messages';
import { MultimodalInput } from '@/components/multimodal-input';
import { useArtifactVersion, useDocument } from './artifact-hooks';
import { artifactDefinitions, ArtifactKind, UIArtifact } from './artifact-types';

// ===== ARTIFACT HEADER COMPONENT =====

function ArtifactHeader({
  artifact,
  isContentDirty,
  document,
  currentVersionIndex,
  handleVersionChange,
  isCurrentVersion,
  mode,
}) {
  return (
    <div className="flex flex-row justify-between items-center w-full border-b dark:border-zinc-700 border-zinc-200 pl-4 pr-2 h-[60px] shrink-0">
      <div className="font-semibold">{artifact.title}</div>
      <div className="flex flex-row items-center gap-4">
        {document && (
          <DocumentActions
            isContentDirty={isContentDirty}
            artifact={artifact}
            document={document}
            currentVersionIndex={currentVersionIndex}
            handleVersionChange={handleVersionChange}
            isCurrentVersion={isCurrentVersion}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
}

// ===== ARTIFACT CONTENT COMPONENT =====

function ArtifactContent({
  artifact,
  isCurrentVersion,
  getDocumentContentById,
  currentVersionIndex,
  documents,
  handleVersionChange,
  isDocumentsFetching,
  saveContent,
  metadata,
  setMetadata,
  mode
}) {
  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind,
  );

  if (!artifactDefinition) {
    throw new Error('Artifact definition not found!');
  }
  
  const ArtifactEditor = artifactDefinition.editor;
  
  return (
    <div 
      key={artifact.documentId} 
      className="w-full flex-1 flex"
    >
      <ArtifactEditor
        key={artifact.documentId}
        artifact={artifact}
        isCurrentVersion={isCurrentVersion}
        getDocumentContentById={getDocumentContentById}
        currentVersionIndex={currentVersionIndex}
        documents={documents}
        handleVersionChange={handleVersionChange}
        isDocumentsFetching={isDocumentsFetching}
        saveContent={saveContent}
        metadata={metadata}
        setMetadata={setMetadata}
        mode={mode}
        className="w-full"
      />
    </div>
  );
}

// ===== MAIN ARTIFACT COMPONENT =====

function PureArtifact() {
  const { chatId, votes, status, append, setMessages } = useChatContext();
  const { artifact, setArtifact, metadata, setMetadata } = useArtifactContext();
  
  const { 
    documents, 
    document, 
    isDocumentsFetching, 
    isContentDirty, 
    saveContent, 
    getDocumentContentById 
  } = useDocument(artifact, setArtifact);
  
  const { 
    currentVersionIndex, 
    isCurrentVersion, 
    handleVersionChange, 
    mode 
  } = useArtifactVersion(documents);

  const { open: isSidebarOpen } = useSidebar();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const artifactDefinition = artifactDefinitions.find(
    (definition) => definition.kind === artifact.kind,
  );

  if (!artifactDefinition) {
    throw new Error('Artifact definition not found!');
  }

  useEffect(() => {
    if (artifact.documentId !== 'init') {
      if (artifactDefinition.initialize) {
        artifactDefinition.initialize({
          documentId: artifact.documentId,
          setMetadata,
        });
      }
    }
  }, [artifact.documentId, artifactDefinition, setMetadata]);

  if (!artifact.isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {artifact.isVisible && (
        <motion.div
          data-testid="artifact"
          className="flex flex-row h-dvh w-dvw fixed top-0 left-0 z-50 bg-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.4 } }}
        >
          {/* Background Panel */}
          {!isMobile && (
            <motion.div
              className="fixed bg-background h-dvh"
              initial={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
              animate={{ width: windowWidth, right: 0 }}
              exit={{
                width: isSidebarOpen ? windowWidth - 256 : windowWidth,
                right: 0,
              }}
            />
          )}

          {/* Messages Panel */}
          {!isMobile && (
            <motion.div
              className="relative w-[400px] bg-muted dark:bg-background h-dvh shrink-0"
              initial={{ opacity: 0, x: 10, scale: 1 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 30,
                },
              }}
              exit={{
                opacity: 0,
                x: 0,
                scale: 1,
                transition: { duration: 0 },
              }}
            >
              <AnimatePresence>
                {!isCurrentVersion && (
                  <motion.div
                    className="left-0 absolute h-dvh w-[400px] top-0 bg-zinc-900/50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              <div className="flex flex-col h-full justify-between items-center">
                <ArtifactMessages
                  chatId={chatId}
                  status={status}
                  votes={votes}
                  artifactStatus={artifact.status}
                />

                <form className="flex flex-row gap-2 relative items-end w-full px-4 pb-4">
                  <MultimodalInput
                    className="bg-background dark:bg-muted"
                  />
                </form>
              </div>
            </motion.div>
          )}

          {/* Content Panel */}
          <motion.div
            className="fixed dark:bg-muted bg-background h-dvh flex flex-col overflow-y-scroll md:border-l dark:border-zinc-700 border-zinc-200"
            initial={
              isMobile
                ? {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
                : {
                    opacity: 1,
                    x: artifact.boundingBox.left,
                    y: artifact.boundingBox.top,
                    height: artifact.boundingBox.height,
                    width: artifact.boundingBox.width,
                    borderRadius: 50,
                  }
            }
            animate={
              isMobile
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth ? windowWidth : 'calc(100dvw)',
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: 'spring',
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
                : {
                    opacity: 1,
                    x: 400,
                    y: 0,
                    height: windowHeight,
                    width: windowWidth
                      ? windowWidth - 400
                      : 'calc(100dvw-400px)',
                    borderRadius: 0,
                    transition: {
                      delay: 0,
                      type: 'spring',
                      stiffness: 200,
                      damping: 30,
                      duration: 5000,
                    },
                  }
            }
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: 'spring',
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            {/* Header */}
            <ArtifactHeader
              artifact={artifact}
              isContentDirty={isContentDirty}
              document={document}
              currentVersionIndex={currentVersionIndex}
              handleVersionChange={handleVersionChange}
              isCurrentVersion={isCurrentVersion}
              mode={mode}
            />

            {/* Content */}
            <ArtifactContent
              artifact={artifact}
              isCurrentVersion={isCurrentVersion}
              getDocumentContentById={getDocumentContentById}
              currentVersionIndex={currentVersionIndex}
              documents={documents}
              handleVersionChange={handleVersionChange}
              isDocumentsFetching={isDocumentsFetching}
              saveContent={saveContent}
              metadata={metadata}
              setMetadata={setMetadata}
              mode={mode}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Artifact = memo(PureArtifact);
