import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import TutorialStep from '../../components/TutorialStep';
import CalloutBox from '../../components/CalloutBox';

export default function StudentManagementTutorial() {
  const theme = useTheme();

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <Users size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            學生管理
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          學習如何新增、編輯和管理您的班級學生資料。
        </p>
      </header>

      {/* Tutorial steps */}
      <div>
        <TutorialStep stepNumber={1} title="進入學生管理" imageSrc="/guide/images/student-mgmt-1.webp">
          登入後，您會看到側邊欄上方的學生列表。這是您管理所有學生的主要介面。
        </TutorialStep>

        <TutorialStep stepNumber={2} title="新增學生" imageSrc="/guide/images/student-mgmt-2.webp">
          點擊側邊欄底部的「+」按鈕，輸入學生姓名和座號後確認新增。
        </TutorialStep>

        <TutorialStep
          stepNumber={3}
          title="匯入學生名單"
          tip="CSV 格式：每行一位學生，格式為「姓名,座號」。"
          imageSrc="/guide/images/student-mgmt-3.webp"
        >
          如果要一次新增多位學生，點擊「匯入」按鈕，上傳包含學生姓名和座號的 CSV 檔案。
        </TutorialStep>

        <TutorialStep stepNumber={4} title="編輯學生資料" imageSrc="/guide/images/student-mgmt-4.webp">
          在學生詳細頁面中，點擊學生姓名旁的編輯圖示即可修改姓名或座號。
        </TutorialStep>

        <TutorialStep stepNumber={5} title="刪除學生" imageSrc="/guide/images/student-mgmt-5.webp">
          在學生詳細頁面中，向下滾動找到「刪除學生」按鈕。此操作需要重新驗證密碼。
        </TutorialStep>
      </div>

      {/* Warning callout */}
      <div className="mt-4 space-y-4">
        <CalloutBox type="warning" title="刪除操作不可復原">
          刪除學生將同時刪除該學生的所有紀錄，且無法復原。
        </CalloutBox>

        {/* Navigation hint */}
        <CalloutBox type="info" title="下一步">
          學生新增完成後，就可以開始記錄行為了！前往
          <Link
            to="/tutorial/behavior"
            className={`mx-1 font-medium underline underline-offset-2 ${theme.primaryText}`}
          >
            行為紀錄
          </Link>
          教學了解更多。
        </CalloutBox>
      </div>
    </div>
  );
}
