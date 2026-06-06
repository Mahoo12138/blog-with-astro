interface WishEntry {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

export default function LoveWishes({ entries }: { entries: WishEntry[] }) {
  const doneCount = entries.filter((w) => w.done).length;
  const d = (i: number) => `d${(i % 9) + 1}`;

  return (
    <section className="sec">
      <div className="sec-in">
        <div className="sh a0">
          <h2>我们的心愿</h2>
          <div className="sh-l"></div>
          <span className="sh-tag">
            {doneCount} / {entries.length} 完成
          </span>
        </div>
        <div className="wl">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`wi${entry.done ? " dn" : ""} glass a0 ${d(i)}`}
            >
              <div className="wc">{entry.done ? "✓" : ""}</div>
              <span className="wt">{entry.text}</span>
              <span className="wk">{entry.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
