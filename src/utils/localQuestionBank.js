export const BANK_KEY = "questionBankV1";

export const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
};

export const generateQuestionHash = (text) => {
  if (!text) return "0";
  const normalized = text
    .toLowerCase()
    .replace(/\(question \d+\)$/i, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString();
};

export const loadLocalBank = () => {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(BANK_KEY);
  const data = raw ? safeParse(raw) : {};
  return data && typeof data === "object" ? data : {};
};

export const saveLocalBank = (bank) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BANK_KEY, JSON.stringify(bank));
  } catch {}
};

const normalizeTopics = (topics) => (Array.isArray(topics) ? topics.map(t => String(t).toLowerCase().trim()) : []);

export const getExistingTextsForTopics = (topics, limit = 50) => {
  const bank = loadLocalBank();
  const tks = normalizeTopics(topics);
  const set = new Set();
  const texts = [];
  tks.forEach(t => {
    const arr = Array.isArray(bank[t]) ? bank[t] : [];
    const recent = arr.slice(-limit);
    recent.forEach(q => {
      if (!set.has(q.hash)) {
        set.add(q.hash);
        texts.push(q.text);
      }
    });
  });
  return texts;
};

export const filterDuplicatesForTopics = (topics, items, getText) => {
  const bank = loadLocalBank();
  const tks = normalizeTopics(topics);
  const existing = new Set();
  tks.forEach(t => {
    const arr = Array.isArray(bank[t]) ? bank[t] : [];
    arr.forEach(q => existing.add(q.hash));
  });
  return items.filter(item => {
    const text = getText(item);
    const h = generateQuestionHash(text);
    return !existing.has(h);
  });
};

export const addToBank = (topics, items, getText) => {
  const bank = loadLocalBank();
  const tks = normalizeTopics(topics);
  const now = new Date().toISOString();
  tks.forEach(t => {
    if (!Array.isArray(bank[t])) bank[t] = [];
  });
  items.forEach(item => {
    const text = getText(item);
    const hash = generateQuestionHash(text);
    tks.forEach(t => {
      bank[t].push({ text, hash, addedAt: now });
      if (bank[t].length > 500) bank[t] = bank[t].slice(-500);
    });
  });
  saveLocalBank(bank);
};

export const makeRandomToken = () => `${Date.now()}-${Math.floor(Math.random()*1e9)}`;

