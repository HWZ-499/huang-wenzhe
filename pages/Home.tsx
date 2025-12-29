import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DailyCheckIn from '../components/DailyCheckIn';
import StatsChart from '../components/StatsChart';
import { ArrowRight, Quote, Check, Zap, Settings, X, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const THEMES = [
  { id: 'default', name: '暖白', value: '#FDFBF7' },
  { id: 'beige', name: '羊皮', value: '#F7F3E8' },
  { id: 'ios', name: '极简', value: '#F2F2F7' },
  { id: 'rose', name: '晨曦', value: '#FFF0F3' },
  { id: 'sky', name: '晴空', value: '#F0F7FF' },
  { id: 'mint', name: '薄荷', value: '#F0FDF4' },
];

const Home: React.FC = () => {
  const { data, checkInGoal, updateTheme, updateUserName } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Get today's quote (pseudo-random based on date)
  const quotes = [
    "不积跬步，无以至千里。",
    "做伟大的工作唯一的途径就是热爱你所做的事。",
    "相信你自己，你就已经成功了一半。",
    "你的潜力是无限的。",
    "专注于通过产出来忙碌，而不是单纯的忙碌。"
  ];
  const quoteIndex = new Date().getDate() % quotes.length;
  const todayQuote = quotes[quoteIndex];
  
  const todayStr = new Date().toISOString().split('T')[0];
  const currentTheme = data.settings?.themeColor || '#FDFBF7';

  // Filter ALL goals (short and long term) that are NOT completed/archived
  const dailyGoals = data.goals.filter(g => !g.completed);
  
  const isGoalDoneToday = (goalId: string) => {
    const goal = data.goals.find(g => g.id === goalId);
    return goal?.completedDates?.includes(todayStr) || false;
  };

  const unfinishedDailyCount = dailyGoals.filter(g => !isGoalDoneToday(g.id)).length;

  return (
    <div className="animate-fade-in space-y-8 relative">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-sm font-bold text-warm-500 uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>
          <h2 className="text-4xl font-extrabold text-warm-900">你好，{data.userProfile.name}</h2>
        </div>
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full bg-white/50 hover:bg-white text-warm-500 transition-colors shadow-sm"
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-warm-900/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-slide-up relative">
             <button 
               onClick={() => setIsSettingsOpen(false)}
               className="absolute top-4 right-4 p-2 text-warm-400 hover:text-warm-800 bg-warm-50 rounded-full"
             >
               <X size={20} />
             </button>
             
             <h3 className="text-xl font-bold text-warm-800 mb-6">应用设置</h3>
             
             <div className="mb-6">
                <label className="block text-xs font-bold text-warm-400 uppercase tracking-wider mb-2">
                  你的称呼
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.userProfile.name}
                    onChange={(e) => updateUserName(e.target.value)}
                    className="w-full bg-warm-50 rounded-xl px-4 py-3 text-warm-800 font-bold border-none focus:ring-2 focus:ring-orange-200 outline-none placeholder-warm-300 transition-all"
                    placeholder="给自己起个名字..."
                  />
                  <Edit2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-300 pointer-events-none" />
                </div>
             </div>
             
             <div className="mb-6">
               <label className="block text-xs font-bold text-warm-400 uppercase tracking-wider mb-4">
                 主题颜色
               </label>
               <div className="grid grid-cols-3 gap-3">
                 {THEMES.map((theme) => (
                   <button
                     key={theme.id}
                     onClick={() => updateTheme(theme.value)}
                     className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                       currentTheme === theme.value 
                         ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' 
                         : 'border-warm-100 hover:bg-warm-50'
                     }`}
                   >
                     <div 
                       className="w-6 h-6 rounded-full border border-black/5 shadow-sm"
                       style={{ backgroundColor: theme.value }}
                     />
                     <span className="text-sm font-medium text-warm-700">{theme.name}</span>
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="pt-4 border-t border-warm-100 text-center">
                <p className="text-xs text-warm-400">Bloom v1.0 • Designed for Growth</p>
             </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column (Main Focus) */}
        <div className="lg:col-span-8 space-y-8">
          
          <DailyCheckIn />

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-warm-800">本周专注</h3>
              <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-1 rounded-full">过去7天</span>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-warm-100">
               <StatsChart />
            </div>
          </section>
        </div>

        {/* Right Column (Side Widgets) */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-warm-100 shadow-sm flex flex-col h-auto min-h-[300px]">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-warm-800 flex items-center gap-2">
                   <Zap size={20} className="text-orange-500" />
                   今日必做
               </h3>
               <span className="text-xs font-bold text-warm-400 bg-warm-50 px-2 py-1 rounded-full">
                   {unfinishedDailyCount > 0 ? `剩 ${unfinishedDailyCount} 项` : '全部完成'}
               </span>
             </div>
             
             <div className="flex-1 overflow-y-auto max-h-[400px] no-scrollbar -mx-2 px-2">
               {dailyGoals.length > 0 ? (
                 <ul className="space-y-2">
                   {dailyGoals.map(goal => {
                     const doneToday = isGoalDoneToday(goal.id);
                     const daysDone = goal.completedDates?.length || 0;
                     const totalDays = goal.targetDays; 
                     const percentage = totalDays 
                        ? Math.min(100, Math.round((daysDone / totalDays) * 100))
                        : 0;

                     return (
                       <li key={goal.id}>
                         <button
                           onClick={() => checkInGoal(goal.id)}
                           className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${
                              doneToday 
                                  ? 'bg-orange-50 border-orange-100 shadow-inner' 
                                  : 'bg-warm-50 border-transparent hover:bg-warm-100 hover:scale-[1.01] shadow-sm'
                           }`}
                         >
                           <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                               doneToday 
                               ? 'bg-orange-500 border-orange-500 scale-110' 
                               : 'border-warm-300 bg-transparent'
                           }`}>
                              {doneToday && <Check size={14} className="text-white animate-bounce-small" strokeWidth={4} />}
                           </div>
                           
                           <div className="flex flex-col flex-1 overflow-hidden">
                               <div className="flex justify-between items-center">
                                  <span className={`text-sm font-medium truncate transition-all duration-300 ${doneToday ? 'text-warm-600' : 'text-warm-800'}`}>
                                      {goal.title}
                                  </span>
                                  {totalDays ? (
                                      <span className="text-[10px] font-bold text-warm-400 ml-2">
                                          {daysDone}/{totalDays}
                                      </span>
                                  ) : (
                                      <span className="text-[10px] font-bold text-warm-400 ml-2">
                                          {daysDone}天
                                      </span>
                                  )}
                               </div>
                               
                               {totalDays && (
                                   <div className="w-full h-1 bg-warm-200 rounded-full mt-1.5 overflow-hidden">
                                       <div 
                                          className={`h-full rounded-full transition-all duration-500 ease-out ${doneToday ? 'bg-orange-400' : 'bg-warm-400'}`} 
                                          style={{ width: `${percentage}%` }}
                                       />
                                   </div>
                               )}
                           </div>
                         </button>
                     </li>
                   );
                   })}
                 </ul>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center text-warm-400 space-y-2 py-4">
                     <p className="text-sm">暂无今日必做。</p>
                     <Link to="/goals" className="text-xs font-bold text-orange-500 hover:underline">
                         去添加目标
                     </Link>
                 </div>
               )}
             </div>
             
             {dailyGoals.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-warm-100 flex justify-center">
                      <Link to="/goals" className="text-xs font-bold text-warm-400 hover:text-orange-500 flex items-center gap-1 transition-colors">
                          管理目标 <ArrowRight size={12} />
                      </Link>
                  </div>
             )}
          </section>

          <section className="bg-warm-200/50 p-6 rounded-3xl relative overflow-hidden group min-h-[160px] flex flex-col justify-center">
             <Quote className="absolute top-4 right-4 text-warm-300 w-12 h-12 -rotate-12 group-hover:scale-110 transition-transform" />
             <h3 className="text-lg font-bold text-warm-800 mb-2">每日灵感</h3>
             <p className="text-warm-700 italic font-medium leading-relaxed z-10 relative">"{todayQuote}"</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;