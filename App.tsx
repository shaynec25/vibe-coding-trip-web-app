import React, { useState } from 'react';
import { CalendarDays, Wallet, ClipboardCheck, Globe, Compass } from 'lucide-react';
import ScheduleView from './components/ScheduleView';
import ExpenseView from './components/ExpenseView';
import PrepView from './components/PrepView';
import CandidatesView from './components/CandidatesView';
import { APP_DATA, UI_LABELS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'expenses' | 'prep' | 'candidates'>('schedule');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  const currentData = APP_DATA[lang];
  const currentLabels = UI_LABELS[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#F2F2F2] shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-[#3A591C] text-white p-6 pt-10 sticky top-0 z-20 shadow-md">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-2xl font-bold">
            {lang === 'zh' ? '宜蘭・抹茶山之旅' : 'Matcha Mountain Trip'}
          </h1>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md text-xs transition-colors backdrop-blur-sm"
          >
            <Globe size={14} />
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
        <p className="text-[#A9BF5A] text-sm font-medium opacity-90">{currentData.tripInfo.dates}</p>
      </header>

      {/* Main Content Area */}
      <main className="bg-[#F2F2F2] min-h-[calc(100vh-180px)]">
        
        {activeTab === 'schedule' && (
          <ScheduleView data={currentData} labels={currentLabels} />
        )}

        {activeTab === 'expenses' && (
          <ExpenseView labels={currentLabels} />
        )}

        {activeTab === 'prep' && (
           <PrepView checklistData={currentData.checklist} labels={currentLabels} />
        )}

        {activeTab === 'candidates' && (
           <CandidatesView labels={currentLabels} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-[#A9BF5A]/30 flex justify-around p-2 pb-6 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl w-14 transition-all ${activeTab === 'schedule' ? 'text-[#3A591C] bg-[#F2F2F2] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <CalendarDays size={22} strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
          <span className="text-[10px]">{currentLabels.tabSchedule}</span>
        </button>

        <button 
          onClick={() => setActiveTab('candidates')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl w-14 transition-all ${activeTab === 'candidates' ? 'text-[#3A591C] bg-[#F2F2F2] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <Compass size={22} strokeWidth={activeTab === 'candidates' ? 2.5 : 2} />
          <span className="text-[10px]">{currentLabels.tabCandidates}</span>
        </button>

        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl w-14 transition-all ${activeTab === 'expenses' ? 'text-[#3A591C] bg-[#F2F2F2] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <Wallet size={22} strokeWidth={activeTab === 'expenses' ? 2.5 : 2} />
          <span className="text-[10px]">{currentLabels.tabExpenses}</span>
        </button>

        <button 
          onClick={() => setActiveTab('prep')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl w-14 transition-all ${activeTab === 'prep' ? 'text-[#3A591C] bg-[#F2F2F2] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <ClipboardCheck size={22} strokeWidth={activeTab === 'prep' ? 2.5 : 2} />
          <span className="text-[10px]">{currentLabels.tabPrep}</span>
        </button>
      </nav>
    </div>
  );
};

export default App;