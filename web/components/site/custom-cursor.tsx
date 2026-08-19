"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Cursor customizado: uma bolinha verde que segue o ponteiro, com um anel
// externo que "atrasa" levemente (spring) para dar sensação orgânica de
// movimento, crescendo sobre elementos clicáveis. Só ativa em dispositivos
// com mouse de verdade (hover: hover e pointer: fine) — em touch, o cursor
// nativo do sistema continua intacto, então mobile nunca é afetado.
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 300, mass: 0.4 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 300, mass: 0.4 });

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsFinePointer) return;
    setEnabled(true);

    function handleMove(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }

    function handleOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button, input, textarea, select, [role='button']"));
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
    };
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          body, a, button, input, textarea, select {
            cursor: none !important;
          }
        }
      `}</style>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle at 32% 28%, #A9E0A6 0%, #5B9A5F 55%, #2B3428 100%)",
          boxShadow: "0 0 14px 3px rgba(91,154,95,0.6), 0 0 3px rgba(255,255,255,0.8) inset",
        }}
        animate={{ width: isHovering ? 10 : 12, height: isHovering ? 10 : 12 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "rgba(168,135,79,0.55)",
          boxShadow: "0 0 10px rgba(168,135,79,0.18)",
        }}
        animate={{ width: isHovering ? 54 : 34, height: isHovering ? 54 : 34, opacity: isHovering ? 0.85 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
