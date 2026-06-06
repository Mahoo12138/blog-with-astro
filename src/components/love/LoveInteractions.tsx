import { useEffect } from "react";

export default function LoveInteractions() {
  useEffect(() => {
    const root = document.getElementById("love-root");
    if (!root) return;

    /* ── PROGRESS BAR ── */
    const prog = document.getElementById("prog")!;
    const onProgress = () => {
      prog.style.width =
        (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100 + "%";
    };
    window.addEventListener("scroll", onProgress, { passive: true });

    /* ── PARALLAX ORBS ── */
    let raf: number | null = null;
    const onParallax = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          const sy = window.scrollY;
          root.querySelectorAll(".orb").forEach((b, i) => {
            const r = [0.18, 0.32, 0.12];
            (b as HTMLElement).style.transform = `translateY(${sy * r[i]}px)`;
          });
          raf = null;
        });
      }
    };
    window.addEventListener("scroll", onParallax, { passive: true });

    /* ── SCROLL REVEAL ── */
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("v");
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -28px 0px" },
    );
    root.querySelectorAll(".a0, .al, .ar, .sc2").forEach((el) => obs.observe(el));

    /* ── CURSOR GLOW ── */
    const cg = document.getElementById("cg")!;
    const onMouse = (e: MouseEvent) => {
      cg.style.left = e.clientX + "px";
      cg.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", onMouse, { passive: true });

    /* ── 3D TILT ── */
    const tiltels: Array<{ el: Element; onMove: (e: Event) => void; onLeave: () => void }> = [];
    root.querySelectorAll(".tilt").forEach((el) => {
      const onMove = (e: Event) => {
        const me = e as MouseEvent;
        const r = el.getBoundingClientRect();
        const x = (me.clientX - r.left) / r.width - 0.5;
        const y = (me.clientY - r.top) / r.height - 0.5;
        (el as HTMLElement).style.transform =
          `perspective(520px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-4px)`;
        (el as HTMLElement).style.boxShadow = `${-x * 12}px ${-y * 12}px 28px var(--gd)`;
      };
      const onLeave = () => {
        (el as HTMLElement).style.transform = "";
        (el as HTMLElement).style.boxShadow = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      tiltels.push({ el, onMove, onLeave });
    });

    return () => {
      window.removeEventListener("scroll", onProgress);
      window.removeEventListener("scroll", onParallax);
      obs.disconnect();
      document.removeEventListener("mousemove", onMouse);
      tiltels.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="cg" />
      <div id="prog" />
    </>
  );
}
