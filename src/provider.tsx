import React from "react";
import { Provider as KeyHandlerProvider} from "./focused-stack/context";
import { FocusGroup } from "./focus-group";

interface OwnProps {
  children: React.ReactNode;
  timeout?: number; // Number of miliseconds to wait before timing our a melody
}

export function Provider({ children, timeout}: OwnProps) {

  return (
    <KeyHandlerProvider timeout={timeout}>
      <FocusGroup>{children}</FocusGroup>
    </KeyHandlerProvider>
  );
}
