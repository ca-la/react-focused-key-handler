import { Modifier, Trigger } from "../key-handler";

type Handler = (event: KeyboardEvent) => void;

interface HandlerObject {
  key: string;
  handler: Handler;
  shouldTriggerInInputs?: boolean;
}

interface HandlerGroup {
  groupId: number;
  handlers: { [key: string]: HandlerObject[] };
}

export class FocusedStack {
  private keyGenId: number;
  private stack: HandlerGroup[];
  private tearDownHandler: () => void | null;
  private clock: number| null;  //the returned timerID value from setTimeout() is a positive integer 

  constructor() {
    this.keyGenId = 0;
    this.stack = [];
    this.tearDownHandler = null;
	  this.clock = null;
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

    const handlerGroup = this.stack.reduce(
      (acc: HandlerGroup | null, group: HandlerGroup): HandlerGroup | null => {
        if (acc === null) {
          return group;
        }

        if (group.groupId > acc.groupId) {
          return group;
        }

        return acc;
      },
      null
    );

    if (!handlerGroup) {
      return;
    }

    const handlerObjects = handlerGroup.handlers[key];

    if (!handlerObjects) {
      return;
    }
    const target = e.target as HTMLElement | null;
    const isContentEditable = target
      ? target.nodeName === "INPUT" ||
        target.nodeName === "TEXTAREA" ||
        target.isContentEditable
      : false;

    for (const handlerObject of handlerObjects) {
      const isContentEditableAndShouldTrigger =
        isContentEditable && handlerObject.shouldTriggerInInputs;

      if (
        (!isContentEditable || isContentEditableAndShouldTrigger)
      ) {
        handlerObject.handler(e);
      }
    }
  };

  public pushGroup = (groupId: number): void => {
    const exists = this.stack.find(
      (group: HandlerGroup) => group.groupId === groupId
    );

    if (exists) {
      return;
    }

    this.stack.push({
      groupId,
      handlers: {},
    });
  };
	
  public registerTeardown = (callback: () => void): void => {
    if (tearDownHandler === null) {
      this.tearDownHandler = callback;
    }
  }

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

    const existingHandlers = found.handlers[key] || [];

    found.handlers[key] = [
      ...existingHandlers,
      {
        handler,
        key,
        shouldTriggerInInputs: trigger.shouldTriggerInInputs,
      },
    ];
  };

  public removeAtIdAndTrigger = (
    groupId: number,
    trigger: Trigger,
    handler: Handler
  ): void => {
    const handlerKey = this.getKey(trigger);
    this.stack = this.stack.map((group: HandlerGroup) => {
      if (group.groupId === groupId) {
        const handlersAtKey = group.handlers[handlerKey] || [];
        // eslint-disable-next-line no-param-reassign
        group.handlers = {
          ...group.handlers,
          [handlerKey]: handlersAtKey.filter(
            (handlerObject: HandlerObject) => handlerObject.handler !== handler
          ),
        };
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

  private tearDown = (): number[] => {
	  this.tearDownHandler?.();
    this.tearDownHandler = null;
  }

  public startClock = () => {
	  if(this.clock){
		  clearTimeout(this.clock);
	  }
	  this.clock = setTimeout(() => {this.tearDown()}, 2000);
  }

}
