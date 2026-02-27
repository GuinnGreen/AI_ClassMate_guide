import { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CalloutBoxProps {
  type: 'tip' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
}

/** Extract the hex color value from a Tailwind class like "bg-[#34C759]" or "text-[#6B7C93]". */
function extractHex(twClass: string): string {
  const match = twClass.match(/#[A-Fa-f0-9]{3,8}/);
  return match ? match[0] : '#6B7C93';
}

const CONFIG = {
  tip: {
    icon: Lightbulb,
    defaultTitle: '小提示',
    colorKey: 'accentPositiveText' as const,
    borderColorKey: 'accentPositive' as const,
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: '注意',
    colorKey: 'accentNegativeText' as const,
    borderColorKey: 'accentNegative' as const,
  },
  info: {
    icon: Info,
    defaultTitle: '說明',
    colorKey: 'primaryText' as const,
    borderColorKey: 'primary' as const,
  },
};

export default function CalloutBox({ type, title, children }: CalloutBoxProps) {
  const theme = useTheme();
  const { icon: Icon, defaultTitle, colorKey, borderColorKey } = CONFIG[type];

  const iconTextClass = theme[colorKey];
  const borderHex = extractHex(theme[borderColorKey]);
  const displayTitle = title ?? defaultTitle;

  return (
    <div
      className={`rounded-2xl ${theme.surfaceAlt} px-5 py-4`}
      style={{ borderLeft: `4px solid ${borderHex}` }}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className={`mt-0.5 shrink-0 ${iconTextClass}`} />
        <div className="min-w-0">
          <p className={`mb-1 font-bold ${iconTextClass}`}>{displayTitle}</p>
          <div className={`text-sm leading-relaxed ${theme.textLight}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
