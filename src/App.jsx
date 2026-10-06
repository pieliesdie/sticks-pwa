import { useState, useRef } from 'react';
import './styles.css';
import Snackbar from './components/Snackbar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import useStickData from './useStickData';
import IconSticks from './components/icons/IconSticks';
import useTheme from './useTheme';

export default function SticksApp() {
  const [page, setPage] = useState('home');
  const { themeStyle, setThemeStyle, themeMode, setThemeMode } = useTheme();
  const {
    entries, setEntries, intervalMinutes, setIntervalMinutes,
    packPrice, setPackPrice, sticksPerPack, setSticksPerPack,
    dailyLimit, setDailyLimit, todayCount, timeSinceLast,
    moneySpentToday, moneySpentTotal
  } = useStickData();
  const [snack, setSnack] = useState({ msg: '' });
  const snackTimer = useRef(null);

  function showSnack(msg) {
    clearTimeout(snackTimer.current);
    setSnack({ msg });
    snackTimer.current = setTimeout(() => setSnack({ msg: '' }), 3000);
  }

  function addEntry(date, tag) {
    setEntries(prev => [{
      id: window.crypto?.randomUUID?.() ?? String(Date.now()),
      iso: date.toISOString(), date,
      pretty: date.toLocaleString('ru-RU'),
      tag: tag || null
    }, ...prev]);
  }

  function deleteEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id));
    showSnack('Запись удалена');
  }

  function clearAll() {
    if (!window.confirm('Удалить все записи?')) {
      return;
    }
    if (!window.confirm('Это действие необратимо. Вы уверены?')) {
      return;
    }
    setEntries([]); showSnack('Очищено');
  }

  const titles = { home: 'Стики', history: 'История', settings: 'Настройки' };
  return (
    <div className="app-root">
      <div className="top-bar">
        <div className="top-bar-icon"><IconSticks /></div>
        <h1>{titles[page]}</h1>
        {page === 'home' && <div className="counter-chip">{todayCount} сегодня</div>}
      </div>

      <div className="page-container">
        {page === 'home' && (
          <HomePage entries={entries} intervalMinutes={intervalMinutes} onAdd={addEntry} showSnack={showSnack} timeSinceLast={timeSinceLast} moneySpentToday={moneySpentToday} moneySpentTotal={moneySpentTotal} dailyLimit={dailyLimit} />
        )}
        {page === 'history' && <HistoryPage entries={entries} onDelete={deleteEntry} />}
        {page === 'settings' && (
          <SettingsPage intervalMinutes={intervalMinutes} setIntervalMinutes={setIntervalMinutes} entries={entries} onClear={clearAll} packPrice={packPrice} setPackPrice={setPackPrice} sticksPerPack={sticksPerPack} setSticksPerPack={setSticksPerPack} dailyLimit={dailyLimit} setDailyLimit={setDailyLimit} themeStyle={themeStyle} setThemeStyle={setThemeStyle} themeMode={themeMode} setThemeMode={setThemeMode} />
        )}
      </div>

      <BottomNav active={page} onChange={setPage} />
      <Snackbar message={snack.msg} />
    </div>
  );
}
