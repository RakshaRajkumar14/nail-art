import { useEffect, useRef } from 'react';
import styles from './SparkleEffect.module.css';

type ParticleType = 'dot' | 'flare';

interface RoseGoldParticle {
  x: number;
  y: number;
  baseSize: number;
  size: number;
  driftX: number;
  driftY: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
  type: ParticleType;
  rotation: number;
  rotationSpeed: number;
}

export function SparkleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setCanvasSize, 100);
    };
    window.addEventListener('resize', handleResize);

    // Rose gold, blush, soft champagne, and bright white colors
    const colors = [
      '#F4E0DD', // very soft blush white
      '#E6C2BF', // light rose gold
      '#DDA7A5', // deeper rose gold
      '#F5D0C5', // soft warm peach/pink
      '#FFFFFF', // pure white for bright centers
      '#C5837B'  // dark copper/rose for depth
    ];
    
    const particles: RoseGoldParticle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const rand = Math.random();
      let type: ParticleType = 'dot';
      let baseSize = Math.random() * 2 + 1;
      
      // 40% are glowing lens flare stars
      if (rand > 0.6) {
        type = 'flare';
        baseSize = Math.random() * 15 + 10; // flares are larger, representing the whole star width
      } else if (rand < 0.2) {
        // large background bokeh dots
        baseSize = Math.random() * 8 + 4;
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseSize,
        size: baseSize,
        driftX: (Math.random() - 0.5) * 0.4,
        driftY: (Math.random() - 0.5) * 0.4 - 0.1, // Drifting upwards very softly
        baseOpacity: type === 'flare' ? Math.random() * 0.6 + 0.4 : Math.random() * 0.4 + 0.1,
        opacity: 0,
        pulseSpeed: type === 'flare' ? Math.random() * 0.03 + 0.01 : Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        rotation: Math.random() * Math.PI / 2, // initial random rotation
        rotationSpeed: (Math.random() - 0.5) * 0.01, // gentle rot
      });
    }

    let animationId: number;
    let time = 0;

    // Helper to extract rgb from hex to use in rgba for gradients
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '255, 255, 255';
    };

    const drawFlare = (cx: number, cy: number, size: number, colorHex: string, alpha: number, rotation: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      
      const rgb = hexToRgb(colorHex);

      // Create a composite operation for that bright glowing "light" effect
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = alpha;

      // Draw horizontal cross length (long spike)
      const gradX = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradX.addColorStop(0, `rgba(${rgb}, 1)`);
      gradX.addColorStop(0.1, `rgba(${rgb}, 0.8)`);
      gradX.addColorStop(1, `rgba(${rgb}, 0)`);

      ctx.fillStyle = gradX;
      // Ellipse for X axis spike
      ctx.beginPath();
      // Using bezier curves to create sharp diamond/tapered flares
      ctx.moveTo(0, -size * 0.1);
      ctx.bezierCurveTo(size * 0.2, -size * 0.05, size * 0.8, -size * 0.02, size, 0);
      ctx.bezierCurveTo(size * 0.8, size * 0.02, size * 0.2, size * 0.05, 0, size * 0.1);
      ctx.bezierCurveTo(-size * 0.2, size * 0.05, -size * 0.8, size * 0.02, -size, 0);
      ctx.bezierCurveTo(-size * 0.8, -size * 0.02, -size * 0.2, -size * 0.05, 0, -size * 0.1);
      ctx.fill();

      // Draw vertical cross length (long spike)
      const gradY = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      gradY.addColorStop(0, `rgba(${rgb}, 1)`);
      gradY.addColorStop(0.1, `rgba(${rgb}, 0.8)`);
      gradY.addColorStop(1, `rgba(${rgb}, 0)`);
      
      ctx.fillStyle = gradY;
      ctx.beginPath();
      ctx.moveTo(-size * 0.1, 0);
      ctx.bezierCurveTo(-size * 0.05, size * 0.2, -size * 0.02, size * 0.8, 0, size);
      ctx.bezierCurveTo(size * 0.02, size * 0.8, size * 0.05, size * 0.2, size * 0.1, 0);
      ctx.bezierCurveTo(size * 0.05, -size * 0.2, size * 0.02, -size * 0.8, 0, -size);
      ctx.bezierCurveTo(-size * 0.02, -size * 0.8, -size * 0.05, -size * 0.2, -size * 0.1, 0);
      ctx.fill();

      // Diagonal minor spikes (shorter)
      const minorSize = size * 0.6;
      ctx.rotate(Math.PI / 4); // 45 degrees
      ctx.fillStyle = gradX; // reuse gradient since it scales with context, but we will limit path
      ctx.beginPath();
      ctx.moveTo(0, -minorSize * 0.1);
      ctx.bezierCurveTo(minorSize * 0.2, -minorSize * 0.05, minorSize * 0.8, -minorSize * 0.02, minorSize, 0);
      ctx.bezierCurveTo(minorSize * 0.8, minorSize * 0.02, minorSize * 0.2, minorSize * 0.05, 0, minorSize * 0.1);
      ctx.bezierCurveTo(-minorSize * 0.2, minorSize * 0.05, -minorSize * 0.8, minorSize * 0.02, -minorSize, 0);
      ctx.bezierCurveTo(-minorSize * 0.8, -minorSize * 0.02, -minorSize * 0.2, -minorSize * 0.05, 0, -minorSize * 0.1);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-minorSize * 0.1, 0);
      ctx.bezierCurveTo(-minorSize * 0.05, minorSize * 0.2, -minorSize * 0.02, minorSize * 0.8, 0, minorSize);
      ctx.bezierCurveTo(minorSize * 0.02, minorSize * 0.8, minorSize * 0.05, minorSize * 0.2, minorSize * 0.1, 0);
      ctx.bezierCurveTo(minorSize * 0.05, -minorSize * 0.2, minorSize * 0.02, -minorSize * 0.8, 0, -minorSize);
      ctx.bezierCurveTo(-minorSize * 0.02, -minorSize * 0.8, -minorSize * 0.05, -minorSize * 0.2, -minorSize * 0.1, 0);
      ctx.fill();

      // Finally, central brilliant core glow
      ctx.rotate(-Math.PI / 4); // reset minor rotation
      const coreSize = size * 0.25;
      const gradCore = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
      gradCore.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white hot center
      gradCore.addColorStop(0.3, `rgba(${rgb}, 0.9)`);
      gradCore.addColorStop(1, `rgba(${rgb}, 0)`);
      
      ctx.beginPath();
      ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = gradCore;
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.driftX + Math.sin(time * 0.01 + p.pulseOffset) * 0.1;
        p.y += p.driftY;
        p.rotation += p.rotationSpeed;

        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        if (p.y < -30) p.y = canvas.height + 30;
        if (p.y > canvas.height + 30) p.y = -30;

        // Intense glittering pulse
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
        const normalizedPulse = (pulse + 1) / 2; 
        p.opacity = p.baseOpacity + (normalizedPulse * 0.5);
        if (p.opacity > 1) p.opacity = 1;

        p.size = p.baseSize + (normalizedPulse * (p.type === 'flare' ? 10 : 2));

        if (p.type === 'flare') {
          drawFlare(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else {
          // Standard luminous dot / bokeh
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.globalCompositeOperation = 'screen';
          
          const rgb = hexToRgb(p.color);
          const gradDot = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradDot.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          gradDot.addColorStop(0.2, `rgba(${rgb}, 0.8)`);
          gradDot.addColorStop(1, `rgba(${rgb}, 0)`);
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = gradDot;
          ctx.fill();
          ctx.restore();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.sparkleCanvas} aria-hidden="true" />;
}
