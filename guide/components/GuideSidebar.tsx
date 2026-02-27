import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Zap,
  BookOpen,
  HelpCircle,
  ExternalLink,
  Sun,
  Moon,
  ChevronRight,
  X,
} from 'lucide-react';
import { NAVIGATION, MAIN_SITE_URL, NavItem } from '../constants/navigation';
import { useTheme } from '../contexts/ThemeContext';

interface GuideSidebarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  '首頁': Home,
  '快速開始': Zap,
  '功能教學': BookOpen,
  '常見問題': HelpCircle,
};

export default function GuideSidebar({
  isDarkMode,
  onToggleDarkMode,
  isOpen,
  onClose,
}: GuideSidebarProps) {
  const location = useLocation();
  const theme = useTheme();

  // Auto-expand the tutorial section when the current route is a tutorial page
  const isTutorialRoute = location.pathname.startsWith('/tutorial');
  const [isTutorialExpanded, setIsTutorialExpanded] = useState(isTutorialRoute);

  // Keep tutorial section expanded when navigating into it
  useEffect(() => {
    if (isTutorialRoute) {
      setIsTutorialExpanded(true);
    }
  }, [isTutorialRoute]);

  // Close mobile drawer on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname === path;
    },
    [location.pathname],
  );

  const toggleTutorialExpanded = () => {
    setIsTutorialExpanded((prev) => !prev);
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = ICON_MAP[item.label];
    const active = isActive(item.path);
    const hasChildren = item.children && item.children.length > 0;

    // Expandable section (功能教學)
    if (hasChildren) {
      return (
        <li key={item.path}>
          <button
            onClick={toggleTutorialExpanded}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-colors duration-150 cursor-pointer
              ${isTutorialRoute ? `${theme.surfaceAccent} ${theme.primaryText} font-medium` : `${theme.text} hover:${theme.surfaceAlt}`}
            `}
          >
            {Icon && <Icon size={18} className="shrink-0" />}
            <span className="flex-1 text-left text-sm">{item.label}</span>
            <ChevronRight
              size={16}
              className={`shrink-0 transition-transform duration-200 ${
                isTutorialExpanded ? 'rotate-90' : 'rotate-0'
              }`}
            />
          </button>

          {/* Sub-items */}
          <div
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              isTutorialExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <ul className={`mt-1 ml-3 pl-3 border-l-2 ${theme.border} space-y-0.5`}>
              {item.children!.map((child) => {
                const childActive = isActive(child.path);
                return (
                  <li key={child.path}>
                    <Link
                      to={child.path}
                      className={`
                        block px-3 py-2 rounded-lg text-sm transition-colors duration-150
                        ${
                          childActive
                            ? `${theme.surfaceAccent} ${theme.primaryText} font-medium`
                            : `${theme.textLight} hover:${theme.text} hover:${theme.surfaceAlt}`
                        }
                      `}
                    >
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      );
    }

    // Regular nav item
    return (
      <li key={item.path}>
        <Link
          to={item.path}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg
            transition-colors duration-150
            ${
              active
                ? `${theme.surfaceAccent} ${theme.primaryText} font-medium`
                : `${theme.text} hover:${theme.surfaceAlt}`
            }
          `}
        >
          {Icon && <Icon size={18} className="shrink-0" />}
          <span className="text-sm">{item.label}</span>
        </Link>
      </li>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Title */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className={`w-8 h-8 ${theme.primary} rounded-lg flex items-center justify-center`}
            >
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <h1 className={`text-base font-bold ${theme.text} leading-tight`}>
                ClassMate AI
              </h1>
              <p className={`text-xs ${theme.textLight} leading-tight`}>使用教學</p>
            </div>
          </Link>

          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className={`
              lg:hidden p-1.5 rounded-lg transition-colors duration-150
              ${theme.text} hover:${theme.surfaceAlt} cursor-pointer
            `}
            aria-label="關閉選單"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2">
        <ul className="space-y-1">
          {NAVIGATION.map(renderNavItem)}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className={`px-3 pb-5 pt-3 border-t ${theme.border} space-y-2`}>
        {/* External link - 返回主站 */}
        <a
          href={MAIN_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            transition-colors duration-150
            ${theme.textLight} hover:${theme.text} hover:${theme.surfaceAlt}
          `}
        >
          <ExternalLink size={18} className="shrink-0" />
          <span>返回主站</span>
        </a>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            transition-colors duration-150 cursor-pointer
            ${theme.textLight} hover:${theme.text} hover:${theme.surfaceAlt}
          `}
          aria-label={isDarkMode ? '切換至淺色模式' : '切換至深色模式'}
        >
          {isDarkMode ? (
            <Sun size={18} className="shrink-0" />
          ) : (
            <Moon size={18} className="shrink-0" />
          )}
          <span>{isDarkMode ? '淺色模式' : '深色模式'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - fixed on left */}
      <aside
        className={`
          hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0
          lg:w-[280px] lg:z-30
          ${theme.surface} border-r ${theme.border}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-out drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden
          ${theme.surface} border-r ${theme.border}
          shadow-xl
          transition-transform duration-250 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
