import * as React from "react";
import {
  createMatchingKeyHandler,
  EventType,
  KeyHandlerProps as OwnProps,
  Trigger,
} from "./index";
import FocusedHandlerStack from "../focused-stack";
import { FocusContext } from "../focus-context";

export default class KeyHandler extends React.Component<OwnProps> {
  private eventType: EventType;

  private handleKey = createMatchingKeyHandler(
    this.props.triggers,
    this.props.handler
  );

  constructor(props: OwnProps) {
    super(props);

    this.eventType = props.eventType || EventType.Keydown;
  }

  public componentDidMount(): void {
    this.addListeners();
  }

  public componentDidUpdate(prevProps: OwnProps): void {
    if (
      prevProps.handler !== this.props.handler ||
      prevProps.triggers !== this.props.triggers
    ) {
      this.removeListeners();
      this.handleKey = createMatchingKeyHandler(
        this.props.triggers,
        this.props.handler
      );
      this.addListeners();
    }
  }

  public componentWillUnmount(): void {
    this.removeListeners();
  }

  public render(): null {
    return null;
  }

  private addListeners = (): void => {
    // TODO This isnt deprecated, React Docs say its fine.
    // tslint:disable-next-line: deprecation
    const { focusGroupId } = this.context;
    if (focusGroupId !== undefined) {
      this.props.triggers.forEach((trigger: Trigger) =>
        FocusedHandlerStack.pushHandler(focusGroupId, this.handleKey, trigger)
      );
    } else {
      document.body.addEventListener(this.eventType, this.handleKey);
    }
  };

  private removeListeners = (): void => {
    // tslint:disable-next-line: deprecation
    const { focusGroupId } = this.context;
    if (focusGroupId !== undefined) {
      this.props.triggers.forEach((trigger: Trigger) =>
        FocusedHandlerStack.removeAtIdAndTrigger(
          focusGroupId,
          trigger,
          this.handleKey
        )
      );
    } else {
      document.body.removeEventListener(this.eventType, this.handleKey);
    }
  };
}

KeyHandler.contextType = FocusContext;
