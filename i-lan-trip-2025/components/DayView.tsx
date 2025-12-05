import React from 'react';
import { TripData, UILabels } from '../constants';
import { ScheduleItem } from '../types';
import OptionGroup from './OptionGroup';
import HikingGuide from './HikingGuide';
import { MapPin } from 'lucide-react';

interface Props {
  schedule: ScheduleItem[];
  hikingData?: TripData['hikingGuide'];
  checklistData?: TripData['checklist'];
  prepIcons?: TripData['prepIcons'];
  labels: UILabels;
}

const DayView: React.FC<Props> = ({ schedule, hikingData, checklistData, prepIcons, labels }) => {
  return (
    <div className="space-y-8 p-4 pb-24">
      {schedule.map((item, index) => (
        <div key={index} className="relative pl-6 sm:pl-8">
          {/* Timeline Line */}
          {index !== schedule.length - 1 && (
            <div className="absolute left-[11px] sm:left-[15px] top-8 bottom-[-32px] w-0.5 bg-[#A9BF5A]"></div>
          )}
          
          {/* Icon Bubble */}
          <div className={`absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10 
            ${item.type === 'transport' ? 'bg-[#F2E291] text-[#3A591C]' : 
              item.type === 'food' ? 'bg-[#F2E291] text-[#3A591C]' :
              item.type === 'activity' ? 'bg-[#A9BF5A] text-white' :
              item.type === 'rest' ? 'bg-[#F2E291] text-[#3A591C]' :
              'bg-[#F2F2F2] text-[#678C30]'
            }`}>
            <item.icon size={14} className="sm:w-4 sm:h-4" />
          </div>

          <div className="pt-0.5">
            {/* Time & Title */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
              <span className="font-mono text-sm font-bold text-[#A9BF5A]">{item.time}</span>
              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
            </div>

            {/* Location Link */}
            {item.mapLink ? (
              <a 
                href={item.mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#3A591C] bg-[#A9BF5A]/20 px-2 py-1 rounded-md hover:bg-[#A9BF5A]/30 transition-colors mb-2"
              >
                <MapPin size={12} />
                {item.location}
              </a>
            ) : item.location && (
               <div className="text-sm text-slate-500 mb-2">{item.location}</div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-slate-600 text-sm leading-relaxed mb-3">{item.description}</p>
            )}

            {/* Special Hiking Guide Render */}
            {item.specialContent === 'hiking_guide' && hikingData && checklistData && prepIcons && (
                <HikingGuide 
                  guideData={hikingData} 
                  checklistData={checklistData} 
                  prepIcons={prepIcons}
                  labels={labels} 
                />
            )}

            {/* Options Render */}
            {item.options && (
              <OptionGroup options={item.options} labels={labels} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayView;