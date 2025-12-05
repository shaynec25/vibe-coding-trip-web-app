import React, { useState, useEffect } from 'react';
import { UILabels } from '../constants';
import { ChecklistCategory } from '../types';
import { Check } from 'lucide-react';

interface Props {
  category: ChecklistCategory;
  showProgress?: boolean;
  labels?: UILabels;
}

const ChecklistGroup: React.FC<Props> = ({ category, showProgress = true, labels }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Note: LocalStorage key depends on category.id. 
    // category.id is consistent across languages ("hiking", "general", etc)
    const saved = localStorage.getItem(`checklist_${category.id}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [category.id]);

  const toggleItem = (itemId: string) => {
    const newChecked = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId]
    };
    setCheckedItems(newChecked);
    localStorage.setItem(`checklist_${category.id}`, JSON.stringify(newChecked));
  };

  const checkedCount = category.items.filter(item => checkedItems[item.id]).length;
  const totalCount = category.items.length;
  const progress = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
      <div className="p-4 bg-[#A9BF5A]/10 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">{category.title}</h3>
        {showProgress && (
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#F2F2F2] text-slate-600">
                {labels ? labels.checklistProgress(checkedCount, totalCount) : `${checkedCount}/${totalCount}`}
            </span>
        )}
      </div>
      
      {showProgress && (
          <div className="h-1 w-full bg-[#F2F2F2]">
              <div 
                className="h-full bg-[#678C30] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
          </div>
      )}

      <div className="divide-y divide-[#F2F2F2]">
        {category.items.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <div 
              key={item.id} 
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-[#F2F2F2] active:bg-[#A9BF5A]/20 ${isChecked ? 'bg-[#F2F2F2]/50' : ''}`}
            >
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                ${isChecked 
                  ? 'bg-[#678C30] border-[#678C30] text-white' 
                  : 'bg-white border-[#A9BF5A] text-transparent'
                }
              `}>
                <Check size={14} strokeWidth={3} />
              </div>
              
              <div className={`flex-1 ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                      {item.icon && <item.icon size={16} className="text-slate-400" />}
                      <span className={`text-base font-medium transition-all ${isChecked ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-700'}`}>
                      {item.label}
                      </span>
                  </div>
                  {item.description && item.description.length > 0 && (
                    <div className="ml-0 mt-1 pl-6">
                      {item.description.map((desc, idx) => (
                         <p key={idx} className="text-xs text-slate-400">{desc}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistGroup;