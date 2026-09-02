import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 sidebar-overlay animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`
          bg-white w-full ${maxWidth} animate-slide-up overflow-hidden
          /* Mobile: bottom-sheet style */
          rounded-t-2xl sm:rounded-2xl
          /* Mobile: max height so form is scrollable on small screens */
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
          shadow-2xl
        `}
      >
        {/* Handle bar for mobile bottom-sheet UX */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-silver-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-silver-200 flex-shrink-0">
          <h2 className="text-base font-bold text-navy-950">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-silver-200 transition-colors text-silver-500 hover:text-navy-950 -mr-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="px-5 py-5 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
