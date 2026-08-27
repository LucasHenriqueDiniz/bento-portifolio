import { useEffect, useState } from 'react';

type CharacterWavesProps = {
  enableParallax?: boolean;
  backColor?: string;
  frontColor?: string;
  showBack?: boolean;
  showFront?: boolean;
  frontOnTop?: boolean;
  verticalOffset?: number;
};

export function CharacterWaves({
  enableParallax = true,
  backColor = '#6d5dfc',
  frontColor = '#8a7dff',
  showBack = true,
  showFront = true,
  frontOnTop = false,
  verticalOffset = 48,
}: CharacterWavesProps) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!enableParallax) return;
    const onPointerMove = (event: PointerEvent) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      setMouse({
        x: Math.max(0, Math.min(1, event.clientX / vw)),
        y: Math.max(0, Math.min(1, event.clientY / vh)),
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [enableParallax]);

  const xBack = (mouse.x - 0.5) * 14;
  const yBack = (mouse.y - 0.5) * 8;
  const xFront = (mouse.x - 0.5) * 24;
  const yFront = (mouse.y - 0.5) * 12;

  return (
    <div className={`waves-wrap ${frontOnTop ? 'front-layer' : ''}`.trim()} aria-hidden="true">
      {showBack ? (
        <div
          className="wave back"
          style={{
            transform: `translate(${enableParallax ? xBack : 0}px, ${(enableParallax ? yBack : 0) + verticalOffset}px)`,
            backgroundColor: backColor,
          }}
        />
      ) : null}
      {showFront ? (
        <div
          className={`wave front ${frontOnTop ? 'on-top' : ''}`.trim()}
          style={{
            transform: `translate(${enableParallax ? xFront : 0}px, ${(enableParallax ? yFront : 0) + verticalOffset}px)`,
            backgroundColor: frontColor,
          }}
        />
      ) : null}
    </div>
  );
}
