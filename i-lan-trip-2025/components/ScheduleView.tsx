import React, { useState, useEffect } from 'react';
import { TripData, UILabels, SCHEDULE_CSV_URL } from '../constants';
import { ScheduleItem, OptionData } from '../types';
import DayView from './DayView';
import { 
  RefreshCw, Loader2, FileSpreadsheet,
  Car, Utensils, MapPin, BedDouble, Footprints, Waves, Mountain, Clock, 
  Coffee, Droplets, Shirt, CloudRain, BatteryCharging, Sandwich, 
  Briefcase, Ticket, CreditCard, Umbrella, Smartphone, Star, Camera, Info,
  Tent, TreePine, Beer, Music
} from 'lucide-react';

interface Props {
  data: TripData;
  labels: UILabels;
}

// Icon Mapping
const ICON_MAP: Record<string, any> = {
  Car,
  Utensils,
  MapPin,
  BedDouble,
  Footprints,
  Waves,
  Mountain,
  Clock,
  Coffee,
  Droplets,
  Shirt,
  CloudRain,
  BatteryCharging,
  Sandwich,
  Briefcase,
  Ticket,
  CreditCard,
  Umbrella,
  Smartphone,
  Star,
  Camera,
  Info,
  Tent,
  TreePine,
  Beer,
  Music
};

// Helper: Convert "HH:mm" string to minutes for correct sorting
const getTimeMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

// Robust CSV Parser
const parseCSV = (text: string): string[][] => {
  // Remove BOM if present
  const cleanText = text.replace(/^\ufeff/, '');
  
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuote = false;
  
  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];
    
    if (inQuote) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++;
      } else if (char === '"') {
        inQuote = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        currentRow.push(currentVal);
        currentVal = '';
      } else if (char === '\n' || char === '\r') {
        if (char === '\r' && nextChar === '\n') i++;
        currentRow.push(currentVal);
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }
  if (currentVal || currentRow.length > 0) {
      currentRow.push(currentVal);
      rows.push(currentRow);
  }
  return rows;
};

