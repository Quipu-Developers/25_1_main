/**
 * useAnimatedInView - 애니메이션 트리거를 위한 커스텀 훅
 *
 * 이 훅은 특정 요소가 뷰포트에 진입했는지 여부를 감지하여
 * 애니메이션 효과를 적용할 때 사용할 수 있습니다.
 *
 * 기능:
 * - `framer-motion`의 `useInView`를 활용하여 요소가 화면에 보이는지 확인
 * - `amount: 0.5`를 기본값으로 설정하여 요소의 50%가 보이면 트리거됨
 * - 애니메이션을 적용할 요소의 `ref`와 `isInView` 상태 반환
 */

"use client";

import { RefObject, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";

export function useAnimatedInView(
  options?: UseInViewOptions
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { ...options, amount: 0.5 });

  return [ref, isInView];
}
