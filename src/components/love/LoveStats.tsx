import { useEffect, useRef, useState } from "react";

interface StatEntry {
  id: string;
  icon: string;
  target: number;
  suffix: string;
  label: string;
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = Date.now();
            const dur = 1400;
            function step() {
              const t = Math.min((Date.now() - start) / dur, 1);
              const ease = 1 - Math.pow(1 - t, 3);
              setVal(Math.floor(target * ease));
              if (t < 1) requestAnimationFrame(step);
              else setVal(target);
            }
            requestAnimationFrame(step);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  const display = val + (val >= target && suffix === "+" ? "+" : "") + (suffix !== "+" ? suffix : "");

  return <div ref={ref} className="sc3-n">{display}</div>;
}

export default function LoveStats({ entries }: { entries: StatEntry[] }) {
  const d = (i: number) => `d${(i % 9) + 1}`;
  return (
    <section className="sec">
      <div className="sec-in">
        <div className="sh a0">
          <h2>我们一起做了什么</h2>
          <div className="sh-l"></div>
        </div>
        <div className="sg">
          {entries.map((entry, i) => (
            <div key={entry.id} className={`sc3 glass tilt a0 ${d(i)}`}>
              <div className="sc3-ic">{entry.icon}</div>
              <CountUp target={entry.target} suffix={entry.suffix} />
              <div className="sc3-l">{entry.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
