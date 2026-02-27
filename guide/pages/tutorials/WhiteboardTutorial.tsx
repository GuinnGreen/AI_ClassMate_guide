import { Link } from 'react-router-dom';
import { PenTool } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function WhiteboardTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <PenTool size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            電子白板
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          使用電子白板功能進行課堂教學，還能顯示當日課表。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="切換到白板模式" imageSrc="/guide/images/whiteboard-1.webp">
          在側邊欄底部點擊「白板」按鈕，即可切換到電子白板介面。
        </TutorialStep>

        <TutorialStep
          stepNumber={2}
          title="使用書寫工具"
          tip="可以調整筆刷粗細和顏色。"
          imageSrc="/guide/images/whiteboard-2.webp"
        >
          白板提供多種書寫模式：自由繪圖、直線、矩形等。選擇工具後在白板上拖曳即可。
        </TutorialStep>

        <TutorialStep stepNumber={3} title="顯示課表" imageSrc="/guide/images/whiteboard-3.webp">
          點擊白板上方的「課表」按鈕，系統會顯示當日的課程表。
        </TutorialStep>

        <TutorialStep
          stepNumber={4}
          title="上傳課表圖片"
          tip="建議上傳清晰的課表照片或截圖，辨識效果會更好。"
          imageSrc="/guide/images/whiteboard-4.webp"
        >
          在設定中上傳課表圖片，系統使用 AI 視覺辨識自動解析課表內容。
        </TutorialStep>

        <TutorialStep stepNumber={5} title="使用範本" imageSrc="/guide/images/whiteboard-5.webp">
          白板提供預設範本（如格線、音樂五線譜等），可以直接套用作為書寫背景。
        </TutorialStep>
      </div>

      {/* Navigation hint */}
      <div className="mt-4">
        <CalloutBox type="info" title="下一步">
          白板功能熟悉後，來了解如何使用
          <Link
            to="/tutorial/ai-comment"
            className={`mx-1 font-medium underline underline-offset-2 ${theme.primaryText}`}
          >
            AI 評語
          </Link>
          自動生成學期評語吧！
        </CalloutBox>
      </div>
    </div>
  );
}
