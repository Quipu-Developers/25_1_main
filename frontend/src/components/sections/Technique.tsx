"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Image from "next/image";

// 각 구슬(이미지)에 대응하는 데이터
const stackImages = [
  {
    src: "https://techstack-generator.vercel.app/docker-icon.svg",
    border: "#099CEC",
  },
  {
    src: "https://techstack-generator.vercel.app/react-icon.svg",
    border: "#61dafb",
  },
  {
    src: "https://techstack-generator.vercel.app/js-icon.svg",
    border: "#f7df1f",
  },
  {
    src: "https://techstack-generator.vercel.app/ts-icon.svg",
    border: "#0276C6",
  },
  {
    src: "https://techstack-generator.vercel.app/python-icon.svg",
    border: "#FED140",
  },
  {
    src: "https://techstack-generator.vercel.app/github-icon.svg",
    border: "#000000",
  },
  {
    src: "https://techstack-generator.vercel.app/nginx-icon.svg",
    border: "#019639",
  },
  {
    src: "https://techstack-generator.vercel.app/mysql-icon.svg",
    border: "#00796b",
  },
  {
    src: "https://techstack-generator.vercel.app/java-icon.svg",
    border: "#f58219",
  },
];

type Bead = {
  x: number; // 좌측 상단 기준 x (px)
  y: number; // 좌측 상단 기준 y (px)
  vx: number; // x 방향 속도 (px/프레임 단위)
  vy: number; // y 방향 속도
};

