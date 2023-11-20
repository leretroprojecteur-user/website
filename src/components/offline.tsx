"use client";

import { useOfflineStore } from "@/lib/offline";

import styles from "./offline.module.css";

export default function Offline() {
  const offline = useOfflineStore((s) => s.offline);

  return (
    <div
      className={styles.offlineContainer}
      style={{
        ...(offline ? {} : { visibility: "hidden" }),
      }}
    >
      <div className={styles.centered}>
        <p>Vous êtes hors-ligne.</p>
        <p>Connectez-vous à internet pour utiliser Le Rétroprojecteur.</p>
      </div>
    </div>
  );
}
