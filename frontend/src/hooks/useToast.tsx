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

  const showToast = (type: ToastType, message: string) => {
    toast.dismiss();
    toastIdRef.current = toast[type](message);
  };

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
      ({ closeToast }) => (
        <ConfirmToast>
          <p>
            {message.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx !== message.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
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
              >
                {cancelText}
              </button>
            )}
          </div>
        </ConfirmToast>
      ),
      { autoClose: false }
    );
  };

  return { showToast, confirmToast };
};

export default useToast;

const ConfirmToast = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-bottom: 5px;
    text-align: center;
    word-break: keep-all;
    padding-left: 5px;
  }
  div {
    display: flex;
    gap: 10px;
  }
  button {
    padding: 6px 12px;
    background-color: #333;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:nth-child(2) {
      background-color: #999;
    }

    @media (max-width: 480px) {
      padding: 3px 8px;
    }
  }
`;
