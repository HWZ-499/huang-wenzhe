import React, { useEffect } from 'react';
import { Home, BookOpen, Target, Lightbulb } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { data } = useApp();
  
  // Default to warm white if not set
  const themeColor = data.settings?.themeColor || '#FDFBF7';

  // Apply theme to body for overscroll effects on iOS
  useEffect(() => {
    document.body.style.backgroundColor = themeColor;
  }, [themeColor]);

  const navItems = [
    { path: '/', icon: Home, label: '今日' },
    { path: '/journal', icon: BookOpen, label: '日记' },
    { path: '/goals', icon: Target, label: '目标' },
    { path: '/ideas', icon: Lightbulb, label: '灵感' },
  ];

  return (
    <div 
      className="min-h-screen text-warm-900 pb-24 md:pb-0 md:pl-24 font-sans selection:bg-orange-200 transition-colors duration-500 ease-in-out"
      style={{ backgroundColor: themeColor }}
    >
      {/* Changed max-w-3xl to max-w-7xl and adjusted padding for a wider dashboard layout */}
      <main className="max-w-7xl mx-auto min-h-screen p-4 md:p-8 lg:p-12">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-warm-200 px-6 py-2 md:hidden z-50 safe-area-bottom">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${
                  isActive ? 'text-orange-500 scale-105' : 'text-warm-400'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-24 flex-col items-center bg-white border-r border-warm-200 z-50 py-8">
        {/* Logo at Top */}
        <div className="mb-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 shadow-lg cursor-pointer hover:rotate-6 transition-transform" title="Bloom"></div>
        </div>

        {/* Nav Items - Vertically Centered */}
        <div className="flex flex-col gap-6 w-full my-auto">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             const Icon = item.icon;
             return (
               <NavLink
                 key={item.path}
                 to={item.path}
                 className={`flex flex-col items-center gap-1 py-3 relative group w-full transition-all duration-300 ${
                   isActive ? 'text-orange-500' : 'text-warm-400 hover:text-warm-600'
                 }`}
               >
                 {/* Replaced Left Border with Centered Background Pill */}
                 {isActive && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-orange-50 rounded-2xl -z-10 animate-fade-in shadow-sm" />
                 )}
                 
                 <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                 <span className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {item.label}
                 </span>
               </NavLink>
             );
          })}
        </div>
        
        {/* Bottom Spacer to balance visual weight */}
        <div className="mt-auto w-10 h-10 opacity-0"></div>
      </nav>
    </div>
  );
};

export default Layout;