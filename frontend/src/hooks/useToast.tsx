import { toast, ToastOptions } from "react-toastify";
import styled from "styled-components";
import React, { useRef } from "react";

export type ToastType = "info" | "warn" | "success" | "error";

export interface UseToast {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  confirmToast: (
    type: ToastType,
    message: string,
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

const useToast = (): UseToast => {
  const toastIdRef = useRef<string | number | null>(null);

  /**
   * showToast
   */
  const showToast = (
    type: ToastType,
    message: string,
    options: ToastOptions = {
      autoClose: 3000,
      hideProgressBar: false,
      position: "top-right",
    }
  ) => {
    toast.dismiss();
    toastIdRef.current = toast[type](message, options);
  };

  /**
   * confirmToast
   */
  const confirmToast = (
    type: ToastType,
    message: string,
    onConfirm: () => void | Promise<void>,
    onCancel?: () => void,
    confirmText = "네",
    cancelText = "아니요"
  ) => {
    toast.dismiss();

    let toastType;
    switch (type) {
      case "success":
        toastType = toast.success;
        break;
      case "warn":
        toastType = toast.warn;
        break;
      case "info":
        toastType = toast.info;
        break;
      default:
        toastType = toast.error;
    }

    toastIdRef.current = toastType(
      ({ closeToast, toastProps }) => (
        <S.ConfirmToast>
          <p>{message}</p>
          <div>
            <button
              onClick={async () => {
                await onConfirm();
                if (toastIdRef.current) {
                  toast.dismiss(toastIdRef.current);
                }
                closeToast();
              }}
            >
              {confirmText}
            </button>
            {cancelText && (
              <button
                type="button"
                onClick={() => {
                  if (onCancel) onCancel();
                  if (toastIdRef.current) {
                    toast.dismiss(toastIdRef.current);
                  }
                  closeToast();
                }}
                style={{ backgroundColor: "lightgray" }}
              >
                {cancelText}
              </button>
            )}
          </div>
        </S.ConfirmToast>
      ),
      { autoClose: false, position: "top-right" }
    );
  };

  return { showToast, confirmToast };
};

export default useToast;

const S = {
  ConfirmToast: styled.div`
    p {
      text-align: center;
      margin-left: 10px;
      word-break: keep-all;
    }
    div {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    button {
      margin: 0 8px;
      padding: 6px 12px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      &:nth-child(2) {
        background-color: lightgray;
        color: black;
      }
    }
  `,
};
