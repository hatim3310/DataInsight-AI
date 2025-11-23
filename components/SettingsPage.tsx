import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  allColumns: string[];
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, allColumns }) => {
  const [apiKey, setApiKey] = useState('');
  const [dateColumn, setDateColumn] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedDateColumn = localStorage.getItem('dateColumn');
    if (storedApiKey) setApiKey(storedApiKey);
    if (storedDateColumn) setDateColumn(storedDateColumn);
  }, []);

  const handleSave = () => {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('dateColumn', dateColumn);
    setNotification('Settings saved successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="h-20 px-8 flex items-center justify-between bg-[#f3f4f6] shrink-0 z-10">
           <div className="flex items-center">
             <button onClick={onBack} className="p-2 mr-4 bg-white rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm">
               <ArrowLeft className="w-5 h-5" />
             </button>
             <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
           </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
            <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">System Configuration</h2>
                    
                    <div className="mb-6">
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-600 mb-2">
                            Gemini API Key
                        </label>
                        <input
                            id="apiKey"
                            type="password"
                            placeholder="Enter your API key"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            Your API key is stored securely in your browser's local storage.
                        </p>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="dateColumn" className="block text-sm font-medium text-gray-600 mb-2">
                            Date Column for Time Series Analysis
                        </label>
                        <select
                            id="dateColumn"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={dateColumn}
                            onChange={(e) => setDateColumn(e.target.value)}
                        >
                            <option value="">Select a date column from your data</option>
                            {allColumns.map(col => (
                            <option key={col} value={col}>{col}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">
                            This column will be used for the 'Day', 'Week', 'Month', 'Year' filters on the dashboard.
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                         <button 
                            onClick={handleSave} 
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
                        >
                            Save Settings
                        </button>
                        {notification && (
                            <div className="text-sm text-green-500 font-medium">
                                {notification}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
