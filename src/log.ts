export const log = (...messages) =>
  console.log(`[${new Date().toUTCString()}]`, ...messages);

export const warn = (...messages) =>
  console.warn(`[${new Date().toUTCString()}]`, ...messages);

export const table = (...messages) => console.table(...messages);
