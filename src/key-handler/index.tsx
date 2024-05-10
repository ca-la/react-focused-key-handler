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

interface LeafProp {
  handler: KeyboardEventHandler;
  preventDefault?: boolean;
}

interface NodeProp {
  children: ReactNode;
}

export type KeyHandlerProps = { triggers: Trigger[] } & (LeafProp | NodeProp);

export function KeyHandler(props: KeyHandlerProps) {
  const { triggers, ...rest } = props;
  const focusGroupId = useFocusGroupId();
  const focusedStack = useFocusedStack();
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);
  const handler = "handler" in rest ? rest.handler : null;
  const children = "children" in rest ? rest.children : null;
  const preventDefault = "preventDefault" in rest ? rest.preventDefault : false;

  useLayoutEffect(
    function handlerLifecycle() {
      if (focusGroupId === null) {
        return () => {
          /* consistent return type */
        };
      }
      const wrappedHandler = (e: KeyboardEvent) => {
        if (preventDefault) {
          e.preventDefault();
        }

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
    return <FocusGroup>{children}</FocusGroup>;
  }
  return null;
}
