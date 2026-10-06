import { useEffect, useRef, useState } from 'react';
import AddModal from '../components/AddModal';
import useDialogFocus from '../components/useDialogFocus';
import stickNoun from '../components/stickNoun';
import getTodayCount from '../getTodayCount';
import IconAdd from '../components/icons/IconAdd';
import IconCalendar from '../components/icons/IconCalendar';

const TAG_OPTIONS = [
  'Стресс', 'Кофе', 'Скука', 'Привычка', 'Перекур'
];

export default function HomePage({ entries, intervalMinutes, onAdd, showSnack, timeSinceLast, moneySpentToday, moneySpentTotal, dailyLimit }) {
  const [showModal, setShowModal] = useState(false);
  const [showTagSheet, setShowTagSheet] = useState(false);
  const tagDialogRef = useRef(null);
  useDialogFocus(tagDialogRef, showTagSheet, () => setShowTagSheet(false));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const sorted = [...entries].sort((a, b) => b.date - a.date);
  const last = sorted[0] || null;
  const diffMin = last ? (now - last.date.getTime()) / 60000 : null;
  const canSmoke = diffMin === null || diffMin >= intervalMinutes;
  const remaining = diffMin !== null ? Math.max(0, Math.ceil(intervalMinutes - diffMin)) : 0;
  const progress = diffMin !== null ? Math.min(diffMin / intervalMinutes, 1) : 0;
  const displayRemaining = remaining > intervalMinutes ? intervalMinutes : remaining;

  const todayCount = getTodayCount(entries);

  const progressLimit = dailyLimit > 0 ? Math.min(todayCount / dailyLimit, 1) : 0;
  const isOverLimit = todayCount > dailyLimit;

  function handleAddClick() {
    if (navigator.vibrate) navigator.vibrate(50);
    setShowTagSheet(true);
  }

  function confirmAdd(tagLabel) {
    if (navigator.vibrate) navigator.vibrate(50);
    onAdd(new Date(), tagLabel);
    setShowTagSheet(false);
    showSnack('Запись добавлена');
  }

  function checkTimer() {
    if (navigator.vibrate) navigator.vibrate(20);
    if (!entries.length) { showSnack('Пока нет записей'); return; }
    if (canSmoke) showSnack('Интервал прошёл');
    else showSnack(`До конца интервала: ${displayRemaining} мин`);
  }

  return (
    <div className="page home-page">
      <div className="status-card">
        <div className="status-heading">Сегодня</div>
        <div className="daily-total">
          <span className="daily-count">{todayCount}</span>
          <span className="daily-of">лимит {dailyLimit} {stickNoun(dailyLimit)}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-label="Дневной лимит" aria-valuemin={0} aria-valuemax={dailyLimit} aria-valuenow={Math.min(todayCount, dailyLimit)} aria-valuetext={`Сегодня ${todayCount} ${stickNoun(todayCount)}; лимит ${dailyLimit} ${stickNoun(dailyLimit)}`}>
          <span className={isOverLimit ? 'progress-fill over-limit' : 'progress-fill'} style={{ width: `${progressLimit * 100}%` }} />
        </div>
        <div className="status-foot">Расход сегодня <strong>{Math.round(moneySpentToday || 0)} ₽</strong></div>
      </div>

      <div className="interval-card">
        <div className="interval-heading">Интервал · {intervalMinutes} мин</div>
        <div className="interval-value">{!last ? 'Пока нет записей' : canSmoke ? 'Интервал прошёл' : `Осталось ${displayRemaining} мин`}</div>
        <div className="interval-track" aria-hidden="true"><span style={{ width: `${Math.max(0, progress) * 100}%` }} /></div>
        {last && <div className="interval-caption">Последняя запись в {last.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>}
      </div>

      <div className="home-actions">
        <button className="btn-filled home-btn" onClick={handleAddClick}>
          <IconAdd /> Добавить сейчас
        </button>
        <button className="btn-tonal home-btn" onClick={() => setShowModal(true)}>
          <IconCalendar /> Указать дату и время
        </button>
        <button className="btn-text home-btn" onClick={checkTimer}>
          Проверить интервал
        </button>
      </div>

      <div className="summary-line"><span>Всего записей <strong>{entries.length}</strong></span><span>Расход за всё время <strong>{Math.round(moneySpentTotal || 0)} ₽</strong></span></div>

      <AddModal open={showModal} onClose={() => setShowModal(false)} onAdd={onAdd} tag={null} />

      {showTagSheet && <div className="modal-overlay show" onClick={() => setShowTagSheet(false)}>
        <div className="modal" ref={tagDialogRef} role="dialog" aria-modal="true" aria-labelledby="tag-title" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 id="tag-title">Причина записи</h2>
            <p>Выберите причину или пропустите этот шаг</p>
          </div>
          <div className="tag-options">
            {TAG_OPTIONS.map(label => (
              <button
                key={label}
                className="tag-option"
                onClick={() => confirmAdd(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            className="btn-text home-btn"
            onClick={() => confirmAdd(null)}
          >
            Пропустить
          </button>
        </div>
      </div>}
    </div>
  );
}
