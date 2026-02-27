export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  { label: '首頁', path: '/' },
  { label: '快速開始', path: '/quick-start' },
  {
    label: '功能教學',
    path: '/tutorial',
    children: [
      { label: '學生管理', path: '/tutorial/students' },
      { label: '行為紀錄', path: '/tutorial/behavior' },
      { label: '電子白板', path: '/tutorial/whiteboard' },
      { label: 'AI 評語', path: '/tutorial/ai-comment' },
      { label: '評語標籤', path: '/tutorial/tags' },
      { label: '請假管理', path: '/tutorial/absence' },
      { label: '主題設定', path: '/tutorial/theme' },
      { label: '匯出報表', path: '/tutorial/export' },
      { label: '學期封存', path: '/tutorial/archive' },
    ],
  },
  { label: '常見問題', path: '/faq' },
];

export const MAIN_SITE_URL = 'https://ai-classmate.com';
