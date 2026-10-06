export default function getTodayCount(entries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return entries.filter(entry => entry.date >= today).length;
}
