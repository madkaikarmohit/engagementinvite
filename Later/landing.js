(() => {
  const canvas = document.getElementById("fireworks");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  // Play the welcome fireworks after the champagne glasses finish their clink on every page load.
  const ctx = canvas.getContext("2d");
  let w = 0,
    h = 0,
    dpr = 1,
    particles = [],
    raf = 0;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });
  const palette = ["#d9bd7b", "#f0dca9", "#9bb49a", "#f5eee0", "#c98d78"];
  function burst(x, y) {
    const color = palette[Math.floor(Math.random() * palette.length)];
    const count = 34;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.08;
      const speed = 1.1 + Math.random() * 2.5;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 65 + Math.random() * 25,
        max: 90,
        size: 1 + Math.random() * 1.6,
        color,
      });
    }
  }
  const starts = [
    [0.18, 0.22, 250],
    [0.82, 0.19, 620],
    [0.5, 0.12, 1050],
    [0.28, 0.34, 1500],
    [0.74, 0.32, 1900],
  ];
  const began = performance.now();
  starts.forEach(([x, y, t]) =>
    setTimeout(() => burst(w * x, h * y), 2350 + t),
  );
  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles = particles.filter((p) => p.life > 0);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.018;
      p.life--;
      ctx.globalAlpha = Math.min(1, p.life / 22) * 0.78;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (performance.now() - began < 3900 || particles.length) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, w, h);
      cancelAnimationFrame(raf);
    }
  }
  setTimeout(() => {
    raf = requestAnimationFrame(draw);
  }, 2250);
})();
