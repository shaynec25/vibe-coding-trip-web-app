import React, { useState, useEffect } from 'react';
import { UILabels, CANDIDATES_CSV_URL } from '../constants';
import { CandidateItem } from '../types';
import { 
  MapPin, Utensils, Camera, FileSpreadsheet, Loader2, RefreshCw, Compass
} from 'lucide-react';

interface Props {
  labels: UILabels;
}

// Reuse parse logic
const parseCSV = (text: string): string[][] => {
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

const CandidatesView: React.FC<Props> = ({ labels }) => {
  const [items, setItems] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'food' | 'fun'>('all');

  const isConfigured = CANDIDATES_CSV_URL && CANDIDATES_CSV_URL.length > 0;

  const fetchCandidates = async () => {
    if (!isConfigured) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(CANDIDATES_CSV_URL);
      if (!response.ok) throw new Error('Network error');
      
      const text = await response.text();
      const rawRows: string[][] = parseCSV(text);
      
      if (!rawRows || rawRows.length < 2) {
          setItems([]);
          return;
      }

      // Headers: 名稱(Name), 類型(Type), 簡介(Description), 地圖連結(MapLink)
      // Normalize to handle loose CSV headers
      const headers = rawRows[0].map(h => h.trim().toLowerCase());
      
      const parsedItems: CandidateItem[] = rawRows.slice(1)
        .filter((row): row is string[] => !!row && row.length > 1)
        .map(row => {
            const getVal = (possibleKeys: string[]) => {
                const idx = headers.findIndex(h => possibleKeys.some(k => h.includes(k)));
                return idx !== -1 ? row[idx]?.trim() : '';
            };

            return {
                name: getVal(['名稱', 'name']),
                type: getVal(['類型', 'type']),
                description: getVal(['簡介', 'desc']),
                mapLink: getVal(['地圖', 'map']),
            };
        });

      setItems(parsedItems);

    } catch (e) {
      console.error(e);
      setError('讀取失敗，請確認 CSV 連結。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filteredItems = items.filter(item => {
      if (filter === 'all') return true;
      const type = item.type?.toLowerCase() || '';
      if (filter === 'food') return type.includes('食') || type.includes('food') || type.includes('餐廳') || type.includes('吃');
      if (filter === 'fun') return type.includes('景') || type.includes('玩') || type.includes('fun') || type.includes('spot');
      return true;
  });

  return (
    <div className="p-4 pb-24 animate-fade-in min-h-full">
         <div className="mb-6 bg-[#3A591C] text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Compass />
                {labels.candidatesTitle}
            </h2>
            <p className="text-[#F2F2F2] text-sm whitespace-pre-line">
                {labels.candidatesDesc}
            </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
            <button 
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#A9BF5A] text-white' : 'bg-white text-slate-500'}`}
            >
                {labels.candidatesFilterAll}
            </button>
            <button 
                onClick={() => setFilter('food')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${filter === 'food' ? 'bg-[#A9BF5A] text-white' : 'bg-white text-slate-500'}`}
            >
                <Utensils size={14} /> {labels.candidatesFilterFood}
            </button>
            <button 
                onClick={() => setFilter('fun')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${filter === 'fun' ? 'bg-[#A9BF5A] text-white' : 'bg-white text-slate-500'}`}
            >
                <Camera size={14} /> {labels.candidatesFilterFun}
            </button>
        </div>

        {/* Content */}
        {!isConfigured ? (
             <div className="text-center py-10 text-slate-400 px-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <FileSpreadsheet size={48} className="mx-auto text-[#A9BF5A] mb-4" />
                    <p className="mb-2 font-bold text-slate-600">尚未設定來源</p>
                    <p className="text-xs text-slate-400 mb-4">
                        請先設定 CANDIDATES_CSV_URL。<br/>
                        格式：名稱, 類型, 簡介, 地圖連結
                    </p>
                 </div>
             </div>
        ) : loading ? (
            <div className="flex justify-center items-center h-40 text-slate-400 gap-2">
                <Loader2 className="animate-spin" /> 載入中...
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100">
                <p className="text-slate-400 font-bold">{error ? error : labels.candidatesEmpty}</p>
                 {error && <button onClick={fetchCandidates} className="mt-4 text-[#A9BF5A] flex items-center gap-1 mx-auto"><RefreshCw size={14}/> 重試</button>}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {filteredItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                             <div>
                                <span className="text-xs font-bold text-[#A9BF5A] bg-[#A9BF5A]/10 px-2 py-0.5 rounded mb-1 inline-block">
                                    {item.type}
                                </span>
                                <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                             </div>
                             {item.mapLink && (
                                 <a 
                                    href={item.mapLink} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="bg-[#F2F2F2] p-2 rounded-full text-[#678C30] hover:bg-[#A9BF5A]/20 transition-colors"
                                 >
                                     <MapPin size={20} />
                                 </a>
                             )}
                        </div>
                        <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default CandidatesView;