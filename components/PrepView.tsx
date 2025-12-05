import React from 'react';
import { TripData, UILabels } from '../constants';
import ChecklistGroup from './ChecklistGroup';
import { ClipboardCheck } from 'lucide-react';

interface Props {
  checklistData: TripData['checklist'];
  labels: UILabels;
}

const PrepView: React.FC<Props> = ({ checklistData, labels }) => {
  return (
    <div className="p-4 pb-24 animate-fade-in">
        <div className="mb-6 bg-[#3A591C] text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <ClipboardCheck />
                {labels.prepListTitle}
            </h2>
            <p className="text-[#F2F2F2] text-sm whitespace-pre-line">
                {labels.prepListDesc}
            </p>
        </div>

        <div className="space-y-6">
            {checklistData.map(category => (
                <ChecklistGroup key={category.id} category={category} labels={labels} />
            ))}
        </div>
    </div>
  );
};

export default PrepView;