export default function Technique() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 화면 크기에 따른 구슬 크기 (resize 시에만 state 업데이트)
  const [beadSize, setBeadSize] = useState<number | null>(null);

  // 구슬들의 물리 상태는 ref로 관리 (상태 업데이트에 의한 재렌더링 X)
  const beadsRef = useRef<Bead[]>([]);

  // 각 구슬 DOM 엘리먼트를 저장하는 ref 배열
  const beadRefs = useRef<Array<HTMLDivElement | null>>([]);

  // 컨테이너 내 마우스 위치 (마우스 반발 효과에 사용)
  const mousePos = useRef<{ x: number; y: number } | null>(null);

  // 화면 크기에 따라 구슬 크기 조절
  useEffect(() => {
    const updateBeadSize = () => {
      const width = window.innerWidth;
      let newSize;

      if (width < 500) newSize = 90;
      else if (width < 900) newSize = 140;
      else newSize = 170;

      setBeadSize((prev) => prev ?? newSize);
    };

    updateBeadSize();
    window.addEventListener("resize", updateBeadSize);
    return () => window.removeEventListener("resize", updateBeadSize);
  }, []);

  // 컨테이너 내 마우스 움직임 감지 (마우스 반발 효과)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseLeave = () => {
      mousePos.current = null;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // beadSize 변경 시 컨테이너 크기를 기준으로 구슬들을 초기 배치
  useEffect(() => {
    if (!containerRef.current || beadSize === null) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const newBeads: Bead[] = [];
    const maxAttempts = 100;

    // stackImages 개수만큼 구슬 생성 (겹치지 않게 배치)
    for (let i = 0; i < stackImages.length; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < maxAttempts) {
        attempts++;
        const x = Math.random() * (width - beadSize);
        const y = Math.random() * (height - beadSize);
        const newBead: Bead = {
          x,
          y,
          vx: Math.random() * 0.8 - 0.4,
          vy: Math.random() * 0.8 - 0.4,
        };

        let overlap = false;
        for (const bead of newBeads) {
          const dx = bead.x + beadSize / 2 - (x + beadSize / 2);
          const dy = bead.y + beadSize / 2 - (y + beadSize / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < beadSize) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          newBeads.push(newBead);
          placed = true;
        }
      }
    }
    beadsRef.current = newBeads;
    // 초기 배치 적용: 각 구슬 DOM 엘리먼트에 transform 적용
    beadRefs.current.forEach((beadEl, index) => {
      if (beadEl && newBeads[index]) {
        beadEl.style.transform = `translate(${newBeads[index].x}px, ${newBeads[index].y}px)`;
      }
    });
  }, [beadSize]);

  // requestAnimationFrame을 활용한 애니메이션 루프 (DOM 직접 업데이트)
  useEffect(() => {
    if (beadSize === null) return;

    let animationFrame: number;
    let lastTime = performance.now();
    const repulsionRadius = 100; // 마우스 감지 범위
    const repulsionStrength = 0.1; // 반발력

    const update = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 16; // 약 16ms를 1 프레임으로 가정
      lastTime = now;

      // 컨테이너 사이즈 갱신
      let containerWidth = 0,
        containerHeight = 0;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        containerWidth = rect.width;
        containerHeight = rect.height;
      }

      const beads = beadsRef.current;

      // 각 구슬의 물리 상태 업데이트
      for (let i = 0; i < beads.length; i++) {
        // 마우스 반발 효과 적용
        if (mousePos.current) {
          const beadCenterX = beads[i].x + beadSize / 2;
          const beadCenterY = beads[i].y + beadSize / 2;
          const dx = beadCenterX - mousePos.current.x;
          const dy = beadCenterY - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repulsionRadius && dist > 0) {
            const force =
              (repulsionStrength * (repulsionRadius - dist)) / repulsionRadius;
            beads[i].vx += (dx / dist) * force;
            beads[i].vy += (dy / dist) * force;
          }
        }

        // 위치 업데이트
        beads[i].x += beads[i].vx * dt * 1.3;
        beads[i].y += beads[i].vy * dt * 1.3;
      }

      // 벽 충돌 처리
      for (let i = 0; i < beads.length; i++) {
        if (beads[i].x < 0) {
          beads[i].x = 0;
          beads[i].vx = -beads[i].vx;
        } else if (beads[i].x > containerWidth - beadSize) {
          beads[i].x = containerWidth - beadSize;
          beads[i].vx = -beads[i].vx;
        }
        if (beads[i].y < 0) {
          beads[i].y = 0;
          beads[i].vy = -beads[i].vy;
        } else if (beads[i].y > containerHeight - beadSize) {
          beads[i].y = containerHeight - beadSize;
          beads[i].vy = -beads[i].vy;
        }
      }

      // 구슬 간 충돌 (매우 단순한 처리)
      for (let i = 0; i < beads.length; i++) {
        for (let j = i + 1; j < beads.length; j++) {
          const dx = beads[i].x + beadSize / 2 - (beads[j].x + beadSize / 2);
          const dy = beads[i].y + beadSize / 2 - (beads[j].y + beadSize / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < beadSize && dist > 0) {
            // 속도 스왑
            const tempVx = beads[i].vx;
            const tempVy = beads[i].vy;
            beads[i].vx = beads[j].vx;
            beads[i].vy = beads[j].vy;
            beads[j].vx = tempVx;
            beads[j].vy = tempVy;
            // 위치 보정
            const overlap = beadSize - dist;
            const adjustX = (dx / dist) * (overlap / 2);
            const adjustY = (dy / dist) * (overlap / 2);
            beads[i].x += adjustX;
            beads[i].y += adjustY;
            beads[j].x -= adjustX;
            beads[j].y -= adjustY;
          }
        }
      }

      // 각 구슬 DOM 엘리먼트의 transform 업데이트
      for (let i = 0; i < beads.length; i++) {
        const beadEl = beadRefs.current[i];
        if (beadEl) {
          beadEl.style.transform = `translate(${beads[i].x}px, ${beads[i].y}px)`;
        }
      }

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [beadSize]);

  return (
    <div className="grow flex flex-col items-center justify-center">
      <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-right pr-8 pb-8">
        how we make
      </h2>
      <div
        ref={containerRef}
        className="relative w-full flex-1 overflow-x-hidden flex justify-center items-center"
      >
        {beadSize === null ? (
          <Image
            src="/assets/loading.svg"
            alt="loading"
            width="60"
            height="60"
          />
        ) : (
          stackImages.map((imageData, index) => (
            <BeadDiv
              key={index}
              ref={(el) => {
                beadRefs.current[index] = el;
              }}
              $size={beadSize}
              $borderColor={imageData.border}
            >
              <Image
                src={imageData.src}
                alt="tech icon"
                width={beadSize * 0.9}
                height={beadSize * 0.9}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority={index === 0}
              />
            </BeadDiv>
          ))
        )}
      </div>
    </div>
  );
}

const BeadDiv = styled.div<{ $size: number; $borderColor: string }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border: 2.5px solid ${({ $borderColor }) => $borderColor};
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
