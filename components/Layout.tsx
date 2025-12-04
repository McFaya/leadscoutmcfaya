import React, { useState } from 'react';
import { AppView, User } from '../types';

interface LayoutProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const NavItem = ({ 
  view, 
  current, 
  label, 
  icon, 
  onClick,
  collapsed,
  mobile
}: { 
  view: AppView; 
  current: AppView; 
  label: string; 
  icon: React.ReactNode; 
  onClick: (v: AppView) => void;
  collapsed: boolean;
  mobile?: boolean;
}) => {
  const isActive = view === current;
  return (
    <button
      onClick={() => onClick(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      } ${collapsed && !mobile ? 'justify-center' : ''}`}
      title={collapsed && !mobile ? label : undefined}
    >
      <span className="shrink-0">{icon}</span>
      <span className={`font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${collapsed && !mobile ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
        {label}
      </span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children, user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S13.627 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.627 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white">ImportScout</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 rounded hover:bg-slate-800"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 md:relative 
          bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          md:flex-shrink-0
        `}
      >
        {/* Toggle Button (Desktop Only) */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-8 bg-slate-800 text-slate-400 border border-slate-700 rounded-full p-1.5 hover:text-white hover:bg-slate-700 z-50 shadow-md transition-colors"
        >
            {isCollapsed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg> 
            ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            )}
        </button>

        <div className={`p-6 border-b border-slate-800 flex items-center ${isCollapsed ? 'md:justify-center md:px-2' : ''} hidden md:flex`}>
          <div className="flex items-center gap-2 text-blue-400 overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 shrink-0 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S13.627 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.627 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <div className={`transition-all duration-300 ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}`}>
                <span className="text-xl font-bold tracking-tight block whitespace-nowrap">ImportScout</span>
                <p className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">Financial Intelligence</p>
            </div>
          </div>
        </div>
        
        {/* Mobile Sidebar Header */}
        <div className="p-6 border-b border-slate-800 flex items-center md:hidden">
             <span className="text-xl font-bold tracking-tight text-white block">Menu</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-x-hidden custom-scrollbar">
          <NavItem 
            view={AppView.DASHBOARD} 
            current={currentView} 
            label="Dashboard" 
            onClick={handleNavClick}
            collapsed={isCollapsed}
            mobile={mobileMenuOpen}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
          />
          <NavItem 
            view={AppView.SEARCH} 
            current={currentView} 
            label="Find Importers" 
            onClick={handleNavClick}
            collapsed={isCollapsed}
            mobile={mobileMenuOpen}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
          <NavItem 
            view={AppView.LEADS} 
            current={currentView} 
            label="Leads Database" 
            onClick={handleNavClick}
            collapsed={isCollapsed}
            mobile={mobileMenuOpen}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <NavItem 
            view={AppView.N8N_CONFIG} 
            current={currentView} 
            label="Automation (n8n)" 
            onClick={handleNavClick}
            collapsed={isCollapsed}
            mobile={mobileMenuOpen}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/50 overflow-hidden">
          <div className={`flex items-center gap-3 mb-3 ${isCollapsed && !mobileMenuOpen ? 'md:justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed && !mobileMenuOpen ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-medium text-white truncate whitespace-nowrap">{user.name}</p>
              <p className="text-xs text-slate-400 truncate whitespace-nowrap">{user.company}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className={`w-full py-2 rounded bg-slate-700 hover:bg-slate-600 text-xs text-slate-300 transition-colors flex items-center justify-center gap-2 ${isCollapsed && !mobileMenuOpen ? 'md:px-0' : 'px-4'}`}
            title="Sign Out"
          >
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed && !mobileMenuOpen ? 'md:w-0 md:opacity-0' : 'w-auto opacity-100'}`}>
                Sign Out
            </span>
          </button>
        </div>

        {/* Footer Credit */}
        <div className={`p-3 text-center bg-slate-950 transition-all duration-300 ${isCollapsed && !mobileMenuOpen ? 'md:h-0 md:p-0 md:overflow-hidden md:opacity-0' : 'h-auto opacity-100'}`}>
           <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold font-mono whitespace-nowrap">
             Created by McFaya
           </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 pt-16 md:pt-0">
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 sticky top-0 z-10 hidden md:block">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">
              {currentView === AppView.DASHBOARD && "Intelligence Dashboard"}
              {currentView === AppView.SEARCH && "Scout New Importers"}
              {currentView === AppView.LEADS && "Lead Database"}
              {currentView === AppView.N8N_CONFIG && "n8n Automation Configuration"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-xs text-slate-400 font-mono hidden lg:block">
                 v2.4.0 • McFaya Build
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                System Operational
              </span>
            </div>
          </div>
        </header>
        
        {/* Mobile View Title */}
        <div className="md:hidden px-4 py-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
           <h1 className="text-lg font-bold text-slate-800">
              {currentView === AppView.DASHBOARD && "Dashboard"}
              {currentView === AppView.SEARCH && "New Search"}
              {currentView === AppView.LEADS && "Leads"}
              {currentView === AppView.N8N_CONFIG && "Automation"}
           </h1>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};