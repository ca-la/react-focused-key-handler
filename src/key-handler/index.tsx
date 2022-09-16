import React, { ReactNode, useState, useLayoutEffect } from "react";

import { useFocusGroupId, FocusGroup } from "../focus-group";
import { useFocusedStack } from "../focused-stack/context";

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
  handler?: KeyboardEventHandler;
  children?: ReactNode;
}

export function KeyHandler(props: KeyHandlerProps) {
  const { triggers, handler } = props;
  const focusGroupId = useFocusGroupId();
  const focusedStack = useFocusedStack();
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useLayoutEffect(
    function handlerLifecycle() {
      if (focusGroupId === null) {
        return () => {
          /* consistent return type */
        };
      }
      const wrappedHandler = (e: KeyboardEvent) => {
        if (handler) {
          handler(e);
          focusedStack.tearDown();
        } else {
          focusedStack.startClock();
          setShouldRenderChildren(true);
          focusedStack.registerTeardown(() => setShouldRenderChildren(false));
        }
      };
      triggers.forEach((trigger: Trigger) =>
        focusedStack.pushHandler(focusGroupId, wrappedHandler, trigger)
      );

      return () => {
        triggers.forEach((trigger: Trigger) =>
          focusedStack.removeAtIdAndTrigger(
            focusGroupId,
            trigger,
            wrappedHandler
          )
        );
      };
    },
    [focusedStack, focusGroupId, handler, triggers]
  );

  if (shouldRenderChildren) {
    return <FocusGroup>{props.children}</FocusGroup>;
  }
  return null;
}
