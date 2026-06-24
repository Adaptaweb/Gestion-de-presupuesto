import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Eliminar elemento?',
  itemName = '',
  itemType = 'elemento',
  message = '',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  isDeleting = false
}) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(false);
      const timer = setTimeout(() => setShowAnimation(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`
          relative bg-white dark:bg-dark-normal rounded-2xl shadow-2xl
          w-full max-w-md mx-4 overflow-hidden
          transition-all duration-300 ease-out
          ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-lighter transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Trash2 size={28} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {title}
              </h3>
              {itemName && (
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {itemName}
                </p>
              )}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
            <div className="flex gap-3">
              <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Esta acción marcará el {itemType} como eliminado.</p>
                <p className="text-amber-700 dark:text-amber-300">
                  {message || 'Podrás recuperarlo posteriormente desde la papelera.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
              bg-slate-100 dark:bg-dark-lighter text-slate-700 dark:text-slate-200
              hover:bg-slate-200 dark:hover:bg-dark-lightest
              transition-colors disabled:opacity-50
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-rose-600 hover:bg-rose-700
              disabled:bg-rose-400 disabled:cursor-not-allowed
              transition-colors flex items-center justify-center gap-2
            "
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useDeleteConfirm() {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: 'elemento',
    message: '',
    onConfirm: null
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = (options) => {
    return new Promise((resolve) => {
      setDeleteModal({
        isOpen: true,
        title: options.title || '¿Eliminar elemento?',
        itemName: options.itemName || '',
        itemType: options.itemType || 'elemento',
        message: options.message || '',
        onConfirm: () => {
          setIsDeleting(true);
          Promise.resolve(options.onConfirm?.()).finally(() => {
            setIsDeleting(false);
            setDeleteModal(prev => ({ ...prev, isOpen: false }));
            resolve(true);
          });
        }
      });
    });
  };

  const closeModal = () => {
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    return false;
  };

  return {
    deleteModal,
    isDeleting,
    confirmDelete,
    closeModal,
    DeleteModalComponent: () => (
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeModal}
        onConfirm={deleteModal.onConfirm}
        title={deleteModal.title}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
        message={deleteModal.message}
        isDeleting={isDeleting}
      />
    )
  };
}