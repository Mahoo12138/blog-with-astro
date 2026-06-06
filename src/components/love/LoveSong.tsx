import { useRef, useState, useCallback } from "react";

interface Props {
  song: {
    title: string;
    artist: string;
    note: string;
    initialTime: string;
    totalTime: string;
    initialPercent: number;
  };
}

export default function LoveSong({ song }: Props) {
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(song.initialPercent);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalParts = song.totalTime.split(":").map(Number);
  const totalSec = totalParts[0] * 60 + totalParts[1];

  const fmtTime = (p: number) => {
    const c = (totalSec * p) / 100;
    return Math.floor(c / 60) + ":" + String(~~(c % 60)).padStart(2, "0");
  };

  const toggle = useCallback(() => {
    if (playing) {
      if (timer.current) clearInterval(timer.current);
      setPlaying(false);
    } else {
      setPlaying(true);
      timer.current = setInterval(() => {
        setPct((prev) => {
          const next = Math.min(100, prev + 0.05);
          if (next >= 100) {
            if (timer.current) clearInterval(timer.current);
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    }
  }, [playing]);

  return (
    <section className="sec">
      <div className="sec-in">
        <div className="sh a0">
          <h2>我们的歌</h2>
          <div className="sh-l"></div>
        </div>
        <div className="song-wrap glass a0 d1">
          <div className="song-hd"></div>
          <div className="song-bd">
            <div className="song-art">🎵</div>
            <div className="song-inf">
              <div className="t">{song.title}</div>
              <div className="ar">{song.artist}</div>
              <div className="nt">{song.note}</div>
            </div>
          </div>
          <div className="song-ft">
            <div className="sb">
              <span className="stm">{fmtTime(pct)}</span>
              <div className="str">
                <div className="sfl" style={{ width: `${pct}%` }}></div>
              </div>
              <span className="stm">{song.totalTime}</span>
            </div>
            <div className="sct">
              <button className="sbt" aria-label="上一首">⏮</button>
              <button className="sbt pl" onClick={toggle}>{playing ? "⏸" : "▶"}</button>
              <button className="sbt" aria-label="下一首">⏭</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
