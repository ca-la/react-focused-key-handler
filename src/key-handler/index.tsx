import { useLayoutEffect } from "react";

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

  useLayoutEffect(
    function handlerLifecycle() {
      if (focusGroupId === null) {
        return () => {
          /* consistent return type */
        };
      }

      triggers.forEach((trigger: Trigger) =>
        focusedStack.pushHandler(focusGroupId, handleKey, trigger)
      );

      return () => {
        triggers.forEach((trigger: Trigger) =>
          focusedStack.removeAtIdAndTrigger(focusGroupId, trigger, handleKey)
        );
      };
    },
    [focusedStack, focusGroupId, handler, triggers, handleKey]
  );

  return null;
}
