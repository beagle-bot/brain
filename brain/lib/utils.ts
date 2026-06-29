export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function uniqueList<T>(items: T[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

export function makeId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function includesAny(text: string, terms: string[]) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

export function formatList(items: string[]) {
  return items.length ? items.join(" / ") : "暂无";
}
