import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileLoaded: (text: string, name: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onFileLoaded(text, file.name);
    };
    reader.readAsText(file);
  };

  const loadDemoData = () => {
    // A more business-oriented demo dataset for the "Skillset" vibe
    const demoData = `Date,Month,Revenue,Expenses,ActiveUsers,CourseSales,NewStudents
2023-01-01,Jan,15000,8000,1200,450,120
2023-02-01,Feb,18500,9500,1450,520,150
2023-03-01,Mar,22000,10000,1800,600,200
2023-04-01,Apr,21500,11000,1950,580,180
2023-05-01,May,26000,12000,2300,750,250
2023-06-01,Jun,29000,13500,2800,820,310
2023-07-01,Jul,34000,14000,3400,950,380
2023-08-01,Aug,32500,13800,3600,900,350
2023-09-01,Sep,38000,15000,4200,1100,450
2023-10-01,Oct,42000,16500,4900,1250,510
2023-11-01,Nov,48000,18000,5600,1400,600
2023-12-01,Dec,55000,20000,6500,1600,720`;
    onFileLoaded(demoData, "skillset_growth_data.csv");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 ease-in-out bg-white shadow-sm
          ${dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-gray-300 hover:border-gray-400"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".csv"
        />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <Upload className="w-12 h-12 text-primary" />
          </div>
          <div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Upload your dataset
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                Drag and drop your CSV file here to generate your dashboard.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3" />
          {error}
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          onClick={loadDemoData}
          className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl transition-all shadow-sm hover:shadow-md font-semibold"
        >
          <FileText className="w-5 h-5 mr-2 text-gray-400" />
          Load Demo Data
        </button>
      </div>
    </div>
  );
};

export default FileUpload;