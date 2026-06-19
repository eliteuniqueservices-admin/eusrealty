"use client";

import { useEffect, useRef } from 'react';

// --- Snow Particle System with Parallax Depth & Radial Glow + Shadows ---
class SnowParticle {
  constructor(width, height) {
    this.reset(width, height, true);
  }

  reset(width, height, init = false) {
    this.x = Math.random() * width;
    this.y = init ? Math.random() * height : -15;
    
    // Parallax layering: larger flakes are closer, move faster, and are more visible
    const layer = Math.random();
    if (layer > 0.85) {
      // Foreground: large, fast, slightly blurry
      this.size = Math.random() * 2.5 + 4.0; // 4.0px to 6.5px
      this.speedY = Math.random() * 1.5 + 1.6;
      this.opacity = Math.random() * 0.3 + 0.65; // 0.65 to 0.95
    } else if (layer > 0.5) {
      // Midground: medium size and speed
      this.size = Math.random() * 1.5 + 2.2; // 2.2px to 3.7px
      this.speedY = Math.random() * 0.8 + 0.9;
      this.opacity = Math.random() * 0.3 + 0.5; // 0.5 to 0.8
    } else {
      // Background: tiny, slow, faint
      this.size = Math.random() * 1.0 + 1.0; // 1.0px to 2.0px
      this.speedY = Math.random() * 0.4 + 0.4;
      this.opacity = Math.random() * 0.2 + 0.35; // 0.35 to 0.55
    }

    this.speedX = Math.random() * 0.4 - 0.2;
    this.density = Math.random() * 30;
  }

  update(width, height, time) {
    this.y += this.speedY;
    // Drifting motion using a sine wave
    this.x += this.speedX + Math.sin(time / 20 + this.density) * 0.45;

    if (this.y > height + 10) {
      this.reset(width, height);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    
    // Soft radial glow for realistic fluffy snow, tinted slightly blue-white
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(0.5, `rgba(235, 243, 255, ${this.opacity * 0.85})`);
    gradient.addColorStop(1, 'rgba(235, 243, 255, 0)');
    
    // Shadow fallback to ensure flakes are visible against white backgrounds
    ctx.shadowColor = 'rgba(15, 23, 42, 0.28)';
    ctx.shadowBlur = this.size * 0.9;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// --- Rain Particle, Ripple & Splash System with Darker Slate Color ---
class RainParticle {
  constructor(width, height) {
    this.reset(width, height, true);
  }

  reset(width, height, init = false) {
    this.x = Math.random() * width;
    this.y = init ? Math.random() * height : -50;
    
    // Parallax layering for depth
    const layer = Math.random();
    if (layer > 0.8) {
      // Foreground: thick, long, extremely fast, darker/more visible
      this.length = Math.random() * 12 + 24; // 24px to 36px
      this.speedY = Math.random() * 6 + 18;  // 18 to 24 px/frame
      this.lineWidth = 1.6;
      this.opacity = Math.random() * 0.25 + 0.35; // 0.35 to 0.6 opacity
    } else if (layer > 0.45) {
      // Midground: normal rain
      this.length = Math.random() * 8 + 16;  // 16px to 24px
      this.speedY = Math.random() * 5 + 13;  // 13 to 18 px/frame
      this.lineWidth = 1.1;
      this.opacity = Math.random() * 0.2 + 0.25; // 0.25 to 0.45 opacity
    } else {
      // Background: thin, short, slower, more transparent
      this.length = Math.random() * 6 + 10;  // 10px to 16px
      this.speedY = Math.random() * 4 + 9;   // 9 to 13 px/frame
      this.lineWidth = 0.7;
      this.opacity = Math.random() * 0.15 + 0.15; // 0.15 to 0.3 opacity
    }
    
    this.speedX = -1.2 - (this.speedY * 0.05); // wind drift
  }

  update(width, height, splashes, splashDroplets) {
    this.y += this.speedY;
    this.x += this.speedX;

    // Splash when hitting ground
    if (this.y > height - 12) {
      if (Math.random() > 0.2) {
        // Render ripple rings
        splashes.push(new RainSplash(this.x, height - Math.random() * 10));
        
        // Spawn bounce droplets
        if (this.lineWidth >= 1.1) {
          splashDroplets.push(new SplashDroplet(this.x, height - 8, this.speedX));
          splashDroplets.push(new SplashDroplet(this.x, height - 8, -this.speedX));
        }
      }
      this.reset(width, height);
    }
  }

  draw(ctx) {
    // Speed-tapered slate-blue gradient trails (perfectly visible on light/white background)
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x + this.speedX, this.y + this.length
    );
    gradient.addColorStop(0, 'rgba(71, 85, 105, 0)'); // Slate 600 transparent
    gradient.addColorStop(0.3, `rgba(71, 85, 105, ${this.opacity * 0.4})`); // Slate 600 mid-trail
    gradient.addColorStop(1, `rgba(51, 65, 85, ${this.opacity})`); // Slate 700 head

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.speedX, this.y + this.length);
    ctx.stroke();
  }
}

// Ground Ripple Ring
class RainSplash {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0.5;
    this.opacity = 0.55;
    this.speed = Math.random() * 0.1 + 0.08;
  }

