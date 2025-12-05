import React, { useState } from 'react';
import { UILabels } from '../constants';
import { OptionData } from '../types';
import { Star, ChevronDown, Sparkles, MapPin } from 'lucide-react';

interface Props {
  options: OptionData[];
  labels: UILabels;
}

const OptionGroup: React.FC<Props> = ({ options, labels }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 border group
          ${isOpen 
            ? 'bg-[#A9BF5A]/10 border-[#A9BF5A] text-[#3A591C]' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
      >
         <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full transition-colors ${isOpen ? 'bg-[#A9BF5A] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                <Sparkles size={14} />
            </div>
            <span className="font-bold text-sm">
                {isOpen ? '收起選項' : `${labels.optionLabel} (${options.length})`}
            </span>
         </div>
         <ChevronDown 
            size={18} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#3A591C]' : 'text-slate-400'}`} 
         />
      </button>

      {/* Options List with Animation */}
      <div 
        className={`grid grid-cols-1 gap-3 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'mt-3 opacity-100 max-h-[2000px]' : 'max-h-0 opacity-0'
        }`}
      >
        {options.map((opt) => (
          <div 
            key={opt.id} 
            className={`relative p-4 rounded-xl border-2 transition-all border-slate-100 bg-white`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                  <span className="text-xs font-bold text-slate-400 mb-1 block">{labels.optionLabel} {opt.id}</span>
                  <h4 className="font-bold text-slate-800 text-lg">{opt.title}</h4>
                  {opt.subtitle && (
                      <p className="text-sm font-bold text-[#678C30] mt-0.5">{opt.subtitle}</p>
                  )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {opt.tags?.map(tag => (
                <span key={tag} className="text-xs bg-[#F2F2F2] border border-[#A9BF5A] text-[#678C30] px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>

            <ul className="space-y-1">
              {opt.description?.map((desc, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="block w-1 h-1 bg-[#A9BF5A] rounded-full mt-2 shrink-0"></span>
                  {desc}
                </li>
              ))}
            </ul>
            
            {opt.mapLink && (
               <a 
                 href={opt.mapLink}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#3A591C] bg-[#A9BF5A]/10 border border-[#A9BF5A]/20 px-3 py-2 rounded-lg hover:bg-[#A9BF5A]/20 transition-colors"
                 onClick={(e) => e.stopPropagation()}
               >
                 <MapPin size={14} /> Google Maps
               </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionGroup;