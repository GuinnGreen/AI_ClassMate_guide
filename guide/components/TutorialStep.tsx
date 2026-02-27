import { ReactNode, useState } from 'react';
import { Camera } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ImageViewer from './ImageViewer';

interface TutorialStepProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
  illustration?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  tip?: ReactNode;
}

export default function TutorialStep({
  stepNumber,
  title,
  children,
  illustration,
  imageSrc,
  imageAlt,
  tip,
}: TutorialStepProps) {
  const theme = useTheme();
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div className="mb-10">
      {/* Header: badge + title */}
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`${theme.primary} flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`}
        >
          {stepNumber}
        </span>
        <h3 className={`text-lg font-bold ${theme.text}`}>{title}</h3>
      </div>

      {/* Description */}
      <div className={`mb-4 pl-11 leading-relaxed ${theme.textLight}`}>
        {children}
      </div>

      {/* Screenshot / Illustration area */}
      <div className="pl-11">
        {illustration ? (
          <button
            type="button"
            onClick={() => setIsViewerOpen(true)}
            className="block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-md transition hover:shadow-lg focus:outline-none"
          >
            {illustration}
          </button>
        ) : imageSrc ? (
          <button
            type="button"
            onClick={() => setIsViewerOpen(true)}
            className="block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-md transition hover:shadow-lg focus:outline-none"
          >
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              loading="lazy"
              className="w-full rounded-2xl object-cover"
            />
          </button>
        ) : (
          <div
            className={`flex h-48 items-center justify-center rounded-2xl ${theme.surfaceAlt} ${theme.border} border`}
          >
            <div className="flex flex-col items-center gap-2">
              <Camera size={32} className={theme.textLight} />
              <span className={`text-sm ${theme.textLight}`}>截圖預覽區</span>
            </div>
          </div>
        )}
      </div>

      {/* Optional tip */}
      {tip && (
        <div
          className={`mt-4 ml-11 flex items-start gap-2 rounded-xl px-4 py-3 ${theme.surfaceAlt}`}
        >
          <span className="mt-0.5 shrink-0 text-base">💡</span>
          <div className={`text-sm leading-relaxed ${theme.textLight}`}>
            {tip}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isViewerOpen && (illustration || imageSrc) && (
        <ImageViewer
          src={imageSrc}
          content={illustration}
          alt={imageAlt ?? title}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
}
