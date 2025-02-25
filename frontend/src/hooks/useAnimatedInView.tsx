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
