import { useTheme } from '../contexts/ThemeContext';
import TutorialStep from '../components/TutorialStep';
import CalloutBox from '../components/CalloutBox';
import { Zap } from 'lucide-react';

const STEPS = [
  {
    title: '註冊帳號',
    description:
      '前往 ClassMate AI 首頁，點擊「註冊」按鈕，使用電子郵件建立帳號。',
    tip: '建議使用學校信箱，方便日後找回密碼。',
    image: 'quick-start-1.webp',
  },
  {
    title: '新增學生',
    description:
      '登入後，在側邊欄點擊「+」新增學生，或使用匯入功能批量新增全班學生名單。',
    tip: '可使用 CSV 檔案一次匯入全班學生。',
    image: 'quick-start-2.webp',
  },
  {
    title: '記錄行為',
    description:
      '點選學生進入詳細頁面，使用加分/減分按鈕記錄日常表現。',
    tip: '長按加分按鈕可以輸入自訂分數。',
    image: 'quick-start-3.webp',
  },
  {
    title: '使用白板',
    description:
      '在側邊欄切換到「白板」頁面，使用課堂白板或顯示當日課表。',
    tip: '可上傳課表圖片，系統會自動辨識。',
    image: 'quick-start-4.webp',
  },
  {
    title: '產生評語',
    description:
      '學期末點擊「AI 評語」按鈕，系統會根據學生的行為紀錄自動生成個人化評語。',
    tip: '評語會參考學生的加減分紀錄和行為標籤。',
    image: 'quick-start-5.webp',
  },
] as const;

export default function QuickStartPage() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <Zap size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            5 分鐘快速上手
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          跟著以下步驟，快速開始使用 ClassMate AI
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        {STEPS.map((step, index) => (
          <TutorialStep
            key={index}
            stepNumber={index + 1}
            title={step.title}
            tip={step.tip}
            imageSrc={`/guide/images/${step.image}`}
          >
            {step.description}
          </TutorialStep>
        ))}
      </div>

      {/* Info callout */}
      <div className="mt-4">
        <CalloutBox type="info">
          想了解更多進階功能？請參考左側選單中的各功能詳細教學。
        </CalloutBox>
      </div>
    </div>
  );
}
