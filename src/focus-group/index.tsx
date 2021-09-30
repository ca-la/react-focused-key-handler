import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  ReactNode,
} from "react";
import { useFocusedStack } from "../focused-stack/context";

export interface FocusContextValue {
  focusGroupId: number | null;
}

export const FocusContext = createContext<FocusContextValue>({
  focusGroupId: null,
});

interface OwnProps {
  children?: ReactNode;
}

export function FocusGroup(props: OwnProps) {
  const focusedStack = useFocusedStack();
  const focusGroupId = useMemo(() => focusedStack.getGroupId(), [focusedStack]);

  // Layout effect fires before rendering children to ensure that groups are
  // pushed before handlers are added
  useLayoutEffect(
    function groupLifecycle() {
      focusedStack.pushGroup(focusGroupId);

      return () => {
        focusedStack.removeGroup(focusGroupId);
      };
    },
    [focusGroupId, focusedStack]
  );

  return (
    <FocusContext.Provider value={{ focusGroupId }}>
      {props.children}
    </FocusContext.Provider>
  );
}

export const FocusContextConsumer = FocusContext.Consumer;

export function useFocusGroupId() {
  const { focusGroupId } = useContext(FocusContext);

  return focusGroupId;
}
