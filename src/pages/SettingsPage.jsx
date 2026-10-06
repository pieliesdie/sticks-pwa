import getTodayCount from '../getTodayCount';

export default function SettingsPage({ intervalMinutes, setIntervalMinutes, entries, onClear, packPrice, setPackPrice, sticksPerPack, setSticksPerPack, dailyLimit, setDailyLimit }) {
  const todayCount = getTodayCount(entries);

  return (
    <div className="page settings-page">
      <div className="settings-section">
        <div className="settings-title">Таймер</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Интервал между стиками</span>
              <span className="settings-row-sub">Минимальное время ожидания</span>
            </div>
            <div className="stepper">
              <button className="stepper-btn" aria-label="Уменьшить интервал" onClick={() => setIntervalMinutes(v => Math.max(1, v - 5))}>−</button>
              <span className="stepper-val" aria-label={`${intervalMinutes} минут`}>{intervalMinutes}</span>
              <button className="stepper-btn" aria-label="Увеличить интервал" onClick={() => setIntervalMinutes(v => v + 5)}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Пачка</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Цена пачки (₽)</span>
              <span className="settings-row-sub">Стоимость пачки стиков</span>
            </div>
            <div className="stepper">
              <button className="stepper-btn" aria-label="Уменьшить цену пачки" onClick={() => setPackPrice(v => Math.max(0, v - 10))}>−</button>
              <span className="stepper-val">{packPrice}</span>
              <button className="stepper-btn" aria-label="Увеличить цену пачки" onClick={() => setPackPrice(v => v + 10)}>+</button>
            </div>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Стиков в пачке</span>
              <span className="settings-row-sub">Количество стиков в одной пачке</span>
            </div>
            <div className="stepper">
              <button className="stepper-btn" aria-label="Уменьшить число стиков в пачке" onClick={() => setSticksPerPack(v => Math.max(1, v - 1))}>−</button>
              <span className="stepper-val">{sticksPerPack}</span>
              <button className="stepper-btn" aria-label="Увеличить число стиков в пачке" onClick={() => setSticksPerPack(v => v + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Лимиты</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-info">
              <span className="settings-row-label">Дневной лимит</span>
              <span className="settings-row-sub">Максимум стиков в день</span>
            </div>
            <div className="stepper">
              <button className="stepper-btn" aria-label="Уменьшить дневной лимит" onClick={() => setDailyLimit(v => Math.max(1, v - 1))}>−</button>
              <span className="stepper-val">{dailyLimit}</span>
              <button className="stepper-btn" aria-label="Увеличить дневной лимит" onClick={() => setDailyLimit(v => v + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Статистика</div>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-row-label">Сегодня выкурено</span>
            <span className="settings-row-badge">{todayCount} шт</span>
          </div>
          <div className="settings-divider" />
          <div className="settings-row">
            <span className="settings-row-label">Всего записей</span>
            <span className="settings-row-badge">{entries.length} шт</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-title">Данные</div>
        <div className="settings-card">
          <button className="settings-row settings-danger" onClick={onClear}>
            <div className="settings-row-info">
              <span className="settings-row-label" style={{ color: 'var(--md-error)' }}>Очистить все записи</span>
              <span className="settings-row-sub">Действие необратимо</span>
            </div>
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
}
