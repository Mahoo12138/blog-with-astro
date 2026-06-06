import { useEffect, useRef } from "react";

const SD: Record<string, { p: string; c: string[] }> = {
  spring: {
    p: "petal",
    c: [
      "rgba(255,148,178,.55)",
      "rgba(255,185,205,.5)",
      "rgba(245,170,195,.48)",
      "rgba(255,210,225,.5)",
    ],
  },
  summer: {
    p: "firefly",
    c: [
      "rgba(255,210,72,.85)",
      "rgba(255,225,102,.75)",
      "rgba(255,195,52,.7)",
    ],
  },
  autumn: {
    p: "leaf",
    c: [
      "rgba(195,80,25,.55)",
      "rgba(215,116,40,.5)",
      "rgba(175,60,15,.45)",
    ],
  },
  winter: {
    p: "snow",
    c: [
      "rgba(175,208,255,.65)",
      "rgba(196,222,255,.55)",
      "rgba(155,196,252,.5)",
    ],
  },
};

class Particle {
  t: string;
  c: string[];
  col: string;
  x = 0;
  y = 0;
  s = 4;
  op = 0.3;
  vy = 0.5;
  vx = 0;
  wb = 0;
  ws = 0;
  wa = 0.5;
  ph = 0;
  ps = 0;
  rot?: number;
  rs?: number;
  br?: number;

  constructor(t: string, c: string[], r: boolean, W: number, H: number) {
    this.t = t;
    this.c = c;
    this.col = c[~~(Math.random() * c.length)];
    this.ini(r, W, H);
  }

  ini(r: boolean, W: number, H: number) {
    this.x = Math.random() * W;
    this.s = Math.random() * 8 + 4;
    this.op = Math.random() * 0.5 + 0.2;
    if (this.t === "firefly") {
      this.y = r ? Math.random() * H : H + 10;
      this.vy = -(Math.random() * 0.9 + 0.3);
      this.vx = (Math.random() - 0.5) * 0.5;
      this.ph = Math.random() * Math.PI * 2;
      this.ps = Math.random() * 0.035 + 0.012;
    } else {
      this.y = r ? Math.random() * H : -15;
      this.vy = Math.random() * 1.2 + 0.45;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.wb = Math.random() * Math.PI * 2;
      this.ws = Math.random() * 0.04 + 0.012;
      this.wa = Math.random() * 1.4 + 0.5;
    }
    if (this.t === "petal" || this.t === "leaf") {
      this.rot = Math.random() * Math.PI * 2;
      this.rs = (Math.random() - 0.5) * 0.045;
    }
    if (this.t === "snow") {
      this.s = Math.random() * 5 + 3;
      this.br = Math.random() < 0.5 ? 4 : 6;
    }
  }

  upd(W: number, H: number) {
    if (this.t === "firefly") {
      this.ph += this.ps;
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.ph) * 0.45;
      this.op = 0.28 + Math.abs(Math.sin(this.ph)) * 0.48;
      if (this.y < -15) this.ini(false, W, H);
    } else {
      this.wb += this.ws;
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.wb) * this.wa;
      if (this.rot !== undefined && this.rs !== undefined) this.rot += this.rs;
      if (this.y > H + 20 || this.x < -40 || this.x > W + 40)
        this.ini(false, W, H);
    }
  }

  drw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.op));
    ctx.translate(this.x, this.y);
    if (this.rot !== undefined) ctx.rotate(this.rot);
    const s = this.s;
    if (this.t === "petal") {
      ctx.fillStyle = this.col;
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.5, s * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.22)";
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.15, s * 0.18, s * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.t === "firefly") {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.5);
      g.addColorStop(0, this.col);
      g.addColorStop(1, "rgba(255,200,50,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, s * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = this.col;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.t === "leaf") {
      ctx.fillStyle = this.col;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.85, -s * 0.5, s * 0.85, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.85, s * 0.5, -s * 0.85, -s * 0.5, 0, -s);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(0, s);
      ctx.stroke();
    } else if (this.t === "snow") {
      ctx.strokeStyle = this.col;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < (this.br ?? 6); i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / (this.br ?? 6));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, s);
        ctx.moveTo(0, s * 0.42);
        ctx.lineTo(s * 0.3, s * 0.7);
        ctx.moveTo(0, s * 0.42);
        ctx.lineTo(-s * 0.3, s * 0.7);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }
}

export default function LoveParticles({ season }: { season: string }) {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let pts: Particle[] = [];
    let raf = 0;

    function rsz() {
      cv!.width = innerWidth;
      cv!.height = innerHeight;
    }
    rsz();
    window.addEventListener("resize", rsz);

    function rebuild(s: string) {
      const d = SD[s] ?? SD.spring;
      pts = Array.from(
        { length: s === "summer" ? 26 : 38 },
        () => new Particle(d.p, d.c, true, cv!.width, cv!.height),
      );
    }

    function loop() {
      ctx.clearRect(0, 0, cv!.width, cv!.height);
      pts.forEach((p) => {
        p.upd(cv!.width, cv!.height);
        p.drw(ctx);
      });
      raf = requestAnimationFrame(loop);
    }

    rebuild(season);
    loop();

    return () => {
      window.removeEventListener("resize", rsz);
      cancelAnimationFrame(raf);
    };
  }, [season]);

  return <canvas ref={cvRef} id="bg" />;
}
