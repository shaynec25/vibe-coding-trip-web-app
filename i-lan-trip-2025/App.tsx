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
      {/* Header - Super Compact */}
      <header className="bg-[#3A591C] text-white p-3 pt-4 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-0">
          <h1 className="text-lg font-bold">
            {lang === 'zh' ? '宜蘭・抹茶山之旅' : 'Matcha Mountain Trip'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-[#A9BF5A] text-[10px] font-medium opacity-90">{currentData.tripInfo.dates}</span>
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md text-[10px] transition-colors backdrop-blur-sm"
            >
              <Globe size={10} />
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="bg-[#F2F2F2] min-h-[calc(100vh-110px)]">
        
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

      {/* Bottom Navigation - Ultra Compact */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-[#A9BF5A]/30 flex justify-around py-1.5 pb-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-0 p-1 rounded-xl w-12 transition-all ${activeTab === 'schedule' ? 'text-[#3A591C] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <CalendarDays size={20} strokeWidth={activeTab === 'schedule' ? 2.5 : 2} />
          <span className="text-[10px] scale-90">{currentLabels.tabSchedule}</span>
        </button>

        <button 
          onClick={() => setActiveTab('candidates')}
          className={`flex flex-col items-center gap-0 p-1 rounded-xl w-12 transition-all ${activeTab === 'candidates' ? 'text-[#3A591C] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <Compass size={20} strokeWidth={activeTab === 'candidates' ? 2.5 : 2} />
          <span className="text-[10px] scale-90">{currentLabels.tabCandidates}</span>
        </button>

        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-0 p-1 rounded-xl w-12 transition-all ${activeTab === 'expenses' ? 'text-[#3A591C] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <Wallet size={20} strokeWidth={activeTab === 'expenses' ? 2.5 : 2} />
          <span className="text-[10px] scale-90">{currentLabels.tabExpenses}</span>
        </button>

        <button 
          onClick={() => setActiveTab('prep')}
          className={`flex flex-col items-center gap-0 p-1 rounded-xl w-12 transition-all ${activeTab === 'prep' ? 'text-[#3A591C] font-bold' : 'text-slate-400 hover:text-[#678C30]'}`}
        >
          <ClipboardCheck size={20} strokeWidth={activeTab === 'prep' ? 2.5 : 2} />
          <span className="text-[10px] scale-90">{currentLabels.tabPrep}</span>
        </button>
      </nav>
    </div>
  );
};

export default App;