import React from 'react';
import { TripData, UILabels } from '../constants';
import { Calendar, MapPin, Bed, ArrowRightCircle } from 'lucide-react';

interface Props {
  info: TripData['tripInfo'];
  labels: UILabels;
}

const InfoCard: React.FC<Props> = ({ info, labels }) => {
  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#3A591C] rounded-full"></span>
          {labels.tripOverview}
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-[#A9BF5A]/20 p-2.5 rounded-xl text-[#3A591C]">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{labels.dateLabel}</p>
              <p className="text-lg font-bold text-slate-800">{info.dates}</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <a href={info.pickup.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
            <div className="bg-[#A9BF5A]/20 p-2.5 rounded-xl text-[#3A591C] group-hover:bg-[#F2E291]/50 transition-colors">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{labels.pickupLabel}</p>
              <p className="text-lg font-bold text-slate-800">{info.pickup.location}</p>
              <p className="text-sm text-[#678C30] font-medium mt-1 flex items-center gap-1">
                {info.pickup.time} <ArrowRightCircle size={14} />
              </p>
            </div>
          </a>

          <div className="h-px bg-slate-100 w-full"></div>

          <a href={info.stay.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
            <div className="bg-[#A9BF5A]/20 p-2.5 rounded-xl text-[#3A591C] group-hover:bg-[#F2E291]/50 transition-colors">
              <Bed size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{labels.stayLabel}</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">{info.stay.location}</p>
              <p className="text-slate-600 mt-1 text-sm">{info.stay.sub}</p>
            </div>
          </a>
        </div>
      </div>

      <div className="bg-[#3A591C] rounded-2xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <span className="text-[#F2E291]">⏰</span> {labels.returnReminderTitle}
        </h3>
        <p className="text-[#F2F2F2]">
           {labels.returnReminderText(info.return.time)}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;