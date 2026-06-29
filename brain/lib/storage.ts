import mockItems from "@/data/mock-aihot-items.json";
import { defaultProfile } from "@/lib/profile";
import type { BrainState, RawItem } from "@/lib/types";

export const rawItems = mockItems as RawItem[];

const STORAGE_KEY = "brain-v0.1-state";

export function createInitialState(): BrainState {
  return {
    profile: defaultProfile,
    decisions: [],
    intents: [],
    memories: [],
    manuals: [],
    topics: [],
    outputs: []
  };
}

export function loadBrainState(): BrainState {
  if (typeof window === "undefined") return createInitialState();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return createInitialState();

  try {
    const parsed = JSON.parse(raw) as Partial<BrainState>;
    return {
      ...createInitialState(),
      ...parsed,
      profile: {
        ...defaultProfile,
        ...parsed.profile
      }
    };
  } catch {
    return createInitialState();
  }
}

export function saveBrainState(state: BrainState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearBrainState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
