import { DataRow } from '../types';

export const parseCSV = (csvText: string): { headers: string[]; data: DataRow[] } => {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], data: [] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const data: DataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma ignoring quotes
    
    if (currentLine.length === headers.length) {
      const row: DataRow = {};
      headers.forEach((header, index) => {
        let value: string | number = currentLine[index]?.trim().replace(/^"|"$/g, '') || '';
        // Try to convert to number
        if (!isNaN(Number(value)) && value !== '') {
          value = Number(value);
        }
        row[header] = value;
      });
      data.push(row);
    }
  }

  return { headers, data };
};

// Generate a small sample string of the data for the LLM (first 50 rows)
export const getDataSample = (headers: string[], data: DataRow[], limit: number = 50): string => {
  const headerLine = headers.join(',');
  const rows = data.slice(0, limit).map(row => {
    return headers.map(h => row[h]).join(',');
  });
  return [headerLine, ...rows].join('\n');
};