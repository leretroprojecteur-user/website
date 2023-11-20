"use client";

import { create } from "zustand";

export const useOfflineStore = create<{
  offline: boolean;
}>()(() => {
  return {
    offline: false,
  };
});

const setOffline = () => useOfflineStore.setState({ offline: true });

if (typeof window !== "undefined") {
  addEventListener("offline", setOffline);
}

export function safeFetch<T>(
  fallback: T,
  ...args: Parameters<typeof fetch>
): ReturnType<typeof fetch> {
  return fetch(...args)
    .then((response) => {
      return response;
    })
    .catch(() => {
      setOffline();
      return Response.json(fallback);
    });
}
