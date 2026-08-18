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
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-brand-600"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: isHovering ? 8 : 10, height: isHovering ? 8 : 10 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-brand-400/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: isHovering ? 52 : 32, height: isHovering ? 52 : 32, opacity: isHovering ? 0.8 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
