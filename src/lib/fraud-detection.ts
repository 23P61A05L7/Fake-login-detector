// Disposable email domains list
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', '10minutemail.com',
  'throwaway.email', 'yopmail.com', 'sharklasers.com', 'grr.la',
  'guerrillamailblock.com', 'pokemail.net', 'spam4.me', 'trashmail.com',
  'dispostable.com', 'maildrop.cc', 'fakeinbox.com', 'mailnesia.com',
  'tempr.email', 'discard.email', 'tempail.com', 'mohmal.com',
  'getnada.com', 'emailondeck.com', 'temp-mail.org', 'minutemail.com',
  'mailcatch.com', 'mytemp.email', 'binkmail.com', 'spamdecoy.net',
];

// Suspicious username patterns
const KEYBOARD_PATTERNS = ['qwerty', 'asdfg', 'zxcvb', 'qazwsx', 'wasd'];
const SEQUENTIAL_PATTERNS = ['12345', '23456', '34567', 'abcde', 'bcdef'];

export interface FraudCheckResult {
  score: number; // 0-100
  checks: FraudCheck[];
  status: 'clean' | 'suspicious' | 'blocked';
}

export interface FraudCheck {
  name: string;
  passed: boolean;
  weight: number;
  detail: string;
}

export function detectFraud(
  email: string,
  username: string,
  ip: string = '192.168.1.1'
): FraudCheckResult {
  const checks: FraudCheck[] = [];
  let score = 0;

  // 1. Disposable email check (weight: 30)
  const emailDomain = email.split('@')[1]?.toLowerCase() || '';
  const isDisposable = DISPOSABLE_DOMAINS.includes(emailDomain);
  checks.push({
    name: 'Disposable Email',
    passed: !isDisposable,
    weight: 30,
    detail: isDisposable
      ? `${emailDomain} is a known disposable email provider`
      : 'Email domain is legitimate',
  });
  if (isDisposable) score += 30;

  // 2. Email format check (weight: 10)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validEmail = emailRegex.test(email);
  checks.push({
    name: 'Email Format',
    passed: validEmail,
    weight: 10,
    detail: validEmail ? 'Valid email format' : 'Invalid email format detected',
  });
  if (!validEmail) score += 10;

  // 3. Username: all numbers (weight: 15)
  const allNumbers = /^\d+$/.test(username);
  checks.push({
    name: 'Numeric Username',
    passed: !allNumbers,
    weight: 15,
    detail: allNumbers
      ? 'Username contains only numbers — common bot pattern'
      : 'Username has alphabetic characters',
  });
  if (allNumbers) score += 15;

  // 4. Username: keyboard/sequential patterns (weight: 15)
  const lowerUser = username.toLowerCase();
  const hasPattern = [...KEYBOARD_PATTERNS, ...SEQUENTIAL_PATTERNS].some((p) =>
    lowerUser.includes(p)
  );
  checks.push({
    name: 'Pattern Detection',
    passed: !hasPattern,
    weight: 15,
    detail: hasPattern
      ? 'Username contains keyboard walk or sequential pattern'
      : 'No suspicious patterns found',
  });
  if (hasPattern) score += 15;

  // 5. Username: random-looking string (high consonant ratio) (weight: 10)
  const consonants = (lowerUser.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;
  const vowels = (lowerUser.match(/[aeiou]/g) || []).length;
  const isRandom = username.length > 4 && vowels === 0;
  checks.push({
    name: 'Randomness Check',
    passed: !isRandom,
    weight: 10,
    detail: isRandom
      ? 'Username appears randomly generated (no vowels)'
      : 'Username has natural character distribution',
  });
  if (isRandom) score += 10;

  // 6. Username length check (weight: 5)
  const tooShort = username.length < 3;
  const tooLong = username.length > 30;
  const badLength = tooShort || tooLong;
  checks.push({
    name: 'Length Check',
    passed: !badLength,
    weight: 5,
    detail: badLength
      ? `Username is ${tooShort ? 'too short' : 'too long'}`
      : 'Username length is acceptable',
  });
  if (badLength) score += 5;

  // 7. Repeated characters (weight: 10)
  const repeatedChar = /(.)\1{3,}/.test(username);
  checks.push({
    name: 'Repeated Characters',
    passed: !repeatedChar,
    weight: 10,
    detail: repeatedChar
      ? 'Username has excessive repeated characters'
      : 'No excessive repetition',
  });
  if (repeatedChar) score += 10;

  // 8. Email-username similarity (weight: 5)
  const emailLocal = email.split('@')[0]?.toLowerCase() || '';
  const similar = emailLocal === lowerUser;
  // This is actually fine, just a data point
  checks.push({
    name: 'Email-Username Match',
    passed: true,
    weight: 0,
    detail: similar
      ? 'Username matches email local part (common for real users)'
      : 'Username differs from email',
  });

  const status: FraudCheckResult['status'] =
    score >= 50 ? 'blocked' : score >= 25 ? 'suspicious' : 'clean';

  return { score, checks, status };
}

// Rate limiter (in-memory for demo)
const registrationLog: Map<string, number[]> = new Map();

export function checkRateLimit(ip: string, windowMs: number = 60000, maxRequests: number = 5): {
  allowed: boolean;
  remaining: number;
  detail: string;
} {
  const now = Date.now();
  const timestamps = registrationLog.get(ip) || [];
  const recentTimestamps = timestamps.filter((t) => now - t < windowMs);

  recentTimestamps.push(now);
  registrationLog.set(ip, recentTimestamps);

  const allowed = recentTimestamps.length <= maxRequests;
  return {
    allowed,
    remaining: Math.max(0, maxRequests - recentTimestamps.length),
    detail: allowed
      ? `${maxRequests - recentTimestamps.length} requests remaining`
      : `Rate limit exceeded (${recentTimestamps.length}/${maxRequests} in window)`,
  };
}

// Activity log for dashboard
export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  email: string;
  username: string;
  ip: string;
  score: number;
  status: 'clean' | 'suspicious' | 'blocked';
}

let activityLog: ActivityLogEntry[] = [];

export function addToLog(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>): ActivityLogEntry {
  const newEntry: ActivityLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
  activityLog = [newEntry, ...activityLog].slice(0, 100);
  return newEntry;
}

export function getActivityLog(): ActivityLogEntry[] {
  return activityLog;
}

export function getStats() {
  const total = activityLog.length;
  const blocked = activityLog.filter((e) => e.status === 'blocked').length;
  const suspicious = activityLog.filter((e) => e.status === 'suspicious').length;
  const clean = activityLog.filter((e) => e.status === 'clean').length;
  const avgScore = total > 0 ? activityLog.reduce((s, e) => s + e.score, 0) / total : 0;

  return { total, blocked, suspicious, clean, avgScore };
}
