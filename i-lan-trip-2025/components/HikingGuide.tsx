import React, { useState } from 'react';
import { TripData, UILabels } from '../constants';
import { Clock, ChevronDown } from 'lucide-react';

interface Props {
  guideData: TripData['hikingGuide'];
  checklistData: TripData['checklist'];
  prepIcons: TripData['prepIcons'];
  labels: UILabels;
}

const HikingGuide: React.FC<Props> = ({ guideData, labels }) => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  return (
    <div className="mt-4 mb-8">
      {/* Stats Card */}
      <div className="bg-[#3A591C] rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#678C30] rounded-full opacity-30"></div>
        <h3 className="text-xl font-bold mb-4 relative z-10">{labels.hikingStatsTitle}</h3>
        <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-[#678C30]/50 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-[#A9BF5A] text-xs mb-1">{labels.statUp}</p>
                <p className="font-bold text-xl">{guideData.stats.upTime}</p>
            </div>
            <div className="bg-[#678C30]/50 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-[#A9BF5A] text-xs mb-1">{labels.statDown}</p>
                <p className="font-bold text-xl">{guideData.stats.downTime}</p>
            </div>
            <div className="col-span-2 bg-white/10 p-3 rounded-xl flex items-center justify-between">
                <span className="text-[#F2F2F2] text-sm">{labels.statTotal}</span>
                <span className="font-bold text-lg">{guideData.stats.totalTime}</span>
            </div>
        </div>
      </div>

      {/* Collapsible Timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <button 
            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            className="w-full p-4 bg-[#A9BF5A]/10 border-b border-slate-100 flex justify-between items-center transition-colors hover:bg-[#A9BF5A]/20"
        >
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Clock size={18} className="text-[#3A591C]" />
                {labels.hikingScheduleTitle}
            </h3>
            <ChevronDown 
                size={20} 
                className={`text-[#3A591C] transition-transform duration-300 ${isScheduleOpen ? 'rotate-180' : ''}`} 
            />
        </button>
        
        {isScheduleOpen && (
            <div className="p-4 animate-fade-in">
                 <div className="relative border-l-2 border-[#A9BF5A] ml-3 space-y-6 pb-2">
                    {guideData.milestones.map((m, idx) => (
                        <div key={idx} className="relative pl-6">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#678C30] ring-4 ring-white"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                                <span className="font-mono font-bold text-[#678C30] text-sm">{m.time}</span>
                                <span className="font-bold text-slate-800">{m.event}</span>
                            </div>
                            {m.note && <p className="text-xs text-slate-500 mt-1 bg-[#F2F2F2] inline-block px-2 py-1 rounded">{m.note}</p>}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default HikingGuide;