import { CalendarOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function AbsenceTrackingTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <CalendarOff size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            請假管理
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          追蹤和管理學生的出缺席狀況，讓班級出勤一目了然。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="選擇學生" imageSrc="/guide/images/absence-1.webp">
          在側邊欄選擇要記錄出缺席的學生，進入詳細頁面。
        </TutorialStep>

        <TutorialStep stepNumber={2} title="記錄請假" imageSrc="/guide/images/absence-2.webp">
          在學生頁面中找到「出缺席」區域，點擊「記錄請假」。選擇日期和假別（事假、病假、公假等）。
        </TutorialStep>

        <TutorialStep stepNumber={3} title="查看出席紀錄" imageSrc="/guide/images/absence-3.webp">
          出缺席紀錄會以列表形式顯示，包含日期、假別和備註。
        </TutorialStep>

        <TutorialStep
          stepNumber={4}
          title="編輯或取消"
          tip="誤報的出缺席可以隨時取消。"
          imageSrc="/guide/images/absence-4.webp"
        >
          如需修改請假紀錄，點擊該紀錄即可編輯或刪除。
        </TutorialStep>
      </div>

      {/* Info callout */}
      <div className="mt-4">
        <CalloutBox type="info" title="出勤統計">
          出缺席紀錄會自動納入學生的整體行為評估，並在 AI 評語中作為參考依據。
        </CalloutBox>
      </div>
    </div>
  );
}
