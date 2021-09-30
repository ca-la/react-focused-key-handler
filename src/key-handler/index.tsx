import { useEffect } from "react";

import { useFocusGroupId } from "../focus-group";
import { useFocusedStack } from "../focused-stack/context";
import { matchTrigger } from "../utils";

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
  triggers: Trigger[];
  handler: KeyboardEventHandler;
}

function createMatchingKeyHandler(
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

export function KeyHandler(props: KeyHandlerProps) {
  const { handler, triggers } = props;
  const handleKey = createMatchingKeyHandler(triggers, handler);
  const focusGroupId = useFocusGroupId();
  const focusedStack = useFocusedStack();

  useEffect(
    function handlerLifecycle() {
      if (focusGroupId !== null) {
        triggers.forEach((trigger: Trigger) =>
          focusedStack.pushHandler(focusGroupId, handleKey, trigger)
        );
      } else {
        document.body.addEventListener("keydown", handleKey);
      }

      return () => {
        if (focusGroupId !== null) {
          triggers.forEach((trigger: Trigger) =>
            focusedStack.removeAtIdAndTrigger(focusGroupId, trigger, handleKey)
          );
        } else {
          document.body.removeEventListener("keydown", handleKey);
        }
      };
    },
    [focusedStack, focusGroupId, handler, triggers, handleKey]
  );

  return null;
}
