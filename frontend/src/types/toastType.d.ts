declare interface ToastType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  message: (message: string, duration?: number) => void;
  confirm: (
    type?: "success" | "error",
    message: string,
    onConfirm: () => Promise<void> | void,
    onCancel: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}
