import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, CheckCircle, Circle, Trash2, Zap, Flag, Archive, Trophy } from 'lucide-react';

const Goals: React.FC = () => {
  const { data, addGoal, toggleGoal, checkInGoal, deleteGoal } = useApp();
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [targetDays, setTargetDays] = useState('');
  const [activeTab, setActiveTab] = useState<'short-term' | 'long-term'>('short-term');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) {
      inputRef.current?.focus();
      return;
    }
    
    // Parse days, but handle empty string as undefined
    let days = targetDays && !isNaN(parseInt(targetDays)) ? parseInt(targetDays) : undefined;

    // Default to 7 days only for short-term goals if not specified
    if (activeTab === 'short-term' && !days) {
      days = 7;
    }

    addGoal({
      title: newGoalTitle,
      type: activeTab,
      targetDays: days
    });
    setNewGoalTitle('');
    setTargetDays('');
  };

  const filteredGoals = data.goals.filter(g => g.type === activeTab);
  
  // Logic for progress banner
  const calculateOverallProgress = () => {
      if (filteredGoals.length === 0) return 0;
      
      if (activeTab === 'short-term') {
          const totalProgress = filteredGoals.reduce((acc, g) => {
             const daysDone = g.completedDates?.length || 0;
             const total = g.targetDays || 1;
             const p = Math.min(1, daysDone / total);
             return acc + p;
          }, 0);
          return (totalProgress / filteredGoals.length) * 100;
      } else {
          const completedCount = filteredGoals.filter(g => g.completed).length;
          return (completedCount / filteredGoals.length) * 100;
      }
  };
  
  const progress = calculateOverallProgress();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in min-h-screen">
       <header className="mb-8 text-center lg:text-left lg:ml-[16.6%] xl:ml-[16.6%]">
           <h1 className="text-3xl font-bold text-warm-900">我的计划</h1>
           <p className="text-warm-500 mt-1">记录通往成功的旅程</p>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Center Column: Spans 8 columns, starts at 3 (for 12 col grid) to be perfectly centered */}
         <div className="lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3">
            {/* Tabs */}
            <div className="flex bg-warm-200/50 p-1 rounded-2xl mb-6 relative max-w-md mx-auto lg:mx-0">
              <div 
                  className="absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
                  style={{ left: activeTab === 'short-term' ? '4px' : 'calc(50% - 4px)', width: 'calc(50% - 0px)' }}
              ></div>
              <button 
                onClick={() => setActiveTab('short-term')}
                className={`flex-1 py-3 text-sm font-bold text-center z-10 transition-colors ${activeTab === 'short-term' ? 'text-warm-900' : 'text-warm-500'}`}
              >
                短期
              </button>
              <button 
                onClick={() => setActiveTab('long-term')}
                className={`flex-1 py-3 text-sm font-bold text-center z-10 transition-colors ${activeTab === 'long-term' ? 'text-warm-900' : 'text-warm-500'}`}
              >
                长期
              </button>
            </div>

            {/* Progress Banner */}
            <div className="bg-warm-900 rounded-3xl p-6 md:p-8 text-warm-50 mb-8 relative overflow-hidden shadow-lg shadow-warm-900/10">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  {activeTab === 'short-term' ? <Zap size={140} /> : <Flag size={140} />}
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-bold text-warm-300 uppercase tracking-widest">{activeTab === 'short-term' ? '短期' : '长期'}目标进度</span>
                    <span className="text-4xl font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="mt-4 text-base text-warm-200 max-w-[80%]">
                    {progress === 100 ? "太棒了！你已经完成了这一阶段的所有目标。" : "继续加油。坚持不懈终会有回报。"}
                  </p>
                </div>
            </div>

            {/* Input */}
            <form onSubmit={handleAddGoal} className="mb-10 relative z-20 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                  <input 
                      ref={inputRef}
                      type="text" 
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder={`添加${activeTab === 'short-term' ? '短期' : '长期'}目标...`}
                      className="w-full pl-6 pr-4 py-4 rounded-2xl bg-white border border-warm-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all placeholder-warm-300 text-warm-800 shadow-sm"
                  />
              </div>
              <div className="flex gap-2">
                <div className="relative w-28">
                    <input 
                        type="number" 
                        min="1"
                        max="999"
                        value={targetDays}
                        onChange={(e) => setTargetDays(e.target.value)}
                        placeholder={activeTab === 'short-term' ? "7天" : "天数"}
                        className={`w-full h-full px-2 text-center rounded-2xl bg-white border border-warm-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all placeholder-warm-300 text-warm-800 shadow-sm font-medium ${activeTab === 'long-term' && !targetDays ? 'opacity-70' : ''}`}
                    />
                </div>
                <button 
                    type="submit"
                    className={`px-6 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md font-bold ${
                        newGoalTitle.trim() 
                          ? 'bg-orange-500 text-white hover:bg-orange-600 transform hover:scale-105' 
                          : 'bg-warm-100 text-warm-400 hover:bg-warm-200'
                    }`}
                >
                    <Plus size={24} />
                </button>
              </div>
            </form>

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24">
                {filteredGoals.length === 0 && (
                  <div className="col-span-full text-center py-12 text-warm-400">
                      <p>尚未设定目标。</p>
                  </div>
                )}
                {filteredGoals.map((goal) => {
                  const isShortTerm = goal.type === 'short-term';
                  const daysDone = goal.completedDates?.length || 0;
                  const isDoneToday = goal.completedDates?.includes(todayStr);
                  
                  const handleMainAction = () => {
                      if (isShortTerm) {
                          checkInGoal(goal.id);
                      } else {
                          toggleGoal(goal.id);
                      }
                  };

                  // Progress Calculation
                  let progressPercent = 0;
                  let progressLabel = '';
                  let statusText = '';

                  if (isShortTerm) {
                      const total = goal.targetDays || 1;
                      progressPercent = Math.min(100, (daysDone / total) * 100);
                      progressLabel = `${daysDone} / ${goal.targetDays} 天`;
                      statusText = progressPercent >= 100 ? '已达标' : '进行中';
                  } else {
                      progressPercent = goal.completed ? 100 : 0;
                      if (goal.completed) {
                          progressLabel = '100%';
                          statusText = '已完成';
                      } else {
                          progressLabel = daysDone > 0 ? `坚持${daysDone}天` : '0%';
                          statusText = '进行中';
                      }
                  }

                  return (
                  <div 
                    key={goal.id} 
                    className={`group flex flex-col p-6 bg-white rounded-3xl border transition-all duration-300 relative ${
                      goal.completed ? 'border-transparent bg-warm-100/50 opacity-80' : 'border-warm-100 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                      {/* Card Header with Checkbox and Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <button 
                          onClick={handleMainAction}
                          className={`flex-shrink-0 transition-all duration-300 ${
                              (isShortTerm && isDoneToday) || (!isShortTerm && goal.completed) 
                                ? 'text-orange-500 scale-110' 
                                : 'text-warm-300 group-hover:text-orange-400'
                            }`}
                        >
                          {(isShortTerm && isDoneToday) || (!isShortTerm && goal.completed) 
                            ? <CheckCircle size={32} className="fill-current" /> 
                            : <Circle size={32} strokeWidth={1.5} />
                          }
                        </button>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isShortTerm && !goal.completed && (
                                <button
                                  onClick={() => toggleGoal(goal.id)}
                                  title="结束/归档此目标"
                                  className="p-2 text-warm-300 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
                                >
                                    <Archive size={18} />
                                </button>
                            )}
                            <button 
                              onClick={() => deleteGoal(goal.id)}
                              className="p-2 text-warm-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                        </div>
                      </div>

                      {/* Content & Progress */}
                      <div className="flex-1 flex flex-col justify-between">
                          <h3 className={`text-lg font-bold mb-4 transition-all duration-300 leading-tight ${goal.completed ? 'text-warm-400 line-through' : 'text-warm-800'}`}>
                              {goal.title}
                          </h3>
                          
                          <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs font-bold text-warm-400 uppercase tracking-wider">
                                  <span>{statusText}</span>
                                  <span>{progressLabel}</span>
                              </div>
                              
                              <div className="h-3 w-full bg-warm-100 rounded-full overflow-hidden shadow-inner relative">
                                  <div 
                                      className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                                        goal.completed 
                                          ? 'bg-green-500' 
                                          : 'bg-gradient-to-r from-orange-300 to-orange-500'
                                      }`}
                                      style={{ width: `${progressPercent}%` }}
                                  >
                                    {/* Shine effect for active incomplete goals */}
                                    {!goal.completed && progressPercent > 0 && (
                                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    )}
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Trophy Icon Decoration for Completed Goals */}
                      {goal.completed && (
                        <div className="absolute bottom-4 right-4 text-warm-200/50 pointer-events-none">
                           <Trophy size={64} />
                        </div>
                      )}
                  </div>
                )})}
            </div>
         </div>
       </div>
    </div>
  );
};

export default Goals;