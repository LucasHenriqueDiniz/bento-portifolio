import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CharacterWaves } from './CharacterWaves';
import './character-styles.css';

type AboutCharacterCardProps = {
  width?: number | string;
  height?: number | string;
  enableMouseFollow?: boolean;
  enableFaceReaction?: boolean;
  enableBreathing?: boolean;
  enableTilt?: boolean;
  showWaves?: boolean;
  frontWaveInFront?: boolean;
  showFrameBorder?: boolean;
  frameColor?: string;
  backgroundText?: string;
  backgroundTextPrefix?: string;
  showBackgroundText?: boolean;
  enableWaveParallax?: boolean;
  waveBackColor?: string;
  waveFrontColor?: string;
  backgroundColor?: string;
  showBubbles?: boolean;
  bubbleColor?: string;
  className?: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function AboutCharacterCard({
  width,
  height,
  enableMouseFollow = true,
  enableFaceReaction = true,
  enableBreathing = false,
  enableTilt = false,
  showWaves = true,
  frontWaveInFront = false,
  showFrameBorder = true,
  frameColor = '#08101d',
  backgroundText = 'LUCAS',
  backgroundTextPrefix = "Hi i'm",
  showBackgroundText = true,
  enableWaveParallax = true,
  waveBackColor = '#0a1322',
  waveFrontColor = '#123047',
  backgroundColor,
  showBubbles = false,
  bubbleColor = '#2dd4bf',
  className,
}: AboutCharacterCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState('');
  const [hoverFace, setHoverFace] = useState(false);

  const partsRef = useRef<{
    svg: SVGSVGElement | null;
    eyeL: SVGGraphicsElement | null;
    eyeR: SVGGraphicsElement | null;
    lidL: SVGGraphicsElement | null;
    lidR: SVGGraphicsElement | null;
    browL: SVGGraphicsElement | null;
    browR: SVGGraphicsElement | null;
    hit: SVGGraphicsElement | null;
  } | null>(null);

  const emotionRafRef = useRef<number | null>(null);
  const eyesRafRef = useRef<number | null>(null);
  const emotionValueRef = useRef(0);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.5 });

  const breathingY = useMotionValue(0);
  const bodyTiltX = useTransform(smoothY, [0, 1], [4, -4]);
  const bodyTiltY = useTransform(smoothX, [0, 1], [-4, 4]);

  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}svgs/character.svg`)
      .then(res => res.text())
      .then(text => {
        if (active) setSvgContent(text);
      })
      .catch(() => setSvgContent(''));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!enableBreathing) {
      breathingY.set(0);
      return;
    }

    let raf = requestAnimationFrame(function tick() {
      breathingY.set(Math.sin(Date.now() / 3000) * 2);
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [breathingY, enableBreathing]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    queueMicrotask(() => {
      const svg = containerRef.current?.querySelector('svg') as SVGSVGElement | null;
      if (!svg) return;

      const q = (sel: string) => svg.querySelector<SVGGraphicsElement>(sel);
      const eyeL = q('#eye_L, #EYE_L, #eye-left');
      const eyeR = q('#eye_R, #EYE_R, #eye-right');
      const lidL = q('#palpebra_L, #eyelid_L, #palpebra-left');
      const lidR = q('#palpebra_R, #eyelid_R, #palbebra_R');
      const browL = q('#eyebrow_L, #brow_L, #eyebrown_L');
      const browR = q('#eyebrow_R, #brow_R');
      const hit = q('#face-hit-area, #face_hit, #face-hit, #hit');

      partsRef.current = { svg, eyeL, eyeR, lidL, lidR, browL, browR, hit };

      if (hit) {
        hit.setAttribute('fill', 'rgba(255,255,255,0.001)');
        hit.style.pointerEvents = 'all';
      }

      if (lidL && lidR) {
        lidL.setAttribute('opacity', '0');
        lidR.setAttribute('opacity', '0');
      }
    });
  }, [svgContent]);

  useEffect(() => {
    if (!enableMouseFollow) return;
    const loop = () => {
      const parts = partsRef.current;
      if (parts?.eyeL && parts?.eyeR) {
        const max = 6;
        const normalizedX = smoothX.get() - 0.5;
        const y = (smoothY.get() - 0.5) * 2 * max;
        const x = normalizedX < 0 ? normalizedX * 2 * max * 2.3 : normalizedX * 2 * max * 0.6;
        parts.eyeL.setAttribute('transform', `translate(${x} ${y})`);
        parts.eyeR.setAttribute('transform', `translate(${x} ${y})`);
      }
      eyesRafRef.current = requestAnimationFrame(loop);
    };

    eyesRafRef.current = requestAnimationFrame(loop);
    return () => {
      if (eyesRafRef.current) cancelAnimationFrame(eyesRafRef.current);
      eyesRafRef.current = null;
    };
  }, [enableMouseFollow, smoothX, smoothY]);

  useEffect(() => {
    if (!enableMouseFollow && !enableFaceReaction) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      if (enableMouseFollow) {
        mouseX.set(x);
        mouseY.set(y);
      }

      if (!enableFaceReaction) return;

      const parts = partsRef.current;
      const svg = parts?.svg;
      const hit = parts?.hit;
      if (!svg || !hit || !svg.viewBox) return;

      const hitRect = hit.getBBox();
      const triggerScale = 0.45;
      const triggerWidth = hitRect.width * triggerScale;
      const triggerHeight = hitRect.height * triggerScale;
      const triggerX = hitRect.x + (hitRect.width - triggerWidth) / 2;
      const triggerY = hitRect.y + (hitRect.height - triggerHeight) / 2 + 80;
      const sx = svg.viewBox.baseVal.width / rect.width;
      const sy = svg.viewBox.baseVal.height / rect.height;
      const svgX = (e.clientX - rect.left) * sx;
      const svgY = (e.clientY - rect.top) * sy;

      const inside =
        svgX >= triggerX &&
        svgX <= triggerX + triggerWidth &&
        svgY >= triggerY &&
        svgY <= triggerY + triggerHeight;

      setHoverFace(prev => (prev === inside ? prev : inside));
    };

    const onLeave = () => setHoverFace(false);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('blur', onLeave);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [enableFaceReaction, enableMouseFollow, mouseX, mouseY]);

  useEffect(() => {
    if (!enableFaceReaction) return;
    const parts = partsRef.current;
    if (!parts?.lidL || !parts?.lidR || !parts?.browL || !parts?.browR) return;

    const { lidL, lidR, browL, browR } = parts;
    if (emotionRafRef.current) cancelAnimationFrame(emotionRafRef.current);

    const from = emotionValueRef.current;
    const to = hoverFace ? 1 : 0;
    const duration = 220;
    let start: number | null = null;

    const step = (time: number) => {
      if (!start) start = time;
      const p = Math.min((time - start) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      const k = lerp(from, to, eased);
      emotionValueRef.current = k;

      const lidY = 3 * k;
      const lidOpacity = lerp(0, 1, k);
      lidL.setAttribute('opacity', String(lidOpacity));
      lidR.setAttribute('opacity', String(lidOpacity));
      lidL.setAttribute('transform', `translate(0 ${lidY})`);
      lidR.setAttribute('transform', `translate(0 ${lidY})`);

      const browY = 8 * k;
      const browRotL = -12 * k;
      const browRotR = 16 * k;
      const boxL = browL.getBBox();
      const boxR = browR.getBBox();

      browL.setAttribute(
        'transform',
        `translate(0 ${browY}) rotate(${browRotL} ${(boxL.x + boxL.width / 2).toFixed(2)} ${(boxL.y + boxL.height / 2).toFixed(2)})`
      );
      browR.setAttribute(
        'transform',
        `translate(0 ${browY}) rotate(${browRotR} ${(boxR.x + boxR.width / 2).toFixed(2)} ${(boxR.y + boxR.height / 2).toFixed(2)})`
      );

      if (p < 1) {
        emotionRafRef.current = requestAnimationFrame(step);
      } else {
        emotionRafRef.current = null;
      }
    };

    emotionRafRef.current = requestAnimationFrame(step);

    return () => {
      if (emotionRafRef.current) cancelAnimationFrame(emotionRafRef.current);
      emotionRafRef.current = null;
    };
  }, [enableFaceReaction, hoverFace]);

  const svgElement = useMemo(() => {
    if (!svgContent) return null;
    return <div className="character-svg-host" dangerouslySetInnerHTML={{ __html: svgContent }} />;
  }, [svgContent]);

  return (
    <motion.div
      ref={containerRef}
      role="img"
      aria-label="Interactive character illustration that reacts to mouse movement"
      className={`character-root ${showFrameBorder ? '' : 'no-frame'} ${className ?? ''}`.trim()}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...(backgroundColor ? { background: backgroundColor } : {}),
        ...(showFrameBorder ? { background: frameColor, padding: 16 } : { padding: 0 }),
        y: enableBreathing ? breathingY : 0,
        rotateX: enableTilt ? bodyTiltX : 0,
        rotateY: enableTilt ? bodyTiltY : 0,
      }}
    >
      <div className="character-stage">
        {showWaves && (
          <CharacterWaves
            enableParallax={enableWaveParallax}
            backColor={waveBackColor}
            frontColor={waveFrontColor}
            showBack
            showFront={!frontWaveInFront}
            frontOnTop={false}
            verticalOffset={56}
          />
        )}
        {showBackgroundText ? (
          <div className="character-bg-text" aria-hidden="true">
            <span className="small">{backgroundTextPrefix}</span>
            <span className="big">{backgroundText}</span>
          </div>
        ) : null}
        {showBubbles && (
          <div className="bubbles-wrap" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="bubble"
                aria-hidden="true"
                style={{
                  left: `${12 + i * 11}%`,
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: `${4 + (i % 3)}s`,
                  background: bubbleColor,
                }}
              />
            ))}
          </div>
        )}
        {svgElement}
        {showWaves && frontWaveInFront && (
          <CharacterWaves
            enableParallax={enableWaveParallax}
            backColor={waveBackColor}
            frontColor={waveFrontColor}
            showBack={false}
            showFront
            frontOnTop
            verticalOffset={56}
          />
        )}
      </div>
    </motion.div>
  );
}
