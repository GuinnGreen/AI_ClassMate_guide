import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function AiCommentTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <Sparkles size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            AI 評語
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          ClassMate AI 的核心功能——根據學生的行為紀錄自動生成個人化學期評語。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep
          stepNumber={1}
          title="確認行為紀錄完整"
          tip="紀錄越完整，生成的評語越準確且個人化。"
          imageSrc="/guide/images/ai-comment-1.webp"
        >
          在產生評語前，請確認學生的行為紀錄和標籤已經記錄完善，這些資料是 AI 生成評語的依據。
        </TutorialStep>

        <TutorialStep stepNumber={2} title="進入學生詳細頁面" imageSrc="/guide/images/ai-comment-2.webp">
          在側邊欄選擇要產生評語的學生，進入其詳細頁面。
        </TutorialStep>

        <TutorialStep stepNumber={3} title="點擊生成評語" imageSrc="/guide/images/ai-comment-3.webp">
          找到「AI 評語」區域，點擊「生成評語」按鈕。系統會根據該學生的所有行為紀錄和標籤，使用
          AI 生成一段個人化評語。
        </TutorialStep>

        <TutorialStep stepNumber={4} title="檢視與編輯評語" imageSrc="/guide/images/ai-comment-4.webp">
          AI 生成的評語會顯示在文字框中。您可以直接編輯修改，使評語更符合您的用詞風格。
        </TutorialStep>

        <TutorialStep
          stepNumber={5}
          title="複製或儲存評語"
          tip="評語會自動儲存，下次開啟時仍可看到。"
          imageSrc="/guide/images/ai-comment-5.webp"
        >
          修改完成後，可以複製評語貼到成績單系統，或直接儲存在系統中。
        </TutorialStep>
      </div>

      {/* AI model info callout */}
      <div className="mt-4 space-y-4">
        <CalloutBox type="info">
          AI 評語使用 Google Gemini 模型生成。如果第一次生成的結果不滿意，可以再次點擊重新生成。
        </CalloutBox>

        {/* Navigation hint */}
        <CalloutBox type="tip" title="下一步">
          想讓 AI 評語更精準？前往
          <Link
            to="/tutorial/tags"
            className={`mx-1 font-medium underline underline-offset-2 ${theme.primaryText}`}
          >
            評語標籤
          </Link>
          教學，學習如何用標籤描述學生特質。
        </CalloutBox>
      </div>
    </div>
  );
}
