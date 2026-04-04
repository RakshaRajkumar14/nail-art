import { useEffect } from 'react';
import styles from './GlitterCursor.module.css';

export function GlitterCursor() {
  useEffect(() => {
    const colors = ['#d7a095', '#c48379', '#b47958', '#f5e6d3'];
    let particles: HTMLDivElement[] = [];

    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      particle.className = styles.glitterParticle;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      document.body.appendChild(particle);
      particles.push(particle);

      setTimeout(() => {
        particle.remove();
        particles = particles.filter(p => p !== particle);
      }, 1000);
    };

    let lastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 50) {
        createParticle(e.clientX, e.clientY);
        lastTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      particles.forEach(p => p.remove());
    };
  }, []);

  return null;
}
