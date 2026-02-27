import { Palette } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function ThemeSettingsTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <Palette size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            主題設定
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          自訂 ClassMate AI 的介面外觀，包括深色模式和字體大小。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="開啟設定" imageSrc="/guide/images/theme-1.webp">
          在側邊欄底部找到設定（齒輪）圖示，點擊進入設定頁面。
        </TutorialStep>

        <TutorialStep
          stepNumber={2}
          title="切換深色模式"
          tip="系統也支援午休時段自動切換深色模式。"
          imageSrc="/guide/images/theme-2.webp"
        >
          在設定頁面中找到「深色模式」開關，點擊即可切換明亮和深色主題。
        </TutorialStep>

        <TutorialStep stepNumber={3} title="調整字體大小" imageSrc="/guide/images/theme-3.webp">
          使用字體大小滑桿調整介面文字的大小，適合投影到大螢幕或近距離使用。
        </TutorialStep>

        <TutorialStep stepNumber={4} title="調整時鐘大小" imageSrc="/guide/images/theme-4.webp">
          白板模式中的時鐘大小也可以獨立調整。
        </TutorialStep>
      </div>

      {/* Tip callout */}
      <div className="mt-4">
        <CalloutBox type="tip" title="投影教學小技巧">
          在教室投影時，建議將字體調大並切換為深色模式，讓後排學生也能清楚看見畫面。
        </CalloutBox>
      </div>
    </div>
  );
}
