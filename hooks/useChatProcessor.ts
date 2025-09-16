import { useState, useCallback } from 'react';
import { AnalysisResult, SearchResult } from '../types';

export const useChatProcessor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processChat = useCallback(async (
    chatText: string,
    word1: string,
    word2: string
  ): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);

    if (!chatText || !word1 || !word2) {
      setError("Por favor, proporciona el contenido del chat y ambas palabras para buscar.");
      setIsLoading(false);
      return null;
    }

    return new Promise((resolve) => {
      // Use setTimeout to allow the UI to update with the loading state before the heavy processing begins
      setTimeout(() => {
        try {
          const lines = chatText.split('\n');
          let count = 0;
          const occurrences: SearchResult[] = [];

          const word1Regex = new RegExp(`\\b${word1.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
          // Removed word boundaries (\b) from word2Regex to allow partial matching
          const word2Regex = new RegExp(`${word2.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');

          lines.forEach((line, index) => {
            if (word1Regex.test(line) && word2Regex.test(line)) {
              count++;
              occurrences.push({
                lineNumber: index + 1,
                lineContent: line,
              });
            }
          });
          
          resolve({ count, occurrences });
        } catch (e) {
          setError(e instanceof Error ? e.message : "Ocurrió un error desconocido durante el procesamiento.");
          resolve(null);
        } finally {
          setIsLoading(false);
        }
      }, 50); // Small delay
    });
  }, []);

  return { processChat, isLoading, error };
};