import { CarTab, TabState } from '@/types/car-tabs';

export function getNextTab(
  current: CarTab,
  order: CarTab[],
  states: Record<CarTab, TabState>
): CarTab | null {
  const index = order.indexOf(current);

  for (let i = index + 1; i < order.length; i++) {
    const tab = order[i];
    const state = states[tab];

    if (state === 'enabled') {
      return tab;
    }
  }

  return null;
}

export function getPrevTab(
  current: CarTab,
  order: CarTab[],
  states: Record<CarTab, TabState>
): CarTab | null {
  const index = order.indexOf(current);

  for (let i = index - 1; i >= 0; i--) {
    const tab = order[i];
    const state = states[tab];

    if (state === 'completed' || state === 'enabled') {
      return tab;
    }
  }

  return null;
}

export function canGoNext(
  current: CarTab,
  next: CarTab | null,
  states: Record<CarTab, TabState>
): boolean {
  if (!next) return false;
  
  return (
    states[current] === 'completed' &&
    (states[next] === 'enabled' || states[next] === 'completed')
  );
}

export function canGoPrev(prev: CarTab | null): boolean {
  return Boolean(prev);
}
