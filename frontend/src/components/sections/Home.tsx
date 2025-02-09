import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Home() {
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, { once: false, amount: 0.5 });

  return (
    <div
      ref={svgRef}
      className="flex items-center justify-center h-screen relative"
    >
      <div className="absolute w-full flex justify-between top-0 p-[15px] text-[#898989]">
        <p>University of Seoul Computer Club</p>
        <p>QUIPU</p>
      </div>

      <motion.svg
        width="80%"
        viewBox="-50 -50 768 757"
        style={{ maxWidth: "600px", overflow: "visible" }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }}
      >
        {/* 왼쪽 괄호 애니메이션 */}
        <motion.use
          href={`/assets/logo.svg#left-part`}
          variants={{
            hidden: { opacity: 0, x: 0, scaleX: 1 },
            visible: { opacity: 1, x: [0, -70, 0], scaleX: [1, 1.05, 1] },
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        {/* 오른쪽 괄호 애니메이션 */}
        <motion.use
          href={`/assets/logo.svg#right-part`}
          variants={{
            hidden: { opacity: 0, x: 0, scaleX: 1 },
            visible: { opacity: 1, x: [0, 70, 0], scaleX: [1, 1.05, 1] },
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        {/* 가운데 파란색 선 애니메이션 */}
        <motion.use
          href={`/assets/logo.svg#bottom-part`}
          variants={{
            hidden: { opacity: 0, scaleX: 0 },
            visible: { opacity: [0, 1, 0.9, 1], scaleX: [0, 1.2, 1] },
          }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>
    </div>
  );
}
