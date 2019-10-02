import * as React from 'react';
import FocusedHandlerStack from '../focused-stack';

export interface FocusContextValue {
  focusGroupId?: number;
}

export const FocusContext = React.createContext<FocusContextValue>({});

export class FocusGroup extends React.PureComponent {
  private focusGroupId = FocusedHandlerStack.getGroupId();
  constructor(props: {}) {
    super(props);
    FocusedHandlerStack.pushGroup(this.focusGroupId);
  }

  public componentWillUnmount(): void {
    FocusedHandlerStack.removeGroup(this.focusGroupId);
  }

  public render(): JSX.Element {
    return (
      <FocusContext.Provider value={{ focusGroupId: this.focusGroupId }}>
        {this.props.children}
      </FocusContext.Provider>
    );
  }
}
export const FocusContextConsumer = FocusContext.Consumer;
