
export const uid = () => Math.random().toString(36).slice(2, 10);
export const money = (n=0) => (n||0).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
export const sum = (arr, sel = x => x) => arr.reduce((a, b) => a + (sel(b)||0), 0);
export const clone = obj => JSON.parse(JSON.stringify(obj));
