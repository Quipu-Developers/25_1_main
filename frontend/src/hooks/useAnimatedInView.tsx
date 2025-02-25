"use client"; // Next.js(app 라우터)에서 Client Component

import { RefObject, useRef } from "react";
import { useInView, UseInViewOptions } from "framer-motion";

/**
 * 스크롤로 화면에 나타날 때마다 inView 여부를 반환하는 훅
 * @param options once: false 로 설정하면 스크롤에 들어올 때마다 반복해서 감지 가능
 */
export function useAnimatedInView(
  options?: UseInViewOptions
): [RefObject<HTMLDivElement | null>, boolean] {
  // HTMLDivElement | null 로 선언해야 합니다.
  const ref = useRef<HTMLDivElement | null>(null);

  // framer-motion 7.x 에서 제공되는 useInView
  // 오래된 버전은 이 훅이 없으니 확인 필요
  const isInView = useInView(ref, options);

  return [ref, isInView];
}
