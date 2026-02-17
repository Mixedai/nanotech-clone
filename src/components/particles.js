// src/components/particles.js

export class ParticleCanvas {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.animationId = null;
    this.isVisible = false;

    this.config = {
      count: options.count || 120,
      color: options.color || '255, 255, 255',
      lineMaxDist: options.lineMaxDist || 150,
      repelDist: options.repelDist || 80,
      minSize: 1,
      maxSize: 3,
      speed: 0.3,
    };

    this._onResize = this._resize.bind(this);
    this._onMouse = this._trackMouse.bind(this);
    this._onLeave = () => { this.mouse.x = null; this.mouse.y = null; };

    this._init();
  }

  _init() {
    this._resize();
    this._createParticles();
    window.addEventListener('resize', this._onResize);
    this.canvas.parentElement.addEventListener('mousemove', this._onMouse);
    this.canvas.parentElement.addEventListener('mouseleave', this._onLeave);
    this._observeVisibility();
  }

  _resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
  }

  _createParticles() {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 60 : this.config.count;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  _trackMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  _observeVisibility() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this._animate();
        } else {
          this.isVisible = false;
          if (this.animationId) cancelAnimationFrame(this.animationId);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(this.canvas.parentElement);
  }

  _animate() {
    if (!this.isVisible) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._updateParticles();
    this._drawLines();
    this._drawParticles();
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  _updateParticles() {
    const { width, height } = this.canvas;
    const { repelDist } = this.config;

    for (const p of this.particles) {
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelDist && dist > 0) {
          const force = (repelDist - dist) / repelDist;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }
      }

      p.vx *= 0.98;
      p.vy *= 0.98;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed < this.config.speed * 0.3) {
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  _drawParticles() {
    const { color } = this.config;
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      this.ctx.fill();
    }
  }

  _drawLines() {
    const { lineMaxDist, color } = this.config;
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < lineMaxDist) {
          const opacity = (1 - dist / lineMaxDist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `rgba(${color}, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    this.canvas.parentElement.removeEventListener('mousemove', this._onMouse);
    this.canvas.parentElement.removeEventListener('mouseleave', this._onLeave);
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
