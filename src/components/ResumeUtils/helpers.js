export const generateUniqueId = () => typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
