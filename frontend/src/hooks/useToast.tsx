/**
 * useToast - React Toast 메시지 및 확인 대화 상자를 제공하는 커스텀 훅
 *
 * 이 훅은 `react-toastify`를 활용하여 알림 메시지(toast)와
 * 확인 대화 상자(confirm toast)를 간편하게 사용할 수 있도록 합니다.
 *
 * 기능:
 * - `showToast` : 일반 알림 메시지를 표시
 * - `confirmToast` : 사용자의 확인/취소 입력을 받는 대화 상자 표시
 * - `\n`이 포함된 메시지에 대해 자동으로 줄바꿈 처리
 * - `toast.dismiss()`를 호출하여 기존 토스트를 제거 후 새 토스트 표시
 */

"use client";

import { toast } from "react-toastify";
import styled from "styled-components";
import React, { useRef } from "react";

const toastMethodMap: Record<ToastState, typeof toast.info> = {
  success: toast.success,
  warn: toast.warn,
  info: toast.info,
  error: toast.error,
};

const useToast = (): ToastType => {
  const toastIdRef = useRef<string | number | null>(null);

  // 일반 토스트
  const showToast: ToastType["showToast"] = (type, message, options) => {
    toast.dismiss();
    toastIdRef.current = toastMethodMap[type](message, options);
  };

  // confirm 토스트
  const confirmToast: ToastType["confirmToast"] = (
    type,
    message,
    onConfirm,
    onCancel,
    confirmText = "확인",
    cancelText = "취소"
  ) => {
    toast.dismiss();

    toastIdRef.current = toastMethodMap[type](
      ({ closeToast }: { closeToast: () => void }) => (
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
