import { useState, useCallback } from "react";

interface CalendarEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  weatherIcon: string;
  weather: string;
  moodIcon: string;
  mood: string;
  icon: string;
  category: string;
}

const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

function fmt(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    month: `${d.getMonth() + 1}月`,
    day: String(d.getDate()).padStart(2, "0"),
    wkday: weekdays[d.getDay()],
  };
}

export default function LoveCalendar({ entries }: { entries: CalendarEntry[] }) {
  const [current, setCurrent] = useState(entries[0]);
  const [anim, setAnim] = useState<"out" | "in" | null>(null);
  const [lastIdx, setLastIdx] = useState(0);
  const [busy, setBusy] = useState(false);

  const f = fmt(current.date);

  const flip = useCallback(() => {
    if (busy) return;
    setBusy(true);
    let idx: number;
    do {
      idx = ~~(Math.random() * entries.length);
    } while (idx === lastIdx && entries.length > 1);
    setLastIdx(idx);

    setAnim("out");
    setTimeout(() => {
      setCurrent(entries[idx]);
      setAnim("in");
      setTimeout(() => {
        setAnim(null);
        setBusy(false);
      }, 420);
    }, 180);
  }, [busy, lastIdx, entries]);

  return (
    <section className="sec">
      <div className="sec-in">
        <div className="sh a0">
          <h2>时间收藏夹</h2>
          <div className="sh-l"></div>
          <span className="sh-tag">随机日历</span>
        </div>

        <div className="cal-wrap">
          <div className="cal-card glass a0 d1">
            <div className="cal-rings" aria-hidden="true">
              <span className="cal-ring"></span>
              <span className="cal-ring"></span>
              <span className="cal-ring"></span>
              <span className="cal-ring"></span>
              <span className="cal-ring"></span>
              <span className="cal-ring"></span>
            </div>

            <div className={`cal-body${anim === "out" ? " cal-out" : ""}${anim === "in" ? " cal-in" : ""}`}>
              <div className="cal-top">
                <span className="cal-month">{f.month}</span>
                <span className="cal-sep">·</span>
                <span className="cal-wkday">{f.wkday}</span>
              </div>

              <div className="cal-date-stage">
                <div className="cal-date-frame">
                  <span className="cal-date-num">{f.day}</span>
                </div>
                <div className="cal-date-dots" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
              </div>

              <div className="cal-meta">
                <span className="cal-chip">
                  <span className="cal-chip-ic">{current.weatherIcon}</span>
                  <span>{current.weather}</span>
                </span>
                <span className="cal-chip">
                  <span className="cal-chip-ic">{current.moodIcon}</span>
                  <span>{current.mood}</span>
                </span>
              </div>

              <div className="cal-event">
                <span className="cal-ev-ic">{current.icon}</span>
                <div className="cal-ev-tt">{current.title}</div>
                <div className="cal-ev-tx">{current.description}</div>
              </div>

              <div className="cal-cat">{current.category}</div>
            </div>
          </div>

          <button className="cal-btn a0 d2" onClick={flip} type="button">
            <span className="cal-btn-star">✦</span> 翻开另一页
          </button>
          <div className="cal-hint a0 d3">
            共 {entries.length} 个纪念日 · 每一页都是珍藏
          </div>
        </div>
      </div>
    </section>
  );
}
