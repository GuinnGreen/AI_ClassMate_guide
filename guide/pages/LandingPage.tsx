import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import FeatureCard from '../components/FeatureCard';
import {
  Users,
  ClipboardList,
  Presentation,
  Sparkles,
  Tags,
  CalendarOff,
  Palette,
  FileDown,
  Archive,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Users,
    title: '學生管理',
    description: '新增、編輯、匯入學生資料',
    linkTo: '/tutorial/students',
  },
  {
    icon: ClipboardList,
    title: '行為紀錄',
    description: '記錄學生日常表現與加減分',
    linkTo: '/tutorial/behavior',
  },
  {
    icon: Presentation,
    title: '電子白板',
    description: '課堂白板與課表顯示',
    linkTo: '/tutorial/whiteboard',
  },
  {
    icon: Sparkles,
    title: 'AI 評語',
    description: '一鍵生成個人化學期評語',
    linkTo: '/tutorial/ai-comment',
  },
  {
    icon: Tags,
    title: '評語標籤',
    description: '建立評語依據的行為標籤',
    linkTo: '/tutorial/tags',
  },
  {
    icon: CalendarOff,
    title: '請假管理',
    description: '記錄與追蹤學生出缺席',
    linkTo: '/tutorial/absence',
  },
  {
    icon: Palette,
    title: '主題設定',
    description: '自訂深色模式與介面風格',
    linkTo: '/tutorial/theme',
  },
  {
    icon: FileDown,
    title: '匯出報表',
    description: '將紀錄匯出為 CSV 檔案',
    linkTo: '/tutorial/export',
  },
  {
    icon: Archive,
    title: '學期封存',
    description: '學期結束封存與重置資料',
    linkTo: '/tutorial/archive',
  },
] as const;

export default function LandingPage() {
  const theme = useTheme();

  return (
    <div>
      {/* Hero section */}
      <section className="py-12 text-center sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <BookOpen size={32} className={theme.primaryText} />
          </div>

          <h1 className={`mb-4 text-3xl font-bold sm:text-4xl ${theme.text}`}>
            ClassMate AI 使用教學
          </h1>

          <p className={`mx-auto mb-8 max-w-lg text-base leading-relaxed sm:text-lg ${theme.textLight}`}>
            專為教師設計的逐步教學指南，帶您從零開始掌握 ClassMate AI
            智慧班級經營系統的每一項功能。
          </p>

          <Link
            to="/quick-start"
            className={`inline-flex items-center gap-2 rounded-2xl ${theme.primary} ${theme.primaryHover} px-8 py-4 text-base font-bold text-white transition-colors`}
          >
            5 分鐘快速上手
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-8">
        <h2 className={`mb-6 text-xl font-bold ${theme.text}`}>功能教學</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.linkTo}
              icon={<feature.icon size={22} className={theme.primaryText} />}
              title={feature.title}
              description={feature.description}
              linkTo={feature.linkTo}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 text-center">
        <p className={`text-base ${theme.textLight}`}>
          需要更多幫助？請參考{' '}
          <Link
            to="/faq"
            className={`font-bold ${theme.primaryText} underline underline-offset-2 transition-opacity hover:opacity-80`}
          >
            常見問題頁面
          </Link>
          。
        </p>
      </section>
    </div>
  );
}
