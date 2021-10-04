import React from "react";
import { Provider as KeyHandlerProvider } from "./focused-stack/context";
import { FocusGroup } from "./focus-group";

interface OwnProps {
  children: React.ReactNode;
}

export function Provider({ children }: OwnProps) {
  return (
    <KeyHandlerProvider>
      <FocusGroup>{children}</FocusGroup>
    </KeyHandlerProvider>
  );
}
