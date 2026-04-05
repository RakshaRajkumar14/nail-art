import { useEffect, useRef } from 'react';

export function StardustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let trail: TrailPoint[] = [];

    // Holographic & Chrome Palette: Lavender, Soft Pink, Chrome Gold, Glossy White
    const colors = ['#E6E6FA', '#FFD1DC', '#D4AF37', '#FDFBF7'];

    class TrailPoint {
      x: number;
      y: number;
      age: number;
      maxAge: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.maxAge = 40; // How long the brush stroke lasts
      }
    }

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      baseOpacity: number;
      isDiamond: boolean;
      rotation: number;
      rotationSpeed: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1; // Slightly larger for diamonds
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.5 - 0.1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseOpacity = Math.random() * 0.5 + 0.3;
        this.opacity = this.baseOpacity;
        this.isDiamond = Math.random() > 0.6; // 40% chance of being a rhinestone
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update(canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number) {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y < -10) {
          this.y = canvasHeight + 10;
          this.x = Math.random() * canvasWidth;
        }
        if (this.x < -10) this.x = canvasWidth + 10;
        if (this.x > canvasWidth + 10) this.x = -10;

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          this.x -= dx * 0.015;
          this.y -= dy * 0.015;
          this.opacity = Math.min(1, this.baseOpacity + 0.4);
          this.rotationSpeed += 0.01; // Spin rhinestones when touched
        } else {
          this.opacity = this.baseOpacity;
          this.rotationSpeed = this.rotationSpeed > 0.02 ? this.rotationSpeed * 0.95 : this.rotationSpeed;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if (this.isDiamond) {
          // Draw Rhinestone (Diamond)
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 1.5);
          ctx.lineTo(this.size, 0);
          ctx.lineTo(0, this.size * 1.5);
          ctx.lineTo(-this.size, 0);
          ctx.closePath();
          
          // Add a tiny white center highlight for extra gloss
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = this.opacity * 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw normal round glitter
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const init = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 7000), 100);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw glossy brush stroke trail
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length - 1; i++) {
          const xc = (trail[i].x + trail[i + 1].x) / 2;
          const yc = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }
        
        // Gradient for glossy topcoat look
        ctx.lineWidth = 40;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(255, 209, 220, 0.0)'); // Soft pink fade
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)'); // Glossy white center
        
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // Second inner layer for high gloss
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();
      }

      // Update and shrink age of trail dots
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > trail[i].maxAge) {
          trail.splice(i, 1);
        }
      }

      // Draw rhinestones
      for (const particle of particles) {
        particle.update(canvas.width, canvas.height, mouseX, mouseY);
        particle.draw(ctx);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      trail.push(new TrailPoint(mouseX, mouseY));
      if (trail.length > 25) trail.shift();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      trail = [];
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicking through to the content
        zIndex: 9999, // Float over EVERYTHING on the page!
        opacity: 0.9,
      }}
    />
  );
}
