import React, { useState, useMemo, useEffect } from 'react';
import { AnalysisResult, DataRow } from '../types';
import ChartRenderer from './ChartRenderer';
import ChatInterface from './ChatInterface';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  MessageSquare, 
  Search, 
  Bell, 
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  CreditCard,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  Filter,
  Download
} from 'lucide-react';

interface DashboardProps {
  data: DataRow[];
  analysis: AnalysisResult;
  rawTextSample: string;
  fileName: string;
  onReset: () => void;
  onGoToSettings: () => void;
}

// Soft UI Card
const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  noPadding?: boolean;
}> = ({ children, className = "", noPadding = false }) => (
  <div 
    className={`bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}
  >
    {children}
  </div>
);

// KPI Card matching reference
const KpiCard: React.FC<{
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  icon?: React.ElementType;
}> = ({ title, value, trend = "4.2%", isPositive = true, icon: Icon }) => (
  <Card className="flex flex-col justify-between h-40 relative group hover:shadow-lg transition-shadow duration-300">
     <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        {Icon && <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" />}
     </div>
     <div>
        <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</div>
        <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {trend} from last month
        </div>
     </div>
     {/* Decorative blob */}
     <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gray-50 rounded-full -z-10 group-hover:bg-gray-100 transition-colors"></div>
  </Card>
);

const Dashboard: React.FC<DashboardProps> = ({ data, analysis, rawTextSample, fileName, onReset, onGoToSettings }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'chat'>('overview');
    const [dateColumn, setDateColumn] = useState<string>('');
    const [timeFilter, setTimeFilter] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month');
  
    useEffect(() => {
      const storedDateColumn = localStorage.getItem('dateColumn');
      if (storedDateColumn) setDateColumn(storedDateColumn);
    }, []);
  
    // Safe access
    const insights = Array.isArray(analysis?.keyInsights) ? analysis.keyInsights : [];
    const charts = Array.isArray(analysis?.recommendedCharts) ? analysis.recommendedCharts : [];
  

  const filteredData = useMemo(() => {
    if (!dateColumn || !data.length) return data;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return data.filter(row => {
      const cellValue = row[dateColumn];
      if (!cellValue) return false;

      const rowDate = new Date(cellValue);
      if (isNaN(rowDate.getTime())) return false; // Invalid date

      switch (timeFilter) {
        case 'Day':
          return rowDate >= today;
        case 'Week':
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          return rowDate >= lastWeek;
        case 'Month':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return rowDate >= lastMonth;
        case 'Year':
          const lastYear = new Date(today);
          lastYear.setFullYear(today.getFullYear() - 1);
          return rowDate >= lastYear;
        default:  
          return true;
      }
    });
  }, [data, dateColumn, timeFilter]);

  // Stats Calculation
  const stats = useMemo(() => {
    const totalRows = filteredData.length;
    const totalColumns = filteredData.length > 0 ? Object.keys(filteredData[0]).length : 0;
    const numericFields = filteredData.length > 0 
      ? Object.values(filteredData[0]).filter(v => !isNaN(Number(v)) && v !== '').length 
      : 0;
    return { totalRows, totalColumns, numericFields };
  }, [filteredData]);

  const SidebarItem = ({ icon: Icon, label, id, active }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-200 mb-1 font-medium ${
        active 
          ? 'bg-gray-900 text-white shadow-md' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 ${active ? 'text-white' : 'text-gray-400'}`} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
             <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">Skillset</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" active={activeTab === 'overview'} />
          <SidebarItem id="data" icon={FileSpreadsheet} label="Data Grid" active={activeTab === 'data'} />
          <SidebarItem id="chat" icon={MessageSquare} label="AI Analyst" active={activeTab === 'chat'} />
          
          <div className="pt-8 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</div>
          <button onClick={onGoToSettings} className="w-full flex items-center px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-colors font-medium">
             <Settings className="w-5 h-5 mr-3 text-gray-400" /> Settings
          </button>
          <button onClick={onReset} className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-medium">
             <LogOut className="w-5 h-5 mr-3" /> Reset Data
          </button>
        </nav>

        {/* Upgrade Card Simulation */}
       
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 px-8 flex items-center justify-between bg-[#f3f4f6] shrink-0 z-10">
           <div className="flex items-center text-2xl font-bold text-gray-800">
             {activeTab === 'overview' ? 'Dashboard' : activeTab === 'data' ? 'Data Grid' : 'AI Assistant'}
           </div>

           <div className="flex items-center gap-4">
              {/* Fake Search */}
              <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-full border border-gray-200 shadow-sm w-64">
                 <Search className="w-4 h-4 text-gray-400 mr-2" />
                 <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400 text-gray-700" />
              </div>

              {/* Action Icons */}
              <button className="p-2.5 bg-white rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
              </div>
           </div>
        </header>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
          
          {/* FILTERS ROW */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
             <div className="flex gap-2">
                {(['Day', 'Week', 'Month', 'Year'] as const).map(period => (
                  <button 
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-colors ${
                      timeFilter === period 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {period}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>{new Date().toLocaleDateString()}</span>
             </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* ROW 1: KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                   title="Total Records" 
                   value={stats.totalRows.toLocaleString()} 
                   trend="12%" 
                   isPositive={true} 
                   icon={Users}
                />
                <KpiCard 
                   title="Numeric Fields" 
                   value={stats.numericFields} 
                   trend="0.8%" 
                   isPositive={true} 
                   icon={CreditCard}
                />
                <KpiCard 
                   title="Data Columns" 
                   value={stats.totalColumns} 
                   trend="2.1%" 
                   isPositive={false} 
                   icon={TrendingUp}
                />
                <KpiCard 
                   title="Processing Time" 
                   value="0.4s" 
                   trend="Fast" 
                   isPositive={true} 
                   icon={CalendarIcon}
                />
              </div>

              {/* ROW 2: MAIN CHART + WIDGET */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Chart - Spans 2 cols */}
                <Card className="lg:col-span-2 min-h-[400px] flex flex-col">
                   <div className="flex justify-between items-center mb-6">
                      <div>
                         <h3 className="text-lg font-bold text-gray-900">{charts[0]?.title || 'Data Overview'}</h3>
                         <p className="text-sm text-gray-400 mt-0.5">Visual analysis of your primary metrics</p>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                         <ArrowUpRight className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="flex-1 w-full min-h-0">
                      {charts.length > 0 ? (
                        <ChartRenderer config={charts[0]} data={filteredData} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">No chart data available</div>
                      )}
                   </div>
                </Card>

                {/* Right Widget: AI Insights (Replacing 'Calendar' in reference) */}
                <Card className="lg:col-span-1 flex flex-col h-full">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Key Insights</h3>
                      <div className="flex gap-1">
                         <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                         <button className="p-1 hover:bg-gray-100 rounded text-gray-400"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                      {insights.length > 0 ? insights.map((insight, idx) => (
                        <div key={idx} className="flex gap-4 group cursor-default">
                           <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                 {idx + 1}
                              </div>
                              {idx !== insights.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 my-1"></div>}
                           </div>
                           <div className="pb-4">
                              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">{insight}</p>
                           </div>
                        </div>
                      )) : (
                        <div className="text-center text-gray-400 py-10">No insights generated</div>
                      )}
                   </div>

                   <div className="mt-auto pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                         <div>
                            <div className="text-sm font-bold text-gray-900">Summary</div>
                            <div className="text-xs text-emerald-500 font-medium flex items-center mt-0.5">
                               <TrendingUp className="w-3 h-3 mr-1" /> AI Generated
                            </div>
                         </div>
                         <div className="radial-progress text-xs font-bold text-gray-900 bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                            100%
                         </div>
                      </div>
                   </div>
                </Card>
              </div>

              {/* ROW 3: TABLE SECTION */}
              <Card noPadding className="flex flex-col">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Records</h3>
                    <div className="flex gap-2">
                       <button className="p-2 text-gray-400 hover:text-gray-900"><Filter className="w-4 h-4" /></button>
                       <button className="p-2 text-gray-400 hover:text-gray-900"><Download className="w-4 h-4" /></button>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                             {(filteredData.length > 0 ? Object.keys(filteredData[0]) : []).slice(0, 6).map((head) => (
                                <th key={head} className="px-6 py-4 font-semibold tracking-wider">{head}</th>
                             ))}
                             <th className="px-6 py-4 text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody>
                          {filteredData.slice(0, 5).map((row, idx) => (
                             <tr key={idx} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                {Object.values(row).slice(0, 6).map((val, cIdx) => (
                                   <td key={cIdx} className="px-6 py-4 text-sm text-gray-700 font-medium">
                                      {cIdx === 0 ? (
                                         <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                               {(val as string).toString().charAt(0)}
                                            </div>
                                            {val as string}
                                         </div>
                                      ) : (
                                         val as string
                                      )}
                                   </td>
                                ))}
                                <td className="px-6 py-4 text-right">
                                   <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white">
                                      Active
                                   </span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </Card>

            </div>
          )}

          {activeTab === 'data' && (
            <Card noPadding className="h-full flex flex-col">
               <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Full Data Grid</h2>
               </div>
               <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                     <thead className="sticky top-0 bg-white z-10 shadow-sm">
                        <tr>
                           {(filteredData.length > 0 ? Object.keys(filteredData[0]) : []).map(h => (
                              <th key={h} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                                 {h}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {filteredData.slice(0, 100).map((row, i) => (
                           <tr key={i} className="hover:bg-gray-50 transition-colors">
                              {Object.values(row).map((val, j) => (
                                 <td key={j} className="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
                                    {val as string}
                                 </td>
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
          )}

          {activeTab === 'chat' && (
             <div className="h-[calc(100vh-180px)]">
                <ChatInterface csvSample={rawTextSample} />
             </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;