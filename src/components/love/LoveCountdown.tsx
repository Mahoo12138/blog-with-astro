import { useEffect, useState } from "react";

interface Props {
  startDate: string;
  anniversaryDate: string;
  anniversaryLabel: string;
  daysText: string;
}

export default function LoveCountdown({ startDate, anniversaryDate, anniversaryLabel, daysText }: Props) {
  const [elapsed, setElapsed] = useState({ d: 0, h: 0, m: 0, s: 0, daysUntil: 0 });

  useEffect(() => {
    const startMs = new Date(startDate + "T00:00:00").getTime();
    const annivMs = new Date(anniversaryDate + "T00:00:00").getTime();

    function tick() {
      const diff = Date.now() - startMs;
      setElapsed({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
        daysUntil: Math.max(0, Math.ceil((annivMs - Date.now()) / 864e5)),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate, anniversaryDate]);

  // Also update the hero's day counter
  useEffect(() => {
    const avDy = document.getElementById("av-dy");
    if (!avDy) return;
    const startMs = new Date(startDate + "T00:00:00").getTime();
    const id = setInterval(() => {
      avDy.textContent = Math.floor((Date.now() - startMs) / 864e5) + " 天";
    }, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  const fmt = (n: number, pad = 1) => String(n).padStart(pad, "0");

  return (
    <section className="sec">
      <div className="sec-in">
        <div className="sh a0" style={{ justifyContent: "center" }}>
          <div className="sh-l r"></div>
          <h2>{daysText}</h2>
          <div className="sh-l"></div>
        </div>
        <div className="cd-main a0 d1">
          <div className="cd-from">
            {startDate.replace(/-/g, " · ")} → 至今
          </div>
          <div className="cd-row">
            <div className="cd-blk">
              <span className="cd-n">{elapsed.d}</span>
              <span className="cd-u">天</span>
            </div>
            <span className="cd-dot">·</span>
            <div className="cd-blk">
              <span className="cd-n">{fmt(elapsed.h, 2)}</span>
              <span className="cd-u">时</span>
            </div>
            <span className="cd-dot">·</span>
            <div className="cd-blk">
              <span className="cd-n">{fmt(elapsed.m, 2)}</span>
              <span className="cd-u">分</span>
            </div>
            <span className="cd-dot">·</span>
            <div className="cd-blk">
              <span className="cd-n">{fmt(elapsed.s, 2)}</span>
              <span className="cd-u">秒</span>
            </div>
          </div>
          <p className="cd-cap">
            已经 <strong>{elapsed.d}</strong> 天了，感谢你还在
          </p>
          <div className="cd-nx a0 d2">
            <div className="cdl">
              <div className="a">下一个纪念日</div>
              <div className="b">{anniversaryLabel}</div>
            </div>
            <div className="cdr">
              <div className="n">{elapsed.daysUntil}</div>
              <div className="u">天后</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
