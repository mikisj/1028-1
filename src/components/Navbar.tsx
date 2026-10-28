import React from 'react';
import { ActiveTab } from '../types/fsd';
import { Sparkles, ShoppingBag, MessageSquareHeart, Factory, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onQuickDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onQuickDemo }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'storefront',
      label: '前端體驗與資訊',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      id: 'customer_service',
      label: 'AI 客服與智能售後',
      icon: <MessageSquareHeart className="w-4 h-4" />,
    },
    {
      id: 'qa_traceability',
      label: 'AI 品檢與生產追溯',
      icon: <Factory className="w-4 h-4" />,
    },
    {
      id: 'bi_analytics',
      label: '營運數據與輿情預警',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('storefront')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                織履品質系統 <span className="font-normal text-stone-500 text-sm ml-1">KNTL Lab FSD</span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean typography) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium transition-all rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-stone-900 bg-stone-200/70 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onQuickDemo}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>快速起毛客訴測試</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 gap-1 border-t border-stone-200 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