  update() {
    this.r += this.speed * 5.5;
    this.opacity -= 0.038;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(71, 85, 105, ${this.opacity})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}

// Physics-based splash droplets bouncing upward
class SplashDroplet {
  constructor(x, y, parentWind) {
    this.x = x;
    this.y = y;
    // Bounce direction: upwards and outwards
    this.vx = (Math.random() * 3.6 - 1.8) + (parentWind * 0.2);
    this.vy = -(Math.random() * 2.8 + 1.2);
    this.gravity = 0.22;
    this.size = Math.random() * 0.7 + 0.6; // 0.6px to 1.3px
    this.opacity = 0.8;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity; // Gravity pull down
    this.opacity -= 0.045;   // Fade out quickly
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(71, 85, 105, ${this.opacity})`;
    ctx.fill();
  }
}

// --- Confetti / Sprinkles System with 3D Tumble ---
class ConfettiParticle {
  constructor(width, height) {
    this.reset(width, height, true);
  }

  reset(width, height, init = false) {
    this.x = Math.random() * width;
    this.y = init ? Math.random() * height : -25;
    this.size = Math.random() * 6 + 5; // 5px to 11px
    this.speedY = Math.random() * 2.5 + 2.0; // falling speed
    this.speedX = Math.random() * 1.8 - 0.9;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.07 - 0.035;
    
    // Curated premium website palette
    const colors = [
      '#F59E0B', // Amber 500
      '#FBBF24', // Amber 400
      '#D97706', // Amber 600
      '#F97316', // Orange 500
      '#10B981', // Emerald 500
      '#6366F1', // Indigo 500
      '#EC4899', // Pink 500
      '#0F172A', // Slate 900
      '#475569', // Slate 600
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.shape = Math.random() > 0.45 ? 'rect' : 'circle';
    this.opacity = Math.random() * 0.2 + 0.8; // 0.8 to 1.0
    this.scaleX = 1;
    this.scaleXSpeed = Math.random() * 0.08 + 0.04;
  }

  update(width, height) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y / 24) * 0.35;
    this.rotation += this.rotationSpeed;
    
    // 3D tumble flip
    this.scaleX = Math.sin(this.y * this.scaleXSpeed);

    if (this.y > height + 15) {
      this.reset(width, height);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, 1);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Sparkle/Twinkle particles inside the Confetti theme
class SparkleParticle {
  constructor(width, height) {
    this.reset(width, height, true);
  }

  reset(width, height, init = false) {
    this.x = Math.random() * width;
    this.y = init ? Math.random() * height : -15;
    this.size = Math.random() * 3 + 2; // 2px to 5px
    this.speedY = Math.random() * 1.2 + 0.8;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.opacity = 0;
    this.opacitySpeed = Math.random() * 0.04 + 0.02;
    this.fadePhase = 'in'; // 'in' or 'out'
  }

  update(width, height) {
    this.y += this.speedY;
    this.x += this.speedX;

    if (this.fadePhase === 'in') {
      this.opacity += this.opacitySpeed;
      if (this.opacity >= 0.95) this.fadePhase = 'out';
    } else {
      this.opacity -= this.opacitySpeed;
      if (this.opacity <= 0) {
        this.reset(width, height);
      }
    }

    if (this.y > height + 10) {
      this.reset(width, height);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#FFFbeb'; // Golden-white sparkle
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 6;
    ctx.globalAlpha = this.opacity;

    // Draw diamond sparkle star
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(this.size * 0.4, 0);
    ctx.lineTo(0, this.size);
    ctx.lineTo(-this.size * 0.4, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

export default function LogoAnimation({ theme, duration = 4500, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let splashes = [];
    let splashDroplets = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles based on selected theme
    const particleCount = theme === 'rain' ? 100 : theme === 'snow' ? 140 : 80;
    for (let i = 0; i < particleCount; i++) {
      if (theme === 'snow') {
        particles.push(new SnowParticle(width, height));
      } else if (theme === 'rain') {
        particles.push(new RainParticle(width, height));
      } else {
        particles.push(new ConfettiParticle(width, height));
      }
    }

    // Add extra decorative sparkle stars for confetti theme
    if (theme === 'confetti') {
      const sparkleCount = 25;
      for (let i = 0; i < sparkleCount; i++) {
        particles.push(new SparkleParticle(width, height));
      }
    }

    const startTime = Date.now();
    let globalOpacity = 1;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        if (onClose) onClose();
        return;
      }

      // Smooth fade-out in the last 800ms of the animation
      if (duration - elapsed < 800) {
        globalOpacity = (duration - elapsed) / 800;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw and update main particles
      particles.forEach((p) => {
        if (theme === 'snow') {
          p.update(width, height, elapsed / 16);
        } else if (theme === 'rain') {
          p.update(width, height, splashes, splashDroplets);
        } else {
          p.update(width, height);
        }
        ctx.globalAlpha = globalOpacity;
        p.draw(ctx);
      });

      // Update and draw splashes (rain theme only)
      if (theme === 'rain') {
        splashes = splashes.filter((s) => s.opacity > 0);
        splashes.forEach((s) => {
          s.update();
          ctx.globalAlpha = globalOpacity;
          s.draw(ctx);
        });

        splashDroplets = splashDroplets.filter((d) => d.opacity > 0);
        splashDroplets.forEach((d) => {
          d.update();
          ctx.globalAlpha = globalOpacity;
          d.draw(ctx);
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, duration, onClose]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
