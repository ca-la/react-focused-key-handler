import React from "react";
import { Provider as KeyHandlerProvider} from "./focused-stack/context";
import { FocusGroup } from "./focus-group";

interface OwnProps {
  children: React.ReactNode;
  timeOut?: number; // Number of miliseconds to wait before timing our a melody
}

export function Provider({ children, timeOut=2000 }: OwnProps) {

  return (
    <KeyHandlerProvider timeout={timeOut}>
      <FocusGroup>{children}</FocusGroup>
    </KeyHandlerProvider>
  );
}
