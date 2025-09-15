
import { uid, clone } from './helpers.js';

const KEY = 'lgd_v2_store';

const defaults = {
  clients: [],
  products: [
    { id: uid(), name: 'Chocolate Bar', price: 2.50, stock: 100 },
    { id: uid(), name: 'Gummy Bears', price: 3.20, stock: 80 },
    { id: uid(), name: 'Lollipop', price: 1.80, stock: 150 }
  ],
  orders: [],
  expenses: []
};

let state = (() => {
  try { return JSON.parse(localStorage.getItem(KEY)) || clone(defaults); }
  catch { return clone(defaults); }
})();

const listeners = new Set();

const notify = () => listeners.forEach(fn => fn(getState()));

const persist = () => localStorage.setItem(KEY, JSON.stringify(state));

export function subscribe(fn){
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState(){ return clone(state); }

function set(partial){
  state = Object.assign({}, state, partial);
  persist(); notify();
}

// ------- CRUD helpers ----------
export const addClient = (c) => { c.id = uid(); set({ clients: [...state.clients, c] }); return c; };
export const updateClient = (id, patch) => set({ clients: state.clients.map(x => x.id===id? {...x, ...patch}: x) });
export const deleteClient = (id) => set({ clients: state.clients.filter(x => x.id!==id) });

export const addProduct = (p) => { p.id = uid(); set({ products: [...state.products, p] }); return p; };
export const updateProduct = (id, patch) => set({ products: state.products.map(x => x.id===id? {...x, ...patch}: x) });
export const deleteProduct = (id) => set({ products: state.products.filter(x => x.id!==id) });

export const addExpense = (e) => { e.id = uid(); set({ expenses: [...state.expenses, e] }); return e; };
export const deleteExpense = (id) => set({ expenses: state.expenses.filter(x => x.id!==id) });

export const addOrder = (o) => { o.id = uid(); o.createdAt = new Date().toISOString(); set({ orders: [o, ...state.orders] }); return o; };
export const updateOrder = (id, patch) => set({ orders: state.orders.map(x => x.id===id? {...x, ...patch}: x) });

// ------- Settings ----------
export const resetAll = () => { state = clone(defaults); persist(); notify(); };
export const exportJSON = () => new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
export const importJSON = async (file) => {
  const text = await file.text();
  const data = JSON.parse(text);
  state = Object.assign(clone(defaults), data);
  persist(); notify();
};

// ------- Derivations ----------
export function metrics(){
  const revenue = state.orders.filter(o=>o.status==='paid').reduce((s,o)=> s+o.total, 0);
  const openInvoices = state.orders.filter(o=>o.status!=='paid').length;
  const profit = revenue - state.expenses.reduce((s,e)=> s + e.amount, 0);
  return {
    revenue, openInvoices,
    orders: state.orders.length,
    clients: state.clients.length,
    products: state.products.length,
    expenses: state.expenses.length,
    profit
  };
}
