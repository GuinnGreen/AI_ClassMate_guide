import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function BehaviorRecordingTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <ClipboardList size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            行為紀錄
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          了解如何記錄學生的日常行為表現，包括加分、減分和自訂行為。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="選擇學生" imageSrc="/guide/images/behavior-1.webp">
          在側邊欄點選要記錄行為的學生，進入該學生的詳細頁面。
        </TutorialStep>

        <TutorialStep
          stepNumber={2}
          title="快速加減分"
          tip="長按加分或減分按鈕可以輸入自訂分數，例如一次加 5 分。"
          imageSrc="/guide/images/behavior-2.webp"
        >
          頁面上方會顯示加分（+）和減分（-）按鈕。點擊即可為學生加一分或減一分。
        </TutorialStep>

        <TutorialStep stepNumber={3} title="查看每日紀錄" imageSrc="/guide/images/behavior-3.webp">
          向下滾動可以看到學生的每日行為紀錄，包括日期、分數變動和備註。
        </TutorialStep>

        <TutorialStep stepNumber={4} title="新增備註" imageSrc="/guide/images/behavior-4.webp">
          在每日紀錄區域，點擊備註欄位可以為當天的紀錄添加文字說明。
        </TutorialStep>

        <TutorialStep
          stepNumber={5}
          title="自訂行為項目"
          tip="自訂行為項目會出現在快速加減分選單中，方便日常使用。"
          imageSrc="/guide/images/behavior-5.webp"
        >
          在設定中可以新增自訂的加分/減分行為項目，例如「準時交作業」或「上課說話」。
        </TutorialStep>
      </div>

      {/* Navigation hint */}
      <div className="mt-4">
        <CalloutBox type="info" title="下一步">
          行為紀錄完成後，試試看使用
          <Link
            to="/tutorial/tags"
            className={`mx-1 font-medium underline underline-offset-2 ${theme.primaryText}`}
          >
            評語標籤
          </Link>
          為學生標記特質，讓 AI 評語更加精準。
        </CalloutBox>
      </div>
    </div>
  );
}
