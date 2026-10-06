export default function stickNoun(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'стик';
  if ([2, 3, 4].includes(count % 10) && (count % 100 < 12 || count % 100 > 14)) return 'стика';
  return 'стиков';
}
