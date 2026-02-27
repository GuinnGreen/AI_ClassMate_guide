import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import CalloutBox from '../components/CalloutBox';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'ClassMate AI 是免費的嗎？',
    answer:
      '是的！ClassMate AI 目前完全免費使用，包括所有功能和 AI 評語生成。',
  },
  {
    question: '我的資料安全嗎？',
    answer:
      '所有資料都儲存在 Google Firebase 雲端服務中，使用業界標準的加密技術保護。每位教師只能存取自己的班級資料。',
  },
  {
    question: '一個帳號可以管理多個班級嗎？',
    answer:
      '目前每個帳號對應一個班級。如果需要管理多個班級，建議使用不同的電子郵件分別註冊。',
  },
  {
    question: 'AI 評語需要花多少時間生成？',
    answer:
      '通常在 5-15 秒內即可完成。如果伺服器繁忙，可能需要稍等一下再重試。',
  },
  {
    question: '可以修改 AI 生成的評語嗎？',
    answer:
      '當然可以！AI 生成的評語僅供參考，您可以自由編輯修改，使其更符合您的風格和需求。',
  },
  {
    question: '忘記密碼怎麼辦？',
    answer:
      '在登入頁面點擊「忘記密碼」，輸入您的註冊信箱，系統會發送密碼重設郵件。',
  },
  {
    question: '支援哪些瀏覽器？',
    answer:
      '建議使用最新版的 Chrome、Safari 或 Edge 瀏覽器。系統在手機和平板上也能正常使用。',
  },
  {
    question: '學期封存後可以查看舊資料嗎？',
    answer:
      '封存的資料會被清除，因此建議在封存前先匯出 CSV 備份。',
  },
  {
    question: '如何回報問題或建議功能？',
    answer:
      '歡迎透過系統內的回饋功能或直接聯繫開發團隊。我們非常重視每一位老師的意見。',
  },
  {
    question: '課表辨識不準確怎麼辦？',
    answer:
      '請確保上傳的圖片清晰、光線充足。如果辨識結果不理想，可以手動修正或重新上傳更清楚的圖片。',
  },
];

export default function FaqPage() {
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      {/* Page header */}
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.surfaceAccent}`}
          >
            <HelpCircle size={22} className={theme.primaryText} />
          </div>
          <h1 className={`text-2xl font-bold sm:text-3xl ${theme.text}`}>
            常見問題
          </h1>
        </div>
        <p className={`max-w-xl leading-relaxed ${theme.textLight}`}>
          找到您在使用 ClassMate AI 時可能遇到的問題解答。
        </p>
      </header>

      {/* FAQ accordion */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border ${theme.border} ${theme.surface}`}
            >
              {/* Question bar */}
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:${theme.surfaceAlt}`}
              >
                <span className={`font-medium ${theme.text}`}>
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 transition-transform duration-200 ${theme.textLight} ${
                    isExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Answer area with smooth transition */}
              <div
                className="transition-all duration-200 ease-in-out"
                style={{
                  maxHeight: isExpanded ? '200px' : '0px',
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div
                  className={`border-t ${theme.border} px-5 py-4`}
                >
                  <p className={`leading-relaxed ${theme.textLight}`}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom callout */}
      <div className="mt-8">
        <CalloutBox type="info">
          還有其他問題嗎？歡迎聯繫我們的開發團隊。
        </CalloutBox>
      </div>
    </div>
  );
}
