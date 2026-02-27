import { FileDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function CsvExportTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <FileDown size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            匯出報表
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          將學生的行為紀錄匯出為 CSV 檔案，方便匯入其他系統或備份。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="進入匯出功能" imageSrc="/guide/images/csv-export-1.webp">
          在側邊欄設定中找到「匯出」選項。
        </TutorialStep>

        <TutorialStep stepNumber={2} title="選擇匯出範圍" imageSrc="/guide/images/csv-export-2.webp">
          可以選擇匯出全班或個別學生的紀錄，以及指定日期範圍。
        </TutorialStep>

        <TutorialStep
          stepNumber={3}
          title="匯出 CSV 檔案"
          tip="CSV 檔案可以用 Excel 或 Google 試算表開啟。"
          imageSrc="/guide/images/csv-export-3.webp"
        >
          點擊「匯出」按鈕，系統會生成包含學生姓名、座號、分數、行為紀錄等資訊的 CSV 檔案。
        </TutorialStep>

        <TutorialStep stepNumber={4} title="檢查匯出內容" imageSrc="/guide/images/csv-export-4.webp">
          下載完成後，建議開啟檔案確認內容正確。
        </TutorialStep>
      </div>

      {/* Info callout */}
      <div className="mt-4">
        <CalloutBox type="info" title="定期備份">
          建議每月匯出一次資料作為備份，尤其在學期封存前務必先匯出完整紀錄。
        </CalloutBox>
      </div>
    </div>
  );
}
