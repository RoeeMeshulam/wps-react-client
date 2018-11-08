import { queryHistoryStorageKey } from "../../config";

export function setQueryHistory(history) {
  localStorage.setItem(queryHistoryStorageKey, history);
}

export function getQueryHistory() {
  return localStorage.getItem(queryHistoryStorageKey);
}
