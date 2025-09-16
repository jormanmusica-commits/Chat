import { useState, useCallback } from 'react';
import { AnalysisResult, SearchResult } from '../types';

const parseDateFromLine = (line: string): Date | null => {
  // Matches common date formats like DD/MM/YY or DD/MM/YYYY at the start of a line.
  const match = line.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
  if (!match) return null;

  const dateStr = match[1];
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  let year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  // Handle two-digit years
  if (year < 100) {
    year += 2000;
  }
  
  const date = new Date(year, month, day);
  
  // Validate date parsing
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  
  return date;
};


export const useChatProcessor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processChat = useCallback(async (
    chatText: string,
    word1: string,
    word2: string,
    startDate?: string,
    endDate?: string,
  ): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);

    if (!chatText || !word1 || !word2) {
      setError("Por favor, proporciona el contenido del chat y ambas palabras para buscar.");
      setIsLoading(false);
      return null;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const lines = chatText.split('\n');
          let count = 0;
          const occurrences: SearchResult[] = [];

          const parseDateInput = (dateString: string) => {
            const [year, month, day] = dateString.split('-').map(Number);
            return new Date(year, month - 1, day);
          };

          const start = startDate ? parseDateInput(startDate) : null;
          if(start) start.setHours(0, 0, 0, 0);

          const end = endDate ? parseDateInput(endDate) : null;
          if (end) end.setHours(23, 59, 59, 999);

          const word1Regex = new RegExp(`\\b${word1.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
          const word2Regex = new RegExp(`${word2.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');

          lines.forEach((line, index) => {
            const lineDate = parseDateFromLine(line);
            
            let isDateMatch = true;
            if (start || end) {
              if (!lineDate) {
                isDateMatch = false;
              } else {
                const isAfterStart = start ? lineDate >= start : true;
                const isBeforeEnd = end ? lineDate <= end : true;
                isDateMatch = isAfterStart && isBeforeEnd;
              }
            }

            if (isDateMatch && word1Regex.test(line) && word2Regex.test(line)) {
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
      }, 50);
    });
  }, []);

  return { processChat, isLoading, error };
};