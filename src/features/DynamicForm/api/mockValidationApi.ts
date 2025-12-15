import type { AsyncValidatorFn } from '../types/jobApplication.types';

function hasEmailDomainTaken(email: string): boolean {
  const lower = String(email || '').toLowerCase();

  if (!lower) return false;
  if (lower.includes('@microsoft.com')) return true;

  return false;
}

export const checkEmailUniqueApi: AsyncValidatorFn = async (email, signal) => {
  const delay = 500;

  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => resolve(), delay);
    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(t);
          reject(new DOMException('Aborted', 'AbortError'));
        },
        { once: true },
      );
    }
  });

  if (!email || typeof email !== 'string') {
    return { ok: false, reason: 'invalid' };
  }

  const rejected = hasEmailDomainTaken(email);
  if (rejected) return { ok: false, reason: 'The email domain is restricted' };

  return { ok: true };
};
