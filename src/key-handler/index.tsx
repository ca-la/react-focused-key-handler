import { matchTrigger } from "../utils";

export enum EventType {
  Keydown = "keydown",
  Keyup = "keyup",
}

export enum Modifier {
  Meta = "Meta",
  Shift = "Shift",
  Control = "Control",
  Alt = "Alt",
}

export interface Trigger {
  key: typeof KeyboardEvent.prototype.code;
  modifiers?: Modifier[];
  shouldTriggerInInputs?: boolean;
}

type KeyboardEventHandler = (event: KeyboardEvent) => void;

export interface KeyHandlerProps {
  eventType?: EventType;
  triggers: Trigger[];
  handler: KeyboardEventHandler;
}

export function createMatchingKeyHandler(
  triggers: Trigger[],
  handler: KeyboardEventHandler
): KeyboardEventHandler {
  return (event: KeyboardEvent): void => {
    if (triggers.length === 0) {
      return;
    }

    if (triggers.some(matchTrigger.bind(null, event))) {
      handler(event);
    }
  };
}

export { default } from "./body";
