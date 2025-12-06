import React from 'react';
import { AppView } from '../types';
import { Home, Map, Users, Calendar } from 'lucide-react';

interface Props {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Navigation: React.FC<Props> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.DISCOVER, label: 'Discover', icon: Home },
    { id: AppView.ITINERARY, label: 'Itinerary', icon: Calendar },
    { id: AppView.GUIDES, label: 'Guides', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:space-x-8 items-center h-16">
          <div className="hidden md:block text-2xl font-bold text-teal-600 mr-8">
            HiddenPaths
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-teal-600 bg-teal-50' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};