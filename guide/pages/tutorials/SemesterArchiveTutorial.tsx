import { Link } from 'react-router-dom';
import { Archive } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function SemesterArchiveTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <Archive size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            學期封存
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          學期結束時，將當前資料封存並重置，為新學期做準備。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="了解封存功能" imageSrc="/guide/images/archive-1.webp">
          封存會將當前學期的所有行為紀錄、評語和標籤保存為歷史資料，然後清空紀錄，讓您以乾淨的狀態開始新學期。
        </TutorialStep>

        <TutorialStep stepNumber={2} title="進入封存頁面" imageSrc="/guide/images/archive-2.webp">
          在側邊欄設定中找到「學期封存」選項。
        </TutorialStep>

        <TutorialStep stepNumber={3} title="確認封存" imageSrc="/guide/images/archive-3.webp">
          系統會顯示即將封存的資料摘要。確認無誤後，輸入密碼驗證即可完成封存。
        </TutorialStep>

        <TutorialStep
          stepNumber={4}
          title="開始新學期"
          tip="封存前建議先匯出 CSV 備份一份。"
          imageSrc="/guide/images/archive-4.webp"
        >
          封存完成後，學生列表會保留，但行為紀錄和評語會被清空。您可以開始新學期的紀錄。
        </TutorialStep>
      </div>

      {/* Callouts */}
      <div className="mt-4 space-y-4">
        <CalloutBox type="warning" title="封存操作不可逆">
          封存操作不可逆，請在執行前確認所有評語和紀錄都已完成。
        </CalloutBox>

        <CalloutBox type="info" title="封存前先備份">
          建議在封存前先
          <Link
            to="/tutorial/export"
            className={`mx-1 font-medium underline underline-offset-2 ${theme.primaryText}`}
          >
            匯出 CSV 報表
          </Link>
          作為備份，以便日後查閱。
        </CalloutBox>
      </div>
    </div>
  );
}
