import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Calendar } from 'lucide-react';
import { JournalEntry } from '../types';

const moodOptions: { value: JournalEntry['mood']; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😄', label: '开心' },
  { value: 'productive', emoji: '⚡', label: '高效' },
  { value: 'neutral', emoji: '😐', label: '平淡' },
  { value: 'tired', emoji: '🥱', label: '疲惫' },
  { value: 'sad', emoji: '😔', label: '难过' },
];

const Journal: React.FC = () => {
  const { data, addJournalEntry, deleteJournalEntry } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newEntry, setNewEntry] = useState<{
    content: string;
    tags: string;
    mood: JournalEntry['mood'];
  }>({ content: '', tags: '', mood: 'happy' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.content.trim()) return;

    addJournalEntry({
      date: new Date().toISOString(),
      content: newEntry.content,
      mood: newEntry.mood,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setNewEntry({ content: '', tags: '', mood: 'happy' });
    setIsCreating(false);
  };

  const getMoodEmoji = (mood: string) => moodOptions.find(m => m.value === mood)?.emoji || '😐';

  return (
    <div className="animate-fade-in pb-20">
      <header className="flex justify-between items-center mb-8 max-w-3xl mx-auto">
        <div>
           <h1 className="text-3xl font-bold text-warm-900">日记</h1>
           <p className="text-warm-500 mt-1">记录你的每日随想</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="w-12 h-12 rounded-full bg-warm-900 text-warm-50 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Creation Modal / Overlay */}
      {isCreating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-warm-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-warm-800">新日记</h2>
              <button onClick={() => setIsCreating(false)} className="p-2 bg-warm-100 rounded-full hover:bg-warm-200 text-warm-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mood Selector */}
              <div>
                <label className="block text-xs font-bold text-warm-400 uppercase tracking-wider mb-2">心情如何?</label>
                <div className="grid grid-cols-5 gap-2">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewEntry({ ...newEntry, mood: option.value })}
                      className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 ${
                        newEntry.mood === option.value
                          ? 'bg-orange-100 text-orange-600 shadow-sm ring-2 ring-orange-200 scale-105'
                          : 'bg-warm-50 text-warm-400 hover:bg-warm-100'
                      }`}
                    >
                      <span className="text-2xl mb-1 filter drop-shadow-sm">{option.emoji}</span>
                      <span className="text-[10px] font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <textarea 
                className="w-full h-48 p-4 bg-warm-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-200 text-warm-800 resize-none placeholder-warm-300 text-lg leading-relaxed"
                placeholder="今天过得怎么样？在想些什么？"
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                autoFocus
              />
              <input 
                type="text"
                className="w-full p-4 bg-warm-50 rounded-xl border-none focus:ring-2 focus:ring-orange-200 text-warm-800 placeholder-warm-300"
                placeholder="标签 (用逗号分隔)..."
                value={newEntry.tags}
                onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
              />
              <button 
                type="submit" 
                className="w-full py-4 bg-warm-900 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20"
              >
                保存回忆
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Timeline - Limited Width Container (Reduced to 3xl for better centering focus) */}
      <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:left-[19px] before:top-0 before:bottom-0 before:w-0.5 before:bg-warm-200">
        {data.journal.length === 0 ? (
          <div className="text-center py-20 pl-8">
            <div className="inline-block p-6 rounded-full bg-warm-100 text-warm-400 mb-4">
               <BookOpenIcon size={40} />
            </div>
            <p className="text-warm-500 font-medium">日记是空的。从今天开始记录吧！</p>
          </div>
        ) : (
          data.journal.map((entry) => (
            <div key={entry.id} className="relative pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute left-0 top-6 w-10 h-10 rounded-full bg-white border-4 border-warm-100 flex items-center justify-center z-10 group-hover:border-orange-200 transition-colors shadow-sm">
                 <span className="text-xs font-bold text-warm-400">{new Date(entry.date).getDate()}</span>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-warm-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-warm-400 uppercase tracking-wider">
                    <span className="text-2xl leading-none mr-1" title={entry.mood}>{getMoodEmoji(entry.mood)}</span>
                    <span className="w-1 h-1 rounded-full bg-warm-300 mx-1"></span>
                    <Calendar size={12} />
                    {new Date(entry.date).toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}
                    <span className="w-1 h-1 rounded-full bg-warm-300 mx-1"></span>
                    <span className="text-orange-400">{new Date(entry.date).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <button 
                    onClick={() => deleteJournalEntry(entry.id)}
                    className="text-warm-300 hover:text-red-400 transition-colors p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <p className="text-warm-800 leading-relaxed whitespace-pre-wrap text-lg font-serif">{entry.content}</p>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-warm-50">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-warm-50 text-warm-500 font-bold hover:bg-warm-100 transition-colors">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const BookOpenIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

export default Journal;