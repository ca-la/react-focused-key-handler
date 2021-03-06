import { omit } from "lodash";
import { Modifier, Trigger } from "../key-handler";

type Handler = (event: KeyboardEvent) => void;

interface HandlerObject {
  key: string;
  handler: Handler;
  shouldTriggerInInputs?: boolean;
}

interface HandlerGroup {
  groupId: number;
  handlers: { [key: string]: HandlerObject };
}

class FocusedKeyHandlerStack {
  private keyGenId: number;
  private stack: HandlerGroup[];

  constructor() {
    this.keyGenId = 0;
    this.stack = [];
  }

  public getGroupId = (): number => {
    const key = this.keyGenId;
    this.keyGenId += 1;
    return key;
  };

  public getKeyCodeFromEvent = (e: KeyboardEvent): string => {
    const key = e.code;
    const modifiers = [];
    if (e.altKey) {
      modifiers.push(Modifier.Alt);
    }
    if (e.ctrlKey) {
      modifiers.push(Modifier.Control);
    }
    if (e.metaKey) {
      modifiers.push(Modifier.Meta);
    }
    if (e.shiftKey) {
      modifiers.push(Modifier.Shift);
    }
    return `${key}${modifiers.join("-")}`;
  };

  public fireEvent = (e: KeyboardEvent): void => {
    if (this.stack.length === 0) {
      return;
    }
    const key = this.getKeyCodeFromEvent(e);

    const handlerGroup = this.stack[this.stack.length - 1];
    const handlerObject = handlerGroup.handlers[key];
    if (!handlerObject) {
      return;
    }
    const target = e.target as HTMLElement | null;
    const isContentEditable = target
      ? target.nodeName === "INPUT" || target.isContentEditable
      : false;
    const isContentEditableAndShouldTrigger =
      isContentEditable && handlerObject.shouldTriggerInInputs;

    if (
      handlerObject &&
      (!isContentEditable || isContentEditableAndShouldTrigger)
    ) {
      handlerObject.handler(e);
    }
  };

  public pushGroup = (groupId: number): void => {
    this.stack.push({
      groupId,
      handlers: {},
    });
  };

  public pushHandler = (
    groupId: number,
    handler: Handler,
    trigger: Trigger
  ): void => {
    const key = this.getKey(trigger);
    const found = this.stack.find(
      (thing: HandlerGroup) => thing.groupId === groupId
    );
    if (!found) {
      return;
    }

    found.handlers[key] = {
      handler,
      key,
      shouldTriggerInInputs: trigger.shouldTriggerInInputs,
    };
  };

  public removeAtIdAndTrigger = (groupId: number, trigger: Trigger): void => {
    const handlerKey = this.getKey(trigger);
    this.stack = this.stack.map((group: HandlerGroup) => {
      if (group.groupId === groupId) {
        // eslint-disable-next-line no-param-reassign
        group.handlers = omit(group.handlers, handlerKey);
      }
      return group;
    });
  };

  public removeGroup = (groupId: number): void => {
    this.stack = this.stack.filter(
      (group: HandlerGroup) => group.groupId !== groupId
    );
  };

  private getKey = (trigger: Trigger): string => {
    return `${trigger.key}${
      trigger.modifiers ? trigger.modifiers.sort().join("-") : ""
    }`;
  };
}

const instance = new FocusedKeyHandlerStack();

export default instance;
