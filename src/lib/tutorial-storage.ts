const TUTORIAL_SEEN_KEY = "shifty:tutorial-seen";

export function hasSeenTutorial(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(TUTORIAL_SEEN_KEY) === "1";
}

export function markTutorialSeen(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
}
