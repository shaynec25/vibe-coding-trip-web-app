import React from 'react';
import { UILabels } from '../constants';
import { Settings, Database, Cloud, Globe, X } from 'lucide-react';

interface Props {
  dataSource: 'static' | 'csv';
  setDataSource: (source: 'static' | 'csv') => void;
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  labels: UILabels;
  onClose: () => void;
}

const SettingsView: React.FC<Props> = ({ dataSource, setDataSource, lang, setLang, labels, onClose }) => {
  const isZh = lang === 'zh';

  return (
    <div className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-scale-in relative mx-4">
        {/* Modal Header */}
        <div className="bg-[#3A591C] text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <Settings size={20} />
                {labels.settingsTitle}
            </h2>
            <button onClick={onClose} className="bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition-colors">
                <X size={16} />
            </button>
        </div>

        <div className="p-5 space-y-6">
            
            {/* Language Section */}
            <div>
                 <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    <Globe size={16} className="text-[#678C30]" />
                    {labels.settingsLanguage}
                </h3>
                <div className="flex bg-[#F2F2F2] p-1 rounded-xl">
                    <button 
                        onClick={() => setLang('zh')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'zh' ? 'bg-white text-[#3A591C] shadow-sm' : 'text-slate-400'}`}
                    >
                        中文
                    </button>
                    <button 
                        onClick={() => setLang('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-white text-[#3A591C] shadow-sm' : 'text-slate-400'}`}
                    >
                        English
                    </button>
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* Data Source Section */}
            <div>
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    {labels.settingsDataSource}
                </h3>
                
                <div className="flex flex-col gap-2">
                    {/* Static Option */}
                    <button
                        onClick={() => setDataSource('static')}
                        className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            dataSource === 'static' 
                            ? 'border-[#A9BF5A] bg-[#A9BF5A]/5' 
                            : 'border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                        <div className={`p-2 rounded-full ${dataSource === 'static' ? 'bg-[#A9BF5A] text-white' : 'bg-slate-200 text-slate-500'}`}>
                            <Database size={16} />
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-bold text-sm ${dataSource === 'static' ? 'text-[#3A591C]' : 'text-slate-700'}`}>
                                {isZh ? "內建資料 (預設)" : "Internal Data (Default)"}
                            </h4>
                        </div>
                        {dataSource === 'static' && (
                            <div className="w-2.5 h-2.5 bg-[#678C30] rounded-full mr-1"></div>
                        )}
                    </button>

                    {/* Live CSV Option */}
                    <button
                        onClick={() => setDataSource('csv')}
                        className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            dataSource === 'csv' 
                            ? 'border-[#A9BF5A] bg-[#A9BF5A]/5' 
                            : 'border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                        <div className={`p-2 rounded-full ${dataSource === 'csv' ? 'bg-[#A9BF5A] text-white' : 'bg-slate-200 text-slate-500'}`}>
                            <Cloud size={16} />
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-bold text-sm ${dataSource === 'csv' ? 'text-[#3A591C]' : 'text-slate-700'}`}>
                                 {isZh ? "即時更新 (CSV)" : "Live Update (CSV)"}
                            </h4>
                        </div>
                        {dataSource === 'csv' && (
                            <div className="w-2.5 h-2.5 bg-[#678C30] rounded-full mr-1"></div>
                        )}
                    </button>
                </div>
            </div>
            
            <button onClick={onClose} className="w-full py-3 bg-[#F2F2F2] text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                {labels.settingsClose}
            </button>
        </div>
    </div>
  );
};

export default SettingsView;