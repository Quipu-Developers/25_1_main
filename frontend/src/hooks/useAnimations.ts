"use client";

import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const textLineVariants = (direction: "left" | "right"): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.85,
    x: direction === "left" ? -15 : 15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: [0.33, 1, 0.68, 1],
    },
  },
});
