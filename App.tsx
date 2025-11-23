import React, { useState } from 'react';
import { AppView, DataRow, AnalysisResult } from './types';
import { parseCSV, getDataSample } from './utils/csvHelper';
import { analyzeDataset } from './services/geminiService';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage';
import { Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.UPLOAD);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [rawSample, setRawSample] = useState<string>('');

  const handleFileLoaded = async (csvText: string, name: string) => {
    setIsLoading(true);
    try {
      // 1. Parse CSV locally
      const { headers, data } = parseCSV(csvText);
      setCsvData(data);
      setFileName(name);
      
      // 2. Prepare sample for AI
      const sample = getDataSample(headers, data, 50);
      setRawSample(sample);

      // 3. Call Gemini API
      const analysisResult = await analyzeDataset(sample);
      setAnalysis(analysisResult);
      
      // 4. Switch view
      setView(AppView.DASHBOARD);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to analyze the file. Please check your API key or try another file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCsvData([]);
    setAnalysis(null);
    setFileName('');
    setView(AppView.UPLOAD);
  };

  const goToSettings = () => setView(AppView.SETTINGS);
  const goToDashboard = () => setView(AppView.DASHBOARD);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="relative">
           <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl animate-pulse"></div>
           <div className="bg-white p-4 rounded-2xl shadow-xl relative z-10">
              <Loader2 className="w-12 h-12 animate-spin text-gray-900" />
           </div>
        </div>
        <h2 className="text-2xl font-bold mt-8 text-gray-900 tracking-tight">Analyzing Data...</h2>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          Gemini is reading your CSV, identifying trends, and generating visualization suggestions.
        </p>
      </div>
    );
  }

  if (view === AppView.UPLOAD) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans text-gray-900">
        <header className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
               <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">DataInsight</span>
          </div>
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm">Portfolio Project</a>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
           {/* Background decorative blobs */}
           <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
           <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>

           <div className="text-center mb-12 max-w-3xl z-10">
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Powered by Gemini 2.5</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
               Your data, <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">beautifully visualized.</span>
             </h1>
             <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
               Upload your CSV and let AI generate a professional dashboard with insights, KPIs, and charts in seconds.
             </p>
           </div>

           <FileUpload onFileLoaded={handleFileLoaded} />
        </main>
      </div>
    );
  }

  if (view === AppView.DASHBOARD && analysis) {
    return (
      <Dashboard 
        data={csvData} 
        analysis={analysis} 
        rawTextSample={rawSample} 
        fileName={fileName}
        onReset={handleReset}
        onGoToSettings={goToSettings}
      />
    );
  }

  if (view === AppView.SETTINGS) {
    return (
      <SettingsPage 
        onBack={goToDashboard}
        allColumns={csvData.length > 0 ? Object.keys(csvData[0]) : []}
      />
    )
  }

  return null;
};

export default App;