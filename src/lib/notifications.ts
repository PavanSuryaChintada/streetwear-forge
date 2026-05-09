const KEY = "sd_admin_last_seen"; // timestamp ms

export const getLastSeen = () => {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(KEY) || 0);
};
export const markSeen = () => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, String(Date.now()));
};
