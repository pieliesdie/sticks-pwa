import { useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import stickNoun from '../components/stickNoun';

export default function HistoryPage({ entries, onDelete }) {
  const [collapsedDays, setCollapsedDays] = useState({});
  const [selectedHourMap, setSelectedHourMap] = useState({});
  const [scrollParent, setScrollParent] = useState(null);
  const currentHour = new Date().getHours();

  useEffect(() => {
    setScrollParent(document.querySelector('.page-container'));
  }, []);

  function groupByDay(items) {
    const groups = {};
    for (const e of items) {
      const d = e.date;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      (groups[key] = groups[key] || []).push(e);
    }
    return Object.entries(groups)
      .map(([day, list]) => [day, list.sort((a, b) => b.date - a.date)])
      .sort((a, b) => a[0] < b[0] ? 1 : -1);
  }

  function formatDay(key) {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yest = new Date(today); yest.setDate(today.getDate() - 1);
    if (date.getTime() === today.getTime()) return 'Сегодня';
    if (date.getTime() === yest.getTime()) return 'Вчера';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });
  }

  const grouped = groupByDay(entries);

  if (!grouped.length) return (
    <div className="page">
      <div className="empty">
        <div className="empty-icon" aria-hidden="true">—</div>
        <p>История пуста</p>
      </div>
    </div>
  );

  return (
    <div className="page history-page">
      <div className="entries">
        {scrollParent && (
          <Virtuoso
            customScrollParent={scrollParent}
            data={grouped}
            overscan={200}
            itemContent={(gi, [day, list]) => {
              const collapsed = collapsedDays[day];
              const hourCounts = Array(24).fill(0);
              list.forEach(e => hourCounts[e.date.getHours()]++);
               const maxCount = Math.max(...hourCounts, 1);
               const selectedHour = selectedHourMap[day];
               const isToday = formatDay(day) === 'Сегодня';

              return (
                <div key={day} className="day-group show" style={{ marginBottom: '16px' }}>
                  <button
                    className="day-header"
                    onClick={() => setCollapsedDays(p => ({ ...p, [day]: !p[day] }))}
                    aria-expanded={!collapsed}
                  >
                    <div className="day-header-left">
                      <span className="day-date">{formatDay(day)}</span>
                      <span className="day-count-chip">{list.length}</span>
                    </div>
                    <span className="arrow" aria-hidden="true" style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
                  </button>

                  {!collapsed && (
                    <div className="day-content">
                      <div>
                        <div className="hist-label">По часам · листайте вбок{selectedHour != null && ` · ${selectedHour}:00 — ${hourCounts[selectedHour]} шт`}</div>
                        <div className="day-histogram">
                          {hourCounts.map((count, hour) => {
                            const isSelected = selectedHour === hour;
                            const isCurrent = isToday && hour === currentHour;
                            const barH = count > 0 ? Math.max((count / maxCount) * 64, 6) : 2;
                            return (
                              <div key={hour} className="hour-bar-container">
                                <button
                                  type="button"
                                  className={`hour-bar${isCurrent ? ' current-hour' : ''}${isSelected ? ' selected' : ''}${count === 0 ? ' empty-bar' : ''}`}
                                  aria-label={`${hour}:00 — ${count} ${stickNoun(count)}`}
                                  aria-pressed={isSelected}
                                  onClick={() => setSelectedHourMap(p => ({ ...p, [day]: p[day] === hour ? null : hour }))}
                                ><span style={{ height: `${barH}px` }} /></button>
                                <div className={`hour-label${isCurrent ? ' active' : ''}`}>
                                  {hour % 6 === 0 ? hour : ''}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="day-entries">
                        <div className="hist-label">Записи</div>
                        <ol className="entry-list">
                            {list.map((e, i) => {
                              const gapMinutes = i < list.length - 1
                                ? Math.round((list[i].date.getTime() - list[i + 1].date.getTime()) / 60000)
                                : null;
                              return (
                              <li className="entry-item" key={e.id}>
                                <span className="entry-number" aria-label={`Запись ${list.length - i}`}>{list.length - i}</span>
                                <div className="entry-details">
                                  <span className="entry-time">
                                    {new Date(e.iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {(e.tag || gapMinutes !== null) && <span className="entry-meta">{[e.tag, gapMinutes !== null ? `Через ${gapMinutes} мин после предыдущей` : null].filter(Boolean).join(' · ')}</span>}
                                </div>
                                <button className="btn-delete" aria-label={`Удалить запись за ${new Date(e.iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`} onClick={() => onDelete(e.id)}>✕</button>
                              </li>
                              );
                            })}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
