import * as React from "react";
import { DEFAULT_APPS, DEFAULT_GROUPS, DEFAULT_MODULES, App, Group, Module, seedRecords } from "./defaults";

const K = {
  apps: "grc.apps",
  groups: "grc.groups",
  modules: "grc.modules",
  records: "grc.records",
  theme: "grc.theme",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function ensureSeed() {
  if (!localStorage.getItem(K.groups)) save(K.groups, DEFAULT_GROUPS);
  if (!localStorage.getItem(K.apps)) save(K.apps, DEFAULT_APPS);
  if (!localStorage.getItem(K.modules)) save(K.modules, DEFAULT_MODULES);
}
ensureSeed();

const listeners = new Set<() => void>();
export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
function notify() { listeners.forEach(fn => fn()); }

export const Groups = {
  list: (): Group[] => load(K.groups, DEFAULT_GROUPS),
  create: (g: Omit<Group, "id">) => {
    const item: Group = { ...g, id: uid("g") };
    save(K.groups, [...Groups.list(), item]);
    notify();
    return item;
  },
};

export const Apps = {
  list: (): App[] => load(K.apps, DEFAULT_APPS),
  get: (id: string) => Apps.list().find(a => a.id === id),
  create: (a: Omit<App, "id" | "createdAt">) => {
    const item: App = { ...a, id: uid("a"), createdAt: new Date().toISOString() };
    save(K.apps, [...Apps.list(), item]);
    notify();
    return item;
  },
  update: (id: string, patch: Partial<App>) => {
    save(K.apps, Apps.list().map(a => a.id === id ? { ...a, ...patch } : a));
    notify();
  },
  remove: (id: string) => {
    save(K.apps, Apps.list().filter(a => a.id !== id));
    notify();
  },
  reorder: (ids: string[]) => {
    const map = new Map(Apps.list().map(a => [a.id, a]));
    save(K.apps, ids.map(id => map.get(id)!).filter(Boolean));
    notify();
  },
};

export const ModuleApi = {
  list: (): Module[] => load(K.modules, DEFAULT_MODULES),
  create: (m: Omit<Module, "id">) => {
    const item: Module = { ...m, id: uid("m") };
    save(K.modules, [...ModuleApi.list(), item]);
    notify();
    return item;
  },
  update: (id: string, patch: Partial<Module>) => {
    save(K.modules, ModuleApi.list().map(m => m.id === id ? { ...m, ...patch } : m));
    notify();
  },
  remove: (id: string) => {
    save(K.modules, ModuleApi.list().filter(m => m.id !== id));
    notify();
  },
};

export type Row = { id: string; [k: string]: any };
type RecordMap = { [key: string]: Row[] };

export const Records = {
  key: (appId: string, moduleName: string) => `${appId}::${moduleName}`,
  list: (appId: string, moduleName: string): Row[] => {
    const all = load<RecordMap>(K.records, {});
    const k = Records.key(appId, moduleName);
    if (!all[k]) {
      all[k] = seedRecords(moduleName);
      save(K.records, all);
    }
    return all[k];
  },
  save: (appId: string, moduleName: string, items: Row[]) => {
    const all = load<RecordMap>(K.records, {});
    all[Records.key(appId, moduleName)] = items;
    save(K.records, all);
    notify();
  },
  create: (appId: string, moduleName: string, item: Omit<Row, "id">) => {
    const list = Records.list(appId, moduleName);
    const it: Row = { ...item, id: uid("r") };
    Records.save(appId, moduleName, [it, ...list]);
    return it;
  },
  update: (appId: string, moduleName: string, id: string, patch: Partial<Row>) => {
    Records.save(appId, moduleName, Records.list(appId, moduleName).map(r => r.id === id ? { ...r, ...patch } : r));
  },
  remove: (appId: string, moduleName: string, id: string) => {
    Records.save(appId, moduleName, Records.list(appId, moduleName).filter(r => r.id !== id));
  },
};

export function resetDemoData() {
  Object.values(K).forEach(k => localStorage.removeItem(k));
  ensureSeed();
  notify();
}

export function useStoreVersion() {
  const [, set] = React.useState(0);
  React.useEffect(() => subscribe(() => set(n => n + 1)), []);
}
