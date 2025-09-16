export interface SearchResult {
  lineNumber: number;
  lineContent: string;
}

export interface AnalysisResult {
  count: number;
  occurrences: SearchResult[];
}