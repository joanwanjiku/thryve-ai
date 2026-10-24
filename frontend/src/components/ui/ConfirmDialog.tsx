import { Modal } from './Modal'
import { buttonStyles } from './styles'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  isPending?: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  isPending = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-charcoal-700">{message}</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className={buttonStyles.secondary}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={isPending} className={buttonStyles.danger}>
          {isPending ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
