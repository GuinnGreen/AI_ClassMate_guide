import { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ImageViewerProps {
  src?: string;
  alt: string;
  content?: ReactNode;
  onClose: () => void;
}

export default function ImageViewer({ src, alt, content, onClose }: ImageViewerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
        aria-label="關閉"
      >
        <X size={24} />
      </button>

      {/* Content or Image */}
      {content ? (
        <div
          className="max-h-[90vh] max-w-5xl overflow-auto rounded-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      ) : src ? (
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-5xl rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      ) : null}
    </div>,
    document.body,
  );
}
