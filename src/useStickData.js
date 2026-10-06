import { useEffect, useState } from 'react';
import getTodayCount from './getTodayCount';

const STORAGE_KEY = 'smoked_sticks_entries_v7';
const INTERVAL_KEY = 'sticks_interval_minutes';
const PRICE_KEY = 'sticks_pack_price';
const PER_PACK_KEY = 'sticks_per_pack';
const DAILY_LIMIT_KEY = 'sticks_daily_limit';

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map(entry => ({
      ...entry,
      date: new Date(entry.iso),
      pretty: new Date(entry.iso).toLocaleString('ru-RU')
    }));
  } catch {
    return [];
  }
}

function storedNumber(key, fallback) {
  return Number(localStorage.getItem(key) || String(fallback));
}

export function deriveStickStats(entries, packPrice, sticksPerPack) {
  const todayCount = getTodayCount(entries);
  const sorted = [...entries].sort((a, b) => b.date - a.date);
  const costPerStick = sticksPerPack > 0 ? packPrice / sticksPerPack : 0;

  return {
    todayCount,
    timeSinceLast: sorted.length > 0
      ? Math.round((Date.now() - sorted[0].date.getTime()) / 60000)
      : null,
    moneySpentToday: todayCount * costPerStick,
    moneySpentTotal: entries.length * costPerStick
  };
}

export default function useStickData() {
  const [entries, setEntries] = useState(loadEntries);
  const [intervalMinutes, setIntervalMinutes] = useState(() => storedNumber(INTERVAL_KEY, 60));
  const [packPrice, setPackPrice] = useState(() => storedNumber(PRICE_KEY, 200));
  const [sticksPerPack, setSticksPerPack] = useState(() => storedNumber(PER_PACK_KEY, 20));
  const [dailyLimit, setDailyLimit] = useState(() => storedNumber(DAILY_LIMIT_KEY, 10));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.map(entry => ({
        iso: entry.iso, id: entry.id, tag: entry.tag || null
      }))));
    } catch {}
  }, [entries]);
  useEffect(() => { localStorage.setItem(INTERVAL_KEY, String(intervalMinutes)); }, [intervalMinutes]);
  useEffect(() => { localStorage.setItem(PRICE_KEY, String(packPrice)); }, [packPrice]);
  useEffect(() => { localStorage.setItem(PER_PACK_KEY, String(sticksPerPack)); }, [sticksPerPack]);
  useEffect(() => { localStorage.setItem(DAILY_LIMIT_KEY, String(dailyLimit)); }, [dailyLimit]);

  return {
    entries, setEntries,
    intervalMinutes, setIntervalMinutes,
    packPrice, setPackPrice,
    sticksPerPack, setSticksPerPack,
    dailyLimit, setDailyLimit,
    ...deriveStickStats(entries, packPrice, sticksPerPack)
  };
}
