import { useRef, useState } from 'react';
import useDialogFocus from './useDialogFocus';

export default function AddModal({ open, onClose, onAdd, tag }) {
  const dialogRef = useRef(null);
  useDialogFocus(dialogRef, open, onClose);
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customTime, setCustomTime] = useState(() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  });
  function handle() {
    const [h, m] = customTime.split(':').map(Number);
    const [y, mo, d] = customDate.split('-').map(Number);
    const date = new Date(y, mo - 1, d, h, m);
    if (!isNaN(date)) { onAdd(date, tag); onClose(); }
  }
  if (!open) return null;
  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="add-title" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="add-title">Добавить запись</h2>
          <p>Выберите дату и время</p>
        </div>
        <div className="modal-controls">
          <div className="md-field">
            <label htmlFor="entry-date">Дата</label>
            <input id="entry-date" type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} />
          </div>
          <div className="md-field">
            <label htmlFor="entry-time">Время</label>
            <input id="entry-time" type="time" value={customTime} onChange={e => setCustomTime(e.target.value)} />
          </div>
        </div>
        <div className="modal-buttons">
          <button className="btn-text btn-round" onClick={onClose}>Отмена</button>
          <button className="btn-filled btn-round" onClick={handle}>Добавить</button>
        </div>
      </div>
    </div>
  );
}
