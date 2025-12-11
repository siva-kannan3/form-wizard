export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timeoutId: number | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), delay);
  };
}