const ScheduleView: React.FC<Props> = ({ data, labels }) => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isConfigured = SCHEDULE_CSV_URL && SCHEDULE_CSV_URL.length > 0;

  const fetchSchedule = async () => {
    if (!isConfigured) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(SCHEDULE_CSV_URL);
      if (!response.ok) throw new Error('Network error');
      
      const text = await response.text();
      const rawRows = parseCSV(text);
      
      if (rawRows.length < 2) {
          console.warn("CSV is empty");
          setScheduleItems([]);
          return;
      }

      // 1. Normalize Headers
      const headers = rawRows[0].map(h => h.trim().toLowerCase());
      
      // 2. Map Rows
      const parsedItems: ScheduleItem[] = rawRows.slice(1)
        .filter(row => row.length > 1) // skip empty rows
        .map((row) => {
            // Helper to get value by header name safely
            const getVal = (key: string) => {
                const idx = headers.indexOf(key.toLowerCase());
                return idx !== -1 ? row[idx]?.trim() : '';
            };

            const iconName = getVal('icon');
            const IconComponent = ICON_MAP[iconName] || MapPin;

            const item: any = {
                id: getVal('id'),
                day: getVal('day'),
                time: getVal('time'),
                title: getVal('title'),
                location: getVal('location'),
                mapLink: getVal('mapLink'),
                type: getVal('type') || 'default',
                specialContent: getVal('specialcontent') || getVal('special_content') || undefined,
                icon: IconComponent, 
                description: getVal('description'),
            };

            // Parse Flattened Options (A, B, C)
            const options: OptionData[] = [];
            ['a', 'b', 'c'].forEach((suffix) => {
                const title = getVal(`opt_${suffix}_title`);
                if (title) {
                    // Parse description (split by |)
                    const descRaw = getVal(`opt_${suffix}_desc`);
                    const description = descRaw ? descRaw.split('|').map(s => s.trim()).filter(Boolean) : [];

                    // Parse tags (split by comma)
                    const tagsRaw = getVal(`opt_${suffix}_tags`);
                    const tags = tagsRaw ? tagsRaw.split('|').map(s => s.trim()).filter(Boolean) : [];

                    options.push({
                        id: suffix.toUpperCase(),
                        title: title,
                        description: description,
                        tags: tags,
                        mapLink: getVal(`opt_${suffix}_map`),
                    });
                }
            });

            if (options.length > 0) {
                item.options = options;
            }
            
            return item as ScheduleItem;
        });

      // 3. Robust Sorting: Day -> Time (Value)
      parsedItems.sort((a, b) => {
          const dayA = Number(a.day) || 0;
          const dayB = Number(b.day) || 0;
          if (dayA !== dayB) return dayA - dayB;
          return getTimeMinutes(a.time) - getTimeMinutes(b.time);
      });

      setScheduleItems(parsedItems);

    } catch (e) {
      console.error("Failed to fetch schedule CSV", e);
      setError('讀取失敗，請確認 CSV 格式與連結。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConfigured) {
        fetchSchedule();
    } else {
        // Load Static Data if no CSV configured
        const d1 = data.day1.map(i => ({ ...i, day: '1' }));
        const d2 = data.day2.map(i => ({ ...i, day: '2' }));
        setScheduleItems([...d1, ...d2]);
    }
  }, [isConfigured, data]);

  // Filter items for view
  const currentDayItems = scheduleItems.filter(item => Number(item.day) === activeDay);

  return (
    <div className="flex flex-col min-h-full">
      {/* Sub-tab Navigation */}
      <div className="sticky top-[60px] z-20 bg-[#F2F2F2]/90 backdrop-blur-md shadow-sm border-b border-[#A9BF5A]/30 p-2 flex gap-2 justify-center">
        <button
          onClick={() => setActiveDay(1)}
          className={`flex-1 max-w-[120px] py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeDay === 1
              ? 'bg-[#3A591C] text-white shadow-sm'
              : 'bg-transparent text-[#678C30] hover:bg-white'
          }`}
        >
          {labels.day1Label}
        </button>
        <button
          onClick={() => setActiveDay(2)}
          className={`flex-1 max-w-[120px] py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
            activeDay === 2
              ? 'bg-[#3A591C] text-white shadow-sm'
              : 'bg-transparent text-[#678C30] hover:bg-white'
          }`}
        >
          {labels.day2Label}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 animate-fade-in">
        {loading && scheduleItems.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-slate-400 gap-2">
                <Loader2 className="animate-spin" /> 載入中...
            </div>
        ) : scheduleItems.length === 0 ? (
             <div className="text-center py-10 text-slate-400 px-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <FileSpreadsheet size={48} className="mx-auto text-[#A9BF5A] mb-4" />
                    <p className="mb-2 font-bold text-slate-600">
                        {error ? error : "尚無行程資料"}
                    </p>
                    {!isConfigured && (
                        <p className="text-xs text-slate-400 mb-4">
                            內建行程資料似乎未載入。<br/>請檢查程式碼或設定 CSV 來源。
                        </p>
                    )}
                    {isConfigured && (
                        <button onClick={fetchSchedule} className="bg-[#A9BF5A] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold flex items-center gap-2 mx-auto">
                           <RefreshCw size={14} /> 重新讀取
                        </button>
                    )}
                 </div>
             </div>
        ) : (
          <div>
            <div className="bg-[#A9BF5A]/20 p-2 text-center text-[#3A591C] text-xs font-bold border-b border-[#A9BF5A]/30 flex justify-center items-center gap-2">
               {activeDay === 1 ? labels.day1Header : labels.day2Header}
               {isConfigured && <button onClick={fetchSchedule} className="text-[#3A591C]/50 hover:text-[#3A591C]" title="重新讀取"><RefreshCw size={12}/></button>}
             </div>
            <DayView 
              schedule={currentDayItems} 
              hikingData={data.hikingGuide}
              checklistData={data.checklist}
              prepIcons={data.prepIcons}
              labels={labels}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;