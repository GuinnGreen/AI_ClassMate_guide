import { Link } from 'react-router-dom';
import { Tags } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function EvaluationTagsTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <Tags size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            評語標籤
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          使用標籤系統為學生標記特質和行為模式，幫助 AI 生成更精準的評語。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="了解標籤功能" imageSrc="/guide/images/tags-1.webp">
          標籤是描述學生特質的短語，例如「負責任」、「樂於助人」、「需要加強專注力」。AI
          在生成評語時會參考這些標籤。
        </TutorialStep>

        <TutorialStep stepNumber={2} title="進入標籤管理" imageSrc="/guide/images/tags-2.webp">
          在學生詳細頁面中，找到「標籤」區域，可以看到該學生目前的所有標籤。
        </TutorialStep>

        <TutorialStep
          stepNumber={3}
          title="新增標籤"
          tip="預設標籤涵蓋常見的正向和待改進行為，可直接點選使用。"
          imageSrc="/guide/images/tags-3.webp"
        >
          點擊「新增標籤」按鈕，從預設標籤列表中選擇，或輸入自訂標籤。
        </TutorialStep>

        <TutorialStep stepNumber={4} title="管理預設標籤" imageSrc="/guide/images/tags-4.webp">
          在設定中可以自訂預設標籤列表，新增或刪除不需要的標籤選項。
        </TutorialStep>

        <TutorialStep stepNumber={5} title="善用標籤提升評語品質" imageSrc="/guide/images/tags-5.webp">
          建議為每位學生設定 3-5 個標籤，涵蓋學業、品行和人際面向，讓 AI 評語更全面。
        </TutorialStep>
      </div>

      {/* Navigation hint */}
      <div className="mt-4">
        <CalloutBox type="tip" title="下一步">
          標籤設定完成後，前往
          <Link
            to="/tutorial/ai-comment"
            className={`mx-1 font-medium underline underline-offset-2 ${theme.primaryText}`}
          >
            AI 評語
          </Link>
          教學，看看標籤如何讓生成的評語更加個人化。
        </CalloutBox>
      </div>
    </div>
  );
}
