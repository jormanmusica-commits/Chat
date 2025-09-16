import React from 'react';
import { AnalysisResult } from '../types';
import { Card } from './Card';
import { SearchIcon } from './Icons';

interface ResultDisplayProps {
  results: AnalysisResult | null;
  searchWord: string;
  contextWord: string;
  isLoading: boolean;
}

const HighlightedText: React.FC<{ text: string; highlights: string[] }> = ({ text, highlights }) => {
    const validHighlights = highlights.filter(h => h.trim() !== '');
    if (validHighlights.length === 0) {
        return <span>{text}</span>;
    }
    const regex = new RegExp(`(${validHighlights.map(h => h.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    const lowerCaseHighlights = validHighlights.map(h => h.toLowerCase());

    return (
        <span>
            {parts.map((part, i) =>
                lowerCaseHighlights.includes(part.toLowerCase()) ? (
                <span key={i} className="bg-teal-500 bg-opacity-40 font-bold text-teal-200 px-1 rounded">
                    {part}
                </span>
                ) : (
                part
                )
            )}
        </span>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, searchWord, contextWord, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center h-full">
         <div className="text-center">
            <div role="status">
                <svg aria-hidden="true" className="inline w-12 h-12 text-gray-600 animate-spin fill-teal-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Cargando...</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mt-4">Analizando Chat...</h3>
            <p className="text-gray-400 mt-1">Por favor espera, esto puede tardar para archivos grandes.</p>
        </div>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="flex flex-col items-center justify-center text-center h-full">
        <SearchIcon className="h-16 w-16 text-gray-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-300">Los resultados aparecerán aquí</h3>
        <p className="text-gray-400 mt-2 max-w-sm">
          Sube o pega tu registro de chat, ingresa las dos palabras a buscar y luego haz clic en "Analizar" para ver los resultados.
        </p>
      </Card>
    );
  }

  if (results.count === 0) {
    return (
        <Card className="flex flex-col items-center justify-center text-center h-full">
            <SearchIcon className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-300">No se Encontraron Resultados</h3>
            <p className="text-gray-400 mt-2 max-w-sm">
                No se encontraron líneas que contengan ambas palabras: "<strong className="text-teal-400">{contextWord}</strong>" y "<strong className="text-teal-400">{searchWord}</strong>".
            </p>
      </Card>
    );
  }
  
  return (
    <Card className="flex flex-col h-full">
        <div className="p-4 bg-gray-900 rounded-lg mb-4 border border-gray-700">
            <p className="text-lg text-gray-300">
                Se {results.count !== 1 ? 'encontraron' : 'encontró'} <span className="text-3xl font-bold text-teal-400">{results.count}</span> {results.count !== 1 ? 'líneas' : 'línea'} con las palabras "<span className="font-semibold text-teal-400">{contextWord}</span>" y "<span className="font-semibold text-teal-400">{searchWord}</span>".
            </p>
        </div>

      <div className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-3">
          {results.occurrences.map((occurrence) => (
            <li key={occurrence.lineNumber} className="bg-gray-900 p-3 rounded-md border border-gray-700 font-mono text-sm text-gray-300">
              <span className="text-gray-500 mr-3 select-none">{occurrence.lineNumber}:</span>
              <HighlightedText text={occurrence.lineContent} highlights={[searchWord]} />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};