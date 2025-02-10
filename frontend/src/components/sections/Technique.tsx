"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

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
  const [beads, setBeads] = useState<Bead[]>([]);
  const [beadSize, setBeadSize] = useState(150);

  // beadSize가 변할 때 최신 값을 시뮬레이션 루프에서 사용하기 위한 ref
  const beadSizeRef = useRef(beadSize);
  useEffect(() => {
    beadSizeRef.current = beadSize;
  }, [beadSize]);

  // 마우스 위치를 저장하는 ref (컨테이너 내 좌표)
  const mousePos = useRef<{ x: number; y: number } | null>(null);

  // 컨테이너 내에서 마우스 움직임을 감지하여 mousePos 업데이트
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

  // 화면 크기에 따라 구슬 크기 조절
  useEffect(() => {
    const updateBeadSize = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setBeadSize(90); // 모바일에서는 작게
      } else if (width < 900) {
        setBeadSize(140); // 태블릿에서는 중간 크기
      } else {
        setBeadSize(170); // 데스크탑 기본 크기
      }
    };

    updateBeadSize();
    window.addEventListener("resize", updateBeadSize);
    return () => window.removeEventListener("resize", updateBeadSize);
  }, []);

  // 컨테이너 사이즈를 기준으로 구슬들을 초기 배치 (beadSize가 변할 때마다 재배치)
  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const newBeads: Bead[] = [];
    const maxAttempts = 100;

    // stackImages 배열의 길이만큼 구슬 생성 (두 배열은 1:1 매칭)
    for (let i = 0; i < stackImages.length; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < maxAttempts) {
        attempts++;
        // 컨테이너 내에서 구슬 전체가 들어갈 수 있는 영역 내에서 랜덤 배치
        const x = Math.random() * (width - beadSize);
        const y = Math.random() * (height - beadSize);
        const newBead: Bead = {
          x,
          y,
          vx: Math.random() * 0.8 - 0.4, // 아주 작고 랜덤한 속도
          vy: Math.random() * 0.8 - 0.4,
        };

        // 기존 구슬들과 겹치지 않는지 체크 (원 중심 간의 거리가 beadSize 이상이면 OK)
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
    setBeads(newBeads);
  }, [beadSize]);

  // 시뮬레이션: 매 프레임마다 구슬 위치 업데이트, 벽 충돌, 구슬 간 충돌, 그리고 마우스 반발 효과 적용
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    // 마우스 반발 효과를 위한 설정값 (원래보다 약하게 적용)
    const repulsionRadius = 100; // 마우스 근처 감지 범위 (px)
    const repulsionStrength = 0.1; // 반발력 강도 (낮게 설정)

    const update = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 16; // 약 16ms를 1 "프레임"으로 가정
      lastTime = now;

      setBeads((prevBeads) => {
        // 기존 구슬 데이터를 깊은 복사
        const newBeads = prevBeads.map((b) => ({ ...b }));

        // 컨테이너 사이즈 (매 프레임마다 갱신)
        let containerWidth = 0,
          containerHeight = 0;
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          containerWidth = rect.width;
          containerHeight = rect.height;
        }

        // 각 구슬의 위치와 속도를 업데이트
        for (let i = 0; i < newBeads.length; i++) {
          // 마우스 반발 효과 적용: 구슬 중심과 마우스 사이의 거리가 repulsionRadius 이내이면 살짝 밀어냄
          if (mousePos.current) {
            const beadCenterX = newBeads[i].x + beadSizeRef.current / 2;
            const beadCenterY = newBeads[i].y + beadSizeRef.current / 2;
            const dx = beadCenterX - mousePos.current.x;
            const dy = beadCenterY - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < repulsionRadius && dist > 0) {
              const force =
                (repulsionStrength * (repulsionRadius - dist)) /
                repulsionRadius;
              newBeads[i].vx += (dx / dist) * force;
              newBeads[i].vy += (dy / dist) * force;
            }
          }

          // 기본 이동 (속도 multiplier를 낮춰서 느리게 움직임)
          newBeads[i].x += newBeads[i].vx * dt * 1.5;
          newBeads[i].y += newBeads[i].vy * dt * 1.5;
        }

        // 벽 충돌 처리
        for (let bead of newBeads) {
          if (bead.x < 0) {
            bead.x = 0;
            bead.vx = -bead.vx;
          } else if (bead.x > containerWidth - beadSizeRef.current) {
            bead.x = containerWidth - beadSizeRef.current;
            bead.vx = -bead.vx;
          }
          if (bead.y < 0) {
            bead.y = 0;
            bead.vy = -bead.vy;
          } else if (bead.y > containerHeight - beadSizeRef.current) {
            bead.y = containerHeight - beadSizeRef.current;
            bead.vy = -bead.vy;
          }
        }

        // 구슬 간 충돌 처리 (매우 단순한 방식)
        for (let i = 0; i < newBeads.length; i++) {
          for (let j = i + 1; j < newBeads.length; j++) {
            const beadA = newBeads[i];
            const beadB = newBeads[j];
            const dx =
              beadA.x +
              beadSizeRef.current / 2 -
              (beadB.x + beadSizeRef.current / 2);
            const dy =
              beadA.y +
              beadSizeRef.current / 2 -
              (beadB.y + beadSizeRef.current / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < beadSizeRef.current && dist > 0) {
              // 간단하게 속도를 스왑하고 약간 위치 보정
              const tempVx = beadA.vx;
              const tempVy = beadA.vy;
              beadA.vx = beadB.vx;
              beadA.vy = beadB.vy;
              beadB.vx = tempVx;
              beadB.vy = tempVy;

              const overlap = beadSizeRef.current - dist;
              const adjustX = (dx / dist) * (overlap / 2);
              const adjustY = (dy / dist) * (overlap / 2);
              beadA.x += adjustX;
              beadA.y += adjustY;
              beadB.x -= adjustX;
              beadB.y -= adjustY;
            }
          }
        }

        return newBeads;
      });

      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <TechniqueSection className="min-h-screen w-full pt-[60px] flex flex-col items-center justify-center">
      <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-right pr-8">
        how we make
      </h2>
      <div
        ref={containerRef}
        className="relative w-full flex-1 overflow-x-hidden"
      >
        {beads.map((bead, index) => {
          const imageData = stackImages[index];
          return (
            <motion.div
              key={index}
              className="absolute flex items-center justify-center rounded-full shadow-lg"
              style={{
                left: bead.x,
                top: bead.y,
                width: `${beadSize}px`,
                height: `${beadSize}px`,
                border: `2.5px solid ${imageData.border}`,
              }}
            >
              <img
                src={imageData.src}
                alt="tech icon"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </TechniqueSection>
  );
}

const TechniqueSection = styled.div`
  @media (max-width: 900px) {
    padding-bottom: 50px;
  }
`;
