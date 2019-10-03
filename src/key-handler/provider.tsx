import * as React from 'react';
import { EventType } from './index';
import FocusedHandlerStack from '../focused-stack';

export class Provider extends React.PureComponent {
  public componentDidMount(): void {
    document.body.addEventListener(EventType.Keydown, this.handleKey);
  }

  public componentWillUnmount(): void {
    document.body.removeEventListener(EventType.Keydown, this.handleKey);
  }

  public render(): null {
    return null;
  }

  private handleKey = (e: KeyboardEvent): void => {
    FocusedHandlerStack.fireEvent(e);
  };
}
