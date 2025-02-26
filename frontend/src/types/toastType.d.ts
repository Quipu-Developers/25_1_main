declare type ToastState = "info" | "warn" | "success" | "error";

declare interface ToastType {
  showToast: (
    type: ToastState,
    message: string,
    options?: ToastOptions
  ) => void;
  confirmToast: (
    type: ToastState,
    message: string,
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}
