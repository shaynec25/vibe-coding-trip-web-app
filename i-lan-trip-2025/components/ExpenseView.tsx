import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UILabels, GOOGLE_SCRIPT_URL } from '../constants';
import { ExpenseItem } from '../types';
import { 
  Trash2, Plus, Wallet, X, Users, Check, 
  Utensils, ShoppingBag, Train, Home, CreditCard, 
  List, PieChart, Table2, UserPlus, RefreshCw, AlertCircle, Loader2
} from 'lucide-react';

interface Props {
  labels: UILabels;
}

const ExpenseView: React.FC<Props> = ({ labels }) => {
  // State
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  
  // UI State
  const [viewMode, setViewMode] = useState<'list' | 'split'>('list');
  const [showFormModal, setShowFormModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // New state to track initial load
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({ 
    item: '', 
    amount: '', 
    category: '食物', 
    payer: '', 
    splitWith: [] as string[] 
  });

  // Check if URL is configured
  const isConfigured = GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http');

  // Load Data
  const fetchData = async () => {
    if (!isConfigured) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Use POST for getData as well to ensure consistent CORS handling if GET redirects behave oddly
      // However, GET is standard. Let's stick to GET but handle errors robustly.
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getData`);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setExpenses(result.expenses);
        setMembers(result.members);
        
        // Initialize Default Payer if members exist and no payer selected
        if (result.members.length > 0 && !formData.payer) {
             setFormData(prev => ({ 
                 ...prev, 
                 payer: result.members[0], 
                 splitWith: result.members 
             }));
        }
      } else {
        setErrorMsg('讀取資料失敗: ' + result.message);
      }
    } catch (e) {
      setErrorMsg('無法連線到 Google Sheet (Failed to fetch)');
      console.error(e);
    } finally {
      setIsLoading(false);
      setHasLoaded(true); // Mark as loaded after first attempt
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
  }, []);

  // API Helper
  const callApi = async (action: string, payload: any) => {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          // Explicitly set text/plain to avoid CORS Preflight (OPTIONS request) which GAS doesn't support
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({ action, ...payload })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
  };

  // Member Management
  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;
    if (members.includes(newMemberName.trim())) {
        setNewMemberName('');
        return;
    }
    
    setIsLoading(true);
    const name = newMemberName.trim();
    
    try {
       // Optimistic Update
       setMembers(prev => [...prev, name]);
       setNewMemberName('');
       
       // Handle Form defaults if first member
       if (members.length === 0) {
           setFormData(prev => ({ 
             ...prev, 
             payer: name,
             splitWith: [name]
           }));
       } else {
           setFormData(prev => ({
             ...prev,
             splitWith: [...prev.splitWith, name]
           }));
       }

       await callApi('addMember', { name });
    } catch (e) {
       console.error(e);
       setErrorMsg("新增成員失敗，請重試");
       fetchData(); // Revert
    } finally {
       setIsLoading(false);
    }
  };

  const handleRemoveMember = async (name: string) => {
    if(!window.confirm(`確定要刪除成員 ${name} 嗎？`)) return;

    setIsLoading(true);
    try {
        // Optimistic
        setMembers(prev => prev.filter(m => m !== name));
        setFormData(prev => ({
            ...prev,
            splitWith: prev.splitWith.filter(m => m !== name)
        }));

        await callApi('deleteMember', { name });
    } catch (e) {
        console.error(e);
        setErrorMsg("刪除成員失敗");
        fetchData(); // Revert
    } finally {
        setIsLoading(false);
    }
  };

  // Split Logic Calculation
  const splitData = useMemo(() => {
    const netBalance: Record<string, number> = {};
    const paidTotal: Record<string, number> = {};
    
    // Initialize
    members.forEach(p => { netBalance[p] = 0; paidTotal[p] = 0; });

    expenses.forEach(item => {
      const amount = item.amount;
      const payer = item.payer.trim();
      
      // Credit the payer
      if (members.includes(payer)) {
        netBalance[payer] = (netBalance[payer] || 0) + amount;
        paidTotal[payer] = (paidTotal[payer] || 0) + amount;
      }

      // Debit the consumers
      const splitMembers = item.splitWith && item.splitWith.length > 0 ? item.splitWith : members;
      const validSplitMembers = splitMembers.filter(m => members.includes(m));
      
      if (validSplitMembers.length > 0) {
          const costPerPerson = amount / validSplitMembers.length;
          validSplitMembers.forEach(member => { 
            if (netBalance[member] !== undefined) netBalance[member] -= costPerPerson; 
          });
      }
    });

    const debts = members.map(p => ({ 
        name: p, 
        paid: paidTotal[p], 
        net: netBalance[p] 
    })).sort((a, b) => a.net - b.net);
    
    return { debts };
  }, [expenses, members]);

  // Form Handlers
  const toggleSplitMember = (member: string) => {
    setFormData(prev => {
      const current = prev.splitWith;
      return current.includes(member) 
        ? (current.length === 1 ? prev : { ...prev, splitWith: current.filter(m => m !== member) }) 
        : { ...prev, splitWith: [...current, member] };
    });
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      splitWith: prev.splitWith.length === members.length ? [] : [...members]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item || !formData.amount) return;
    if (members.length === 0) {
        alert("請先新增分帳成員");
        return;
    }
    
    setSubmitting(true);
    
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      title: formData.item,
      amount: parseFloat(formData.amount),
      payer: formData.payer,
      category: formData.category,
      splitWith: formData.splitWith,
      date: new Date().toISOString()
    };

    try {
        // Optimistic
        setExpenses(prev => [...prev, newItem]);
        setShowFormModal(false);
        setFormData(prev => ({ ...prev, item: '', amount: '', category: '食物' }));

        await callApi('addExpense', { data: JSON.stringify(newItem) });
    } catch (e) {
        console.error(e);
        alert("儲存失敗，請檢查網路");
        fetchData();
    } finally {
        setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('確定要刪除這筆項目嗎？')) return;
    
    setIsLoading(true);
    try {
        setExpenses(prev => prev.filter(e => e.id !== id));
        await callApi('deleteExpense', { id });
    } catch(e) {
        alert("刪除失敗");
        fetchData();
    } finally {
        setIsLoading(false);
    }
  };

  const totalTWD = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const getCategoryIcon = (cat?: string) => {
      switch(cat) {
          case '食物': return <Utensils size={16} />;
          case '購物': return <ShoppingBag size={16} />;
          case '交通': return <Train size={16} />;
          case '住宿': return <Home size={16} />;
          default: return <CreditCard size={16} />;
      }
  };

  if (!isConfigured) {
      return (
          <div className="p-8 text-center text-slate-500">
              <AlertCircle size={48} className="mx-auto mb-4 text-[#A9BF5A]" />
              <h3 className="text-lg font-bold mb-2">尚未設定 Google Sheet</h3>
              <p className="text-sm">請在 constants.tsx 中填入您的 Google Apps Script URL。</p>
          </div>
      );
  }

  // Initial Full Screen Loader
  if (isLoading && !hasLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in space-y-6">
        <div className="relative">
           <div className="absolute inset-0 bg-[#A9BF5A]/30 blur-xl rounded-full"></div>
           <div className="bg-white p-6 rounded-3xl shadow-lg relative z-10">
              <Loader2 size={40} className="text-[#678C30] animate-spin" />
           </div>
        </div>
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">正在讀取雲端帳本</h3>
            <p className="text-sm text-slate-400">連線至 Google Sheet 中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2 px-3 animate-fade-in relative">
      
      {/* Background Update Loading Overlay (Small) */}
      {isLoading && hasLoaded && !submitting && (
          <div className="fixed top-20 right-4 z-50">
             <div className="bg-black/70 text-white p-2 rounded-full shadow-lg animate-spin">
                 <RefreshCw size={16} />
             </div>
          </div>
      )}

      {/* Member Management - Compact */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[70%]">
             <div className="bg-[#A9BF5A]/20 p-1.5 rounded-full text-[#3A591C] shrink-0">
                 <Users size={12} />
             </div>
             {members.length === 0 ? (
                 <span className="text-[10px] text-slate-400">尚未新增成員</span>
             ) : (
                 <div className="flex -space-x-2">
                     {members.map((m) => (
                         <div key={m} className="w-6 h-6 rounded-full bg-[#F2F2F2] border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#678C30] shadow-sm relative group">
                             {m.charAt(0)}
                             <button 
                                onClick={() => handleRemoveMember(m)}
                                className="absolute -top-1 -right-1 bg-red-400 text-white rounded-full p-0.5 hidden group-hover:block"
                             >
                                 <X size={6} />
                             </button>
                         </div>
                     ))}
                 </div>
             )}
          </div>
          <div className="flex items-center gap-1">
              <input 
                  type="text" 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="姓名"
                  className="w-14 p-1 text-[10px] font-bold text-slate-800 bg-slate-50 rounded-lg outline-none focus:ring-1 focus:ring-[#A9BF5A]"
              />
              <button onClick={handleAddMember} className="bg-[#A9BF5A] text-white p-1 rounded-lg hover:bg-[#678C30]">
                  <UserPlus size={12} />
              </button>
          </div>
      </div>

      {/* Total Card - Compact */}
      <div className="bg-[#3A591C] rounded-2xl p-4 mb-3 relative overflow-hidden text-white shadow-lg">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#678C30] rounded-full -mt-6 -mr-6 opacity-50"></div>
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-lg font-light opacity-80">NT$</span>
                <h2 className="text-3xl font-black tracking-tight">{totalTWD.toLocaleString()}</h2>
            </div>
            <p className="text-[#A9BF5A] text-[9px] font-bold uppercase tracking-widest">Total Expenses</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">
               {expenses.length} 筆
             </span>
             <button onClick={fetchData} className="text-white/70 hover:text-white transition-colors">
                <RefreshCw size={12} />
             </button>
          </div>
        </div>
      </div>

      {errorMsg && (
          <div className="bg-red-50 text-red-500 text-xs p-2 rounded-xl mb-3 text-center">
              {errorMsg}
          </div>
      )}

      {/* View Toggle - Compact */}
      <div className="bg-white p-1 rounded-xl flex mb-3 border border-slate-100 shadow-sm">
        {['list', 'split'].map(mode => (
          <button 
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                viewMode === mode 
                ? 'bg-[#678C30] text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {mode === 'list' ? <><List size={12} /> 消費明細</> : <><PieChart size={12} /> 拆帳計算</>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <>
          <button 
            onClick={() => {
                if (members.length === 0) {
                    alert("請先在上方新增成員");
                    return;
                }
                setShowFormModal(true);
            }}
            className="w-full bg-[#678C30] text-white py-2.5 rounded-xl flex items-center justify-center gap-2 mb-3 shadow-sm active:scale-95 transition-transform text-xs font-bold"
          >
            <Plus size={16} /> 記一筆
          </button>
          
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-slate-100">
                <div className="inline-block p-2 bg-[#F2F2F2] rounded-full mb-1 text-[#A9BF5A]">
                    <Table2 size={16} />
                </div>
                <p className="text-slate-400 font-bold text-xs">暫無資料</p>
              </div>
            ) : (
              expenses.map((item) => (
                <div key={item.id} className="bg-white p-2.5 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F2F2F2] text-[#678C30] shrink-0">
                       {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{item.title}</p> 
                        {item.splitWith && item.splitWith.length > 0 && item.splitWith.length < members.length && (
                          <span className="text-[9px] bg-[#A9BF5A]/20 text-[#3A591C] px-1 py-0.5 rounded font-bold leading-none">
                            {item.splitWith.length}人
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded leading-none">
                            {item.payer}
                        </span>
                        <span className="text-[9px] text-slate-400">
                            {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <p className="font-bold text-slate-800 text-sm">${item.amount.toLocaleString()}</p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteExpense(item.id); }}
                        className="p-1 rounded text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="space-y-3">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-[#A9BF5A] text-[9px] font-bold uppercase tracking-widest mb-3">結算狀況 (台幣)</h4>
            
            {members.length === 0 ? (
                <p className="text-center text-slate-400 text-xs">請先新增成員以進行計算</p>
            ) : (
                <div className="space-y-3">
                {splitData.debts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${p.net >= 0 ? 'bg-[#F2E291] text-[#3A591C]' : 'bg-[#678C30]'}`}>
                            {p.name.charAt(0)}
                        </div>
                        <div>
                        <p className="text-xs font-bold text-slate-800">{p.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">已墊付 ${p.paid.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className={`text-xs font-black ${p.net >= 0 ? "text-[#678C30]" : "text-red-400"}`}>
                        {p.net >= 0 ? `收 ${Math.round(p.net).toLocaleString()}` : `付 ${Math.round(Math.abs(p.net)).toLocaleString()}`}
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
          <p className="text-center text-[9px] text-slate-400 font-bold opacity-60">* 正數代表應收回，負數代表應支付。</p>
        </div>
      )}

      {/* Add Expense Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowFormModal(false)}></div>
           <div className="bg-[#F2F2F2] w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] relative z-10 p-5 pb-8 animate-slide-up shadow-2xl h-[85vh] sm:h-auto overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-black text-lg text-[#3A591C]">新增支出</h3>
                <button onClick={() => setShowFormModal(false)} className="bg-white p-1.5 rounded-full text-slate-400 shadow-sm"><X size={16} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Amount Input */}
                <div className="bg-white p-3 rounded-xl border-2 border-transparent focus-within:border-[#A9BF5A] transition-colors shadow-sm">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">金額 (TWD)</label>
                  <div className="flex items-center gap-1">
                    <span className="text-xl text-slate-400 font-light">$</span>
                    <input 
                        type="number" 
                        value={formData.amount} 
                        onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                        className="w-full bg-transparent text-2xl font-black text-slate-800 outline-none placeholder-slate-200" 
                        placeholder="0" 
                        required 
                        autoFocus
                    />
                  </div>
                </div>

                {/* Item Name */}
                <div>
                  <label className="text-[9px] font-bold text-slate-500 ml-3 mb-1 block">項目名稱</label>
                  <input 
                    type="text" 
                    value={formData.item} 
                    onChange={(e) => setFormData({...formData, item: e.target.value})} 
                    className="w-full p-3 bg-white rounded-xl outline-none font-bold text-slate-800 placeholder-slate-300 shadow-sm border border-transparent focus:border-[#A9BF5A] text-sm" 
                    placeholder="例如：晚餐、飲料" 
                    required 
                  />
                </div>
                
                {/* Category & Payer */}
                <div className="grid grid-cols-2 gap-3">
                   <div>
                    <label className="text-[9px] font-bold text-slate-500 ml-3 mb-1 block">分類</label>
                    <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        className="w-full p-3 bg-white rounded-xl outline-none font-bold text-slate-800 appearance-none shadow-sm text-sm"
                    >
                      <option value="食物">🍔 食物</option>
                      <option value="住宿">🏠 住宿</option>
                      <option value="交通">🚕 交通</option>
                      <option value="購物">🛍️ 購物</option>
                      <option value="其他">📦 其他</option>
                    </select>
                   </div>
                   <div>
                    <label className="text-[9px] font-bold text-slate-500 ml-3 mb-1 block">付款人</label>
                    <select 
                        value={formData.payer} 
                        onChange={(e) => setFormData({...formData, payer: e.target.value})} 
                        className="w-full p-3 bg-white rounded-xl outline-none font-bold text-slate-800 appearance-none shadow-sm text-sm"
                    >
                      {members.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                   </div>
                </div>

                {/* Split Selection */}
                <div>
                  <div className="flex justify-between items-center mb-1 px-1">
                    <label className="text-[9px] font-bold text-slate-500 block">分攤對象</label>
                    <button 
                        type="button" 
                        onClick={handleSelectAll} 
                        className="text-[9px] font-bold text-[#678C30] bg-[#678C30]/10 px-2 py-0.5 rounded-full hover:bg-[#678C30]/20 transition-colors"
                    >
                        {formData.splitWith.length === members.length ? '取消全選' : '全選'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {members.map(m => {
                        const isSelected = formData.splitWith.includes(m);
                        return (
                            <button
                                key={m}
                                type="button"
                                onClick={() => toggleSplitMember(m)}
                                className={`
                                    relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-[#678C30] text-white shadow-md font-bold' 
                                        : 'bg-white text-slate-400 border border-slate-100'}
                                `}
                            >
                                <span className="text-[10px] truncate w-full px-1">{m}</span>
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 bg-[#F2E291] text-[#3A591C] rounded-full p-0.5 shadow-sm">
                                        <Check size={6} strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                  </div>
                </div>

                <button 
                    type="submit" 
                    disabled={submitting} 
                    className="w-full bg-[#3A591C] text-white py-3 rounded-xl text-sm font-bold mt-2 shadow-xl active:scale-95 transition-all"
                >
                    {submitting ? '儲存中...' : '確認記帳'}
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;