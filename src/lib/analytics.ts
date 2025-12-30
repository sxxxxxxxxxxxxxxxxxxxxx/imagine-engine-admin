"use client";

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.clarity === "function") {
    try {
      w.clarity("event", name, properties || {});
    } catch {}
  }
}

export function identifyUser(id: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.clarity === "function") {
    try {
      w.clarity("identify", id);
      if (properties) {
        Object.entries(properties).forEach(([k, v]) => w.clarity("set", k, v));
      }
    } catch {}
  }
}