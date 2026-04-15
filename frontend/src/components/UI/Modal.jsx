import Button from "./Button";

export default function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
      />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transform transition-all">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="text-xl font-bold text-gray-900 tracking-tight">{title}</div>
            <div className="text-[13px] text-gray-400 mt-1">Press Esc to close</div>
          </div>
          <Button variant="ghost" onClick={onClose} className="py-2">
            Close
          </Button>
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">{footer}</div> : null}
      </div>
    </div>
  );
}
