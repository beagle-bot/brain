"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { generateOutput } from "@/lib/output";
import { createMemoryCard, createMemoryIntent, createMemoryManual, guessMemoryIntent, type IntentInput } from "@/lib/memory";
import { scoreItem } from "@/lib/scoring";
import { clearBrainState, createInitialState, loadBrainState, rawItems, saveBrainState } from "@/lib/storage";
import type { BrainState, Decision, GeneratedOutput, ItemScore, OutputType, RawItem, UserProfile } from "@/lib/types";
import { makeId, nowIso } from "@/lib/utils";

type BrainContextValue = {
  state: BrainState;
  hydrated: boolean;
  items: RawItem[];
  scores: ItemScore[];
  feedItems: RawItem[];
  saveProfile: (profile: UserProfile) => void;
  rememberItem: (itemId: string, intent?: IntentInput) => void;
  resetDemo: () => void;
  getItem: (itemId: string) => RawItem | undefined;
  getScore: (itemId: string) => ItemScore | undefined;
  createOutput: (outputType: OutputType) => GeneratedOutput;
};

const BrainContext = createContext<BrainContextValue | null>(null);

function upsertDecision(decisions: Decision[], decision: Decision) {
  return [...decisions.filter((item) => item.item_id !== decision.item_id), decision];
}

export function BrainProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BrainState>(() => createInitialState());
  const [items, setItems] = useState<RawItem[]>(rawItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadBrainState());
    setHydrated(true);
    fetch("/api/items")
      .then((response) => response.json())
      .then((payload: { items?: RawItem[] }) => {
        if (payload.items?.length) setItems(payload.items);
      })
      .catch(() => {
        setItems(rawItems);
      });
  }, []);

  const scores = useMemo(() => items.map((item) => scoreItem(item, state.profile)), [items, state.profile]);

  const decisionMap = useMemo(() => new Map(state.decisions.map((decision) => [decision.item_id, decision])), [state.decisions]);

  const feedItems = useMemo(() => {
    return items.filter((item) => decisionMap.get(item.id)?.decision !== "remembered");
  }, [decisionMap, items]);

  function commit(nextState: BrainState) {
    setState(nextState);
    saveBrainState(nextState);
  }

  function saveProfile(profile: UserProfile) {
    commit({ ...state, profile });
  }

  function rememberItem(itemId: string, input?: IntentInput) {
    const item = items.find((candidate) => candidate.id === itemId);
    if (!item) return;

    const score = scoreItem(item, state.profile);
    const existingDecision = state.decisions.find((decision) => decision.item_id === itemId);
    const decision: Decision = {
      id: existingDecision?.id ?? makeId("decision"),
      item_id: itemId,
      profile_id: state.profile.id,
      decision: "remembered",
      created_at: nowIso()
    };
    const guess = guessMemoryIntent(item, score, state.profile);
    const intentInput = input ?? guess;
    const intent = createMemoryIntent(item, decision.id, intentInput, guess.ai_guess_reason);
    const memory = createMemoryCard(item, score, state.profile, intent);
    intent.memory_id = memory.id;
    const manual = createMemoryManual(memory, item, score);

    const oldMemoryIds = state.memories.filter((candidate) => candidate.item_id === itemId).map((candidate) => candidate.id);
    const memoriesWithoutOld = state.memories.filter((candidate) => candidate.item_id !== itemId);
    const newMemories = [...memoriesWithoutOld, memory];
    const manualsWithoutOld = state.manuals.filter((candidate) => !oldMemoryIds.includes(candidate.memory_id));
    const nextState: BrainState = {
      ...state,
      decisions: upsertDecision(state.decisions, decision),
      intents: [...state.intents.filter((candidate) => candidate.item_id !== itemId), intent],
      memories: newMemories,
      manuals: [...manualsWithoutOld, manual],
      topics: state.topics
    };

    commit(nextState);
  }

  function resetDemo() {
    const nextState = createInitialState();
    clearBrainState();
    commit(nextState);
  }

  function getItem(itemId: string) {
    return items.find((item) => item.id === itemId) ?? rawItems.find((item) => item.id === itemId);
  }

  function getScore(itemId: string) {
    return scores.find((score) => score.item_id === itemId);
  }

  function createOutput(outputType: OutputType) {
    const output = generateOutput(state, outputType);
    commit({
      ...state,
      outputs: [...state.outputs, output]
    });
    return output;
  }

  const value = useMemo<BrainContextValue>(
    () => ({
      state,
      hydrated,
      items,
      scores,
      feedItems,
      saveProfile,
      rememberItem,
      resetDemo,
      getItem,
      getScore,
      createOutput
    }),
    [state, hydrated, items, scores, feedItems]
  );

  return <BrainContext.Provider value={value}>{children}</BrainContext.Provider>;
}

export function useBrain() {
  const context = useContext(BrainContext);
  if (!context) throw new Error("useBrain must be used within BrainProvider");
  return context;
}
