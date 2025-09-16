import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { useChatProcessor } from './hooks/useChatProcessor';
import { AnalysisResult } from './types';
import { ResultDisplay } from './components/ResultDisplay';
import { UserIcon, SearchIcon, UploadIcon, FileIcon, ResetIcon } from './components/Icons';

function App() {
  const [chatText, setChatText] = useState<string>('');
  const [contextWord, setContextWord] = useState<string>('');
  const [searchWord, setSearchWord] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const { processChat, isLoading, error: processingError } = useChatProcessor();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setChatText(text);
        setFileName(file.name);
        setResults(null); // Reset results on new file
      };
      reader.readAsText(file);
    }
    // Reset file input value to allow re-uploading the same file
    e.target.value = '';
  };

  const isFormValid = chatText.trim() !== '' && contextWord.trim() !== '' && searchWord.trim() !== '';

  const handleAnalyze = useCallback(async () => {
    if (!isFormValid) return;
    const analysisResults = await processChat(chatText, contextWord, searchWord, startDate, endDate);
    setResults(analysisResults);
  }, [isFormValid, chatText, contextWord, searchWord, startDate, endDate, processChat]);

  useEffect(() => {
    const isReadyForSearch = chatText.trim() !== '' && contextWord.trim() !== '';

    if (!isReadyForSearch) {
        return;
    }

    if (searchWord.trim() === '') {
        if(results) setResults(null);
        return;
    }

    const debounceTimer = setTimeout(() => {
        handleAnalyze();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchWord, contextWord, chatText, startDate, endDate, handleAnalyze]);


  const handleReset = () => {
    setChatText('');
    setContextWord('');
    setSearchWord('');
    setStartDate('');
    setEndDate('');
    setFileName(null);
    setResults(null);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            Buscador de Palabras en Chat
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Analiza registros de chat para encontrar líneas que contengan dos palabras específicas.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="flex flex-col gap-6">
            <Card>
              <h2 className="text-2xl font-bold mb-4 text-teal-400">1. Ingresar Chat</h2>
              
              <label htmlFor="file-upload" className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-500 rounded-lg p-6 text-center transition duration-300">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block font-semibold text-gray-200">
                  {fileName ? 'Elegir otro archivo' : 'Subir un archivo .txt'}
                </span>
                <span className="block text-sm text-gray-400">o pega el contenido abajo</span>
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt" onChange={handleFileChange} />
              
              {fileName && (
                <div className="mt-4 flex items-center justify-center bg-gray-900 border border-gray-700 text-teal-300 text-sm font-medium px-4 py-2 rounded-lg">
                  <FileIcon className="h-5 w-5 mr-2" />
                  <span>{fileName}</span>
                </div>
              )}

              <textarea
                value={chatText}
                onChange={(e) => {
                  setChatText(e.target.value);
                  setFileName(null);
                  setResults(null);
                }}
                placeholder="... o pega el registro de tu chat aquí. Soporta más de 400,000 palabras."
                className="w-full h-48 mt-4 bg-gray-900 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
            </Card>

            <Card>
              <h2 className="text-2xl font-bold mb-4 text-teal-400">2. Definir Búsqueda</h2>
              <div className="space-y-4">
                <Input
                  id="context-word"
                  label="Definir Palabra"
                  placeholder="ej., Cote"
                  value={contextWord}
                  onChange={(e) => {
                    setContextWord(e.target.value)
                    setResults(null);
                  }}
                  icon={<SearchIcon />}
                />
                <Input
                  id="search-word"
                  label="Palabra a Buscar"
                  placeholder="ej., arroz"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  icon={<SearchIcon />}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-1">Filtrar por Fecha (Opcional)</h3>
                <hr className="border-gray-700 mb-4"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        id="start-date"
                        label="Fecha de Inicio"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        max={endDate || ''}
                    />
                    <Input
                        id="end-date"
                        label="Fecha de Fin"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || ''}
                    />
                </div>
              </div>

            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleAnalyze} isLoading={isLoading} disabled={!isFormValid}>
                Analizar
              </Button>
              <Button onClick={handleReset} variant="secondary" disabled={isLoading} icon={<ResetIcon />}>
                Reiniciar
              </Button>
            </div>
             {processingError && <p className="text-red-400 text-center">{processingError}</p>}
          </div>

          {/* Results Section */}
          <div className="min-h-[600px] lg:h-auto">
             <ResultDisplay 
                results={results} 
                searchWord={searchWord} 
                contextWord={contextWord} 
                isLoading={isLoading} 
                startDate={startDate}
                endDate={endDate}
             />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;