import { AlertTriangleIcon, XIcon } from "lucide-react";

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning" // "warning", "danger", "info"
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-error/10",
          iconColor: "text-error",
          confirmBtn: "btn-error"
        };
      case "info":
        return {
          iconBg: "bg-info/10",
          iconColor: "text-info",
          confirmBtn: "btn-info"
        };
      default: // warning
        return {
          iconBg: "bg-warning/10",
          iconColor: "text-warning",
          confirmBtn: "btn-warning"
        };
    }
  };

  const styles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${styles.iconBg}`}>
              <AlertTriangleIcon className={`size-5 ${styles.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-base-content">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-base-content/80">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-base-300">
          <button 
            onClick={onClose}
            className="btn btn-ghost"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`btn ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;