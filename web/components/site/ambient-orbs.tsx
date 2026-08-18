// Partículas de luz flutuando no fundo da página inteira — parte da
// atmosfera "vidro etéreo", não de uma seção específica. Puramente
// decorativo (aria-hidden), CSS-only (sem JS), leve o suficiente para
// rodar em qualquer dispositivo sem impacto de performance perceptível.
export function AmbientOrbs() {
  const orbs = [
    { size: 180, top: "12%", left: "6%", tone: "gold", anim: "animate-drift-a", duration: "" },
    { size: 120, top: "60%", left: "88%", tone: "sage", anim: "animate-drift-b", duration: "" },
    { size: 90, top: "30%", left: "92%", tone: "gold", anim: "animate-drift-a", duration: "" },
    { size: 140, top: "80%", left: "15%", tone: "gold", anim: "animate-drift-b", duration: "" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-sm opacity-50 ${orb.anim}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background:
              orb.tone === "gold"
                ? "radial-gradient(circle, rgba(201,168,118,0.35), transparent 70%)"
                : "radial-gradient(circle, rgba(124,143,115,0.3), transparent 70%)",
          }}
        />
      ))}
    </div>
  );
}
