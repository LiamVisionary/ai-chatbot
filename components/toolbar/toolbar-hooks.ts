import { useRef, useState, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

export function useToolbar(status: string) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  useOnClickOutside(toolbarRef, () => {
    setIsToolbarVisible(false);
    setSelectedTool(null);
  });

  // Close timer management
  const startCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSelectedTool(null);
      setIsToolbarVisible(false);
    }, 2000);
  };

  const cancelCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Hide toolbar while streaming
  useEffect(() => {
    if (status === 'streaming') {
      setIsToolbarVisible(false);
    }
  }, [status]);

  return {
    toolbarRef,
    selectedTool,
    setSelectedTool,
    isAnimating,
    setIsAnimating,
    isToolbarVisible,
    setIsToolbarVisible,
    startCloseTimer,
    cancelCloseTimer
  };
}
