import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Lightbulb, Hash, Search, ArrowUp } from 'lucide-react';

const cardColors = [
  'bg-yellow-100 text-yellow-900',
  'bg-orange-100 text-orange-900',
  'bg-stone-100 text-stone-900',
  'bg-rose-100 text-rose-900',
  'bg-blue-100 text-blue-900',
  'bg-green-100 text-green-900',
];

const COMMON_TAGS = ['工作', '生活', '创意', '读书', '旅行', '电影', '代码', '美食', '未来'];

const Ideas: React.FC = () => {
  const { data, addIdea, deleteIdea } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', content: '' });
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string | null>(null);

  // Calculate all unique tags from existing ideas + common tags for the filter list
  const allAvailableTags = useMemo(() => {
    const userTags = new Set<string>();
    data.ideas.forEach(idea => {
      if (idea.tags) {
        idea.tags.forEach(t => userTags.add(t));
      }
    });
    COMMON_TAGS.forEach(tag => userTags.add(tag));
    return Array.from(userTags).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  }, [data.ideas]);

  const filteredIdeas = useMemo(() => {
    let ideas = [...data.ideas].reverse();
    if (selectedFilterTag) {
      ideas = ideas.filter(idea => (idea.tags || []).includes(selectedFilterTag));
    }
    return ideas;
  }, [data.ideas, selectedFilterTag]);

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !newTags.includes(trimmed)) {
      setNewTags([...newTags, trimmed]);
    }
    setTagInput('');
  };

  const handleManualAddTag = (e: React.FormEvent) => {
      e.preventDefault();
      handleAddTag(tagInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const removeNewTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(t => t !== tagToRemove));
  };

  const handleAdd = () => {
    if (!newIdea.title.trim()) return;
    
    // Auto-include the text currently in the tag input if the user didn't press enter
    let finalTags = [...newTags];
    const pendingTag = tagInput.trim();
    if (pendingTag && !finalTags.includes(pendingTag)) {
        finalTags.push(pendingTag);
    }

    addIdea({
      title: newIdea.title,
      content: newIdea.content,
      createdAt: new Date().toISOString(),
      color: cardColors[Math.floor(Math.random() * cardColors.length)],
      tags: finalTags
    });
    
    setNewIdea({ title: '', content: '' });
    setNewTags([]);
    setTagInput('');
    setIsAdding(false);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6">
         <div>
           <h1 className="text-3xl font-bold text-warm-900">灵感</h1>
           <p className="text-warm-500 mt-1">给未来的自己留点火花</p>
         </div>
         <button 
           onClick={() => setIsAdding(true)}
           className="px-5 py-2.5 bg-warm-900 text-white rounded-full font-bold text-sm shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
         >
           <Plus size={18} /> 添加灵感
         </button>
      </header>

      {/* Tag Filter Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedFilterTag(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedFilterTag === null
              ? 'bg-warm-800 text-white shadow-md'
              : 'bg-white border border-warm-200 text-warm-500 hover:bg-warm-50'
          }`}
        >
          全部
        </button>
        {allAvailableTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedFilterTag(tag === selectedFilterTag ? null : tag)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedFilterTag === tag
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white border border-warm-200 text-warm-500 hover:bg-warm-50'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Input Area */}
      {isAdding && (
        <div className="mb-8 bg-white p-6 rounded-3xl shadow-lg border border-orange-100 animate-slide-up max-w-2xl mx-auto">
           <input 
              className="w-full text-xl font-bold text-warm-900 placeholder-warm-300 border-none focus:ring-0 p-0 mb-3 bg-transparent"
              placeholder="灵感标题..."
              autoFocus
              value={newIdea.title}
              onChange={e => setNewIdea({...newIdea, title: e.target.value})}
           />
           <textarea 
              className="w-full h-24 text-warm-700 placeholder-warm-300 border-none focus:ring-0 p-0 resize-none bg-transparent mb-4"
              placeholder="描述你的想法..."
              value={newIdea.content}
              onChange={e => setNewIdea({...newIdea, content: e.target.value})}
           />
           
           {/* Tag Input Section */}
           <div className="mb-6">
             <div className="flex flex-wrap items-center gap-2 mb-3">
               {newTags.map(tag => (
                 <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold animate-fade-in">
                   #{tag}
                   <button onClick={() => removeNewTag(tag)} className="hover:text-orange-900"><X size={12}/></button>
                 </span>
               ))}
               
               <div className="relative flex-1 min-w-[120px] max-w-[200px]">
                   <input 
                     type="text"
                     value={tagInput}
                     onChange={e => setTagInput(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder="输入标签..."
                     className="w-full bg-warm-50 rounded-lg pl-2 pr-8 py-1 text-sm text-warm-600 placeholder-warm-300 border-none focus:ring-1 focus:ring-orange-300"
                   />
                   {tagInput && (
                       <button 
                         onClick={(e) => handleManualAddTag(e)}
                         className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-orange-500 hover:bg-orange-100 rounded"
                       >
                           <ArrowUp size={14} strokeWidth={3} />
                       </button>
                   )}
               </div>
             </div>
             
             <div className="flex flex-wrap gap-2">
               <span className="text-xs text-warm-400 py-1">选择标签:</span>
               {allAvailableTags.filter(t => !newTags.includes(t)).map(tag => (
                 <button 
                   key={tag}
                   onClick={() => handleAddTag(tag)}
                   className="px-2 py-1 rounded-md bg-warm-50 text-warm-500 text-xs hover:bg-warm-100 transition-colors"
                 >
                   {tag}
                 </button>
               ))}
             </div>
           </div>

           <div className="flex justify-end gap-3 pt-4 border-t border-warm-50">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-warm-500 font-medium hover:bg-warm-50"
              >
                取消
              </button>
              <button 
                onClick={handleAdd}
                className="px-6 py-2 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
              >
                固定灵感
              </button>
           </div>
        </div>
      )}

      {/* Increased columns for desktop view: sm:columns-2 lg:columns-3 xl:columns-4 */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-20">
         {filteredIdeas.length === 0 && !isAdding && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-warm-400">
               {selectedFilterTag ? (
                 <>
                   <Search size={48} className="mb-4 text-warm-200" />
                   <p>没有找到带有 #{selectedFilterTag} 的灵感。</p>
                   <button onClick={() => setSelectedFilterTag(null)} className="mt-2 text-orange-500 font-bold text-sm">清除筛选</button>
                 </>
               ) : (
                 <>
                   <Lightbulb size={48} className="mb-4 text-warm-200" />
                   <p>尚未记录灵感。</p>
                 </>
               )}
            </div>
         )}
         
         {filteredIdeas.map((idea) => (
           <div 
             key={idea.id} 
             className={`break-inside-avoid p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative group flex flex-col ${idea.color}`}
           >
              <button 
                 onClick={() => deleteIdea(idea.id)}
                 className="absolute top-4 right-4 p-1.5 bg-white/50 backdrop-blur-sm rounded-full text-warm-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                 <X size={14} />
              </button>
              
              <h3 className="font-bold text-lg mb-2 leading-tight">{idea.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed whitespace-pre-wrap flex-1">{idea.content}</p>
              
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex flex-wrap gap-1">
                   {(idea.tags || []).map(tag => (
                     <span key={tag} className="px-2 py-0.5 rounded-md bg-white/40 text-[10px] font-bold text-black/60 backdrop-blur-sm">
                       #{tag}
                     </span>
                   ))}
                 </div>
                 <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex-shrink-0 ml-2">
                   {new Date(idea.createdAt).toLocaleDateString()}
                 </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default Ideas;