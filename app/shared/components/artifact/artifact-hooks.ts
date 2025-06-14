import { useState, useCallback, useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { Document } from '@/lib/db/schema';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '@/lib/utils';
import { useUIContext } from '@/contexts/ui-context';
import { UIArtifact } from './artifact-types';

// ===== USE ARTIFACT VERSION HOOK =====
export function useArtifactVersion(documents: Document[] | undefined) {
  const [currentVersionIndex, setCurrentVersionIndex] = useState(-1);
  const { mode, setMode } = useUIContext();

  useEffect(() => {
    if (documents && documents.length > 0) {
      setCurrentVersionIndex(documents.length - 1);
    }
  }, [documents]);

  const handleVersionChange = (type: 'next' | 'prev' | 'toggle' | 'latest') => {
    if (!documents) return;

    if (type === 'latest') {
      setCurrentVersionIndex(documents.length - 1);
      setMode('edit');
    }

    if (type === 'toggle') {
      setMode((mode) => (mode === 'edit' ? 'diff' : 'edit'));
    }

    if (type === 'prev') {
      if (currentVersionIndex > 0) {
        setCurrentVersionIndex((index) => index - 1);
      }
    } else if (type === 'next') {
      if (currentVersionIndex < documents.length - 1) {
        setCurrentVersionIndex((index) => index + 1);
      }
    }
  };

  const isCurrentVersion =
    documents && documents.length > 0
      ? currentVersionIndex === documents.length - 1
      : true;

  return {
    currentVersionIndex,
    isCurrentVersion,
    handleVersionChange,
    mode
  };
}

// ===== USE DOCUMENT HOOK =====
export function useDocument(artifact: UIArtifact, setArtifact: React.Dispatch<React.SetStateAction<UIArtifact>>) {
  const {
    data: documents,
    isLoading: isDocumentsFetching,
    mutate: mutateDocuments,
  } = useSWR<Array<Document>>(
    artifact.documentId !== 'init' && artifact.status !== 'streaming'
      ? `/api/document?id=${artifact.documentId}`
      : null,
    fetcher,
  );

  const [document, setDocument] = useState<Document | null>(null);
  const [isContentDirty, setIsContentDirty] = useState(false);
  const { mutate } = useSWRConfig();
  
  useEffect(() => {
    if (documents && documents.length > 0) {
      const mostRecentDocument = documents.at(-1);

      if (mostRecentDocument) {
        setDocument(mostRecentDocument);
        setArtifact((currentArtifact) => ({
          ...currentArtifact,
          content: mostRecentDocument.content ?? '',
        }));
      }
    }
  }, [documents, setArtifact]);

  useEffect(() => {
    mutateDocuments();
  }, [artifact.status, mutateDocuments]);

  const handleContentChange = useCallback(
    (updatedContent: string) => {
      if (!artifact) return;

      mutate<Array<Document>>(
        `/api/document?id=${artifact.documentId}`,
        async (currentDocuments) => {
          if (!currentDocuments) return undefined;

          const currentDocument = currentDocuments.at(-1);

          if (!currentDocument || !currentDocument.content) {
            setIsContentDirty(false);
            return currentDocuments;
          }

          if (currentDocument.content !== updatedContent) {
            await fetch(`/api/document?id=${artifact.documentId}`, {
              method: 'POST',
              body: JSON.stringify({
                title: artifact.title,
                content: updatedContent,
                kind: artifact.kind,
              }),
            });

            setIsContentDirty(false);

            const newDocument = {
              ...currentDocument,
              content: updatedContent,
              createdAt: new Date(),
            };

            return [...currentDocuments, newDocument];
          }
          return currentDocuments;
        },
        { revalidate: false },
      );
    },
    [artifact, mutate],
  );

  const debouncedHandleContentChange = useDebounceCallback(
    handleContentChange,
    2000,
  );

  const saveContent = useCallback(
    (updatedContent: string, debounce: boolean) => {
      if (document && updatedContent !== document.content) {
        setIsContentDirty(true);

        if (debounce) {
          debouncedHandleContentChange(updatedContent);
        } else {
          handleContentChange(updatedContent);
        }
      }
    },
    [document, debouncedHandleContentChange, handleContentChange],
  );

  function getDocumentContentById(index: number) {
    if (!documents) return '';
    if (!documents[index]) return '';
    return documents[index].content ?? '';
  }

  return {
    documents,
    document,
    isDocumentsFetching,
    isContentDirty,
    saveContent,
    getDocumentContentById,
    mutateDocuments,
  };
}
