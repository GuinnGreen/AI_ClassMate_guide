import { useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import GuideSidebar from './GuideSidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Layout({ children, isDarkMode, onToggleDarkMode }: LayoutProps) {
  const theme = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`min-h-dvh ${theme.bg} ${theme.text}`}>
      {/* Sidebar (handles desktop fixed + mobile drawer internally) */}
      <GuideSidebar
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content area - offset for desktop sidebar */}
      <div className="lg:pl-[280px]">
        {/* Mobile header */}
        <div className={`lg:hidden sticky top-0 z-30 ${theme.surface} border-b ${theme.border} px-4 py-3 flex items-center gap-3`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-xl ${theme.surfaceAccent} ${theme.text} transition-colors cursor-pointer`}
            aria-label="開啟選單"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-lg">ClassMate AI 教學</span>
        </div>

        {/* Page content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
