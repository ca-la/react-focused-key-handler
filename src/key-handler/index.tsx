import React, { useLayoutEffect } from "react";

import { useFocusGroupId, FocusGroup } from "../focus-group";
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
  handler?: KeyboardEventHandler;
  children? : React.node;
}

export function KeyHandler(props: KeyHandlerProps) {
  const { triggers } = props;
  let handler: KeyboardEventHandler  ;
  const focusGroupId = useFocusGroupId();
  const focusedStack = useFocusedStack();

  useLayoutEffect(
    function handlerLifecycle() {
      if (focusGroupId === null) {
        return () => {
          /* consistent return type */
        };
      }
	    if (props.handler){
		    handler = props.handler;
	    }
	    else{
		    //focusedStack.pushHandler(focusGroupId, () =>{}, triggers)
		    handler = () =>{
			    focusedStack.startClock();

			    return(
				<FocusGroup isPartOfMelody={true}>
					{props.children}
				</FocusGroup>
			    );
		    }
	    }

      return () => {
        triggers.forEach((trigger: Trigger) =>
          focusedStack.removeAtIdAndTrigger(focusGroupId, trigger, handler)
        );
      };
    },
    [focusedStack, focusGroupId]
  );

  return null;
}
