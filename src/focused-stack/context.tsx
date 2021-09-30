import React, {
  createContext,
  useLayoutEffect,
  useContext,
  ReactNode,
} from "react";
import { FocusedStack } from "./index";

const StackContext = createContext<FocusedStack | null>(null);

interface OwnProps {
  children: ReactNode;
}

export function Provider({ children }: OwnProps) {
  const focusedStack = new FocusedStack();

  useLayoutEffect(
    function attachListenerToBody() {
      const handler = (event: KeyboardEvent) => {
        focusedStack.fireEvent(event);
      };

      document.body.addEventListener("keydown", handler);

      return () => {
        document.body.removeEventListener("keydown", handler);
      };
    },
    [focusedStack]
  );

  return (
    <StackContext.Provider value={focusedStack}>
      {children}
    </StackContext.Provider>
  );
}

export function useFocusedStack(): FocusedStack {
  const focusedStack = useContext(StackContext);

  if (!focusedStack) {
    throw new Error("You must wrap KeyHandlers and FocusGroups in a Provider");
  }

  return focusedStack;
}