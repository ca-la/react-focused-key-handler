import { Modifier, Trigger } from '../key-handler';

function matchModifier(event: KeyboardEvent, modifier: Modifier): boolean {
  switch (modifier) {
    case Modifier.Meta:
      return event.metaKey;
    case Modifier.Shift:
      return event.shiftKey;
    case Modifier.Control:
      return event.ctrlKey;
    case Modifier.Alt:
      return event.altKey;
  }
  return false;
}

function countModifiers(event: KeyboardEvent): number {
  return (
    Number(event.altKey) +
    Number(event.ctrlKey) +
    Number(event.shiftKey) +
    Number(event.metaKey)
  );
}

export function matchTrigger(event: KeyboardEvent, trigger: Trigger): boolean {
  const target = event.target as HTMLElement | null;
  const isContentEditable = target
    ? target.nodeName === 'INPUT' || target.isContentEditable
    : false;

  if (isContentEditable && !trigger.shouldTriggerInInputs) {
    return false;
  }

  if (!trigger.modifiers || trigger.modifiers.length === 0) {
    return countModifiers(event) === 0 && trigger.key === event.code;
  }

  return (
    trigger.modifiers.every(matchModifier.bind(null, event)) &&
    trigger.modifiers.length === countModifiers(event) &&
    trigger.key === event.code
  );
}
