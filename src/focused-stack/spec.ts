import { FocusedStack } from "./index";
import { Modifier } from "../key-handler";

let FocusedKeyHandlerStack: FocusedStack;

describe("Focused Hanlder Stack", () => {
  beforeEach(() => {
    FocusedKeyHandlerStack = new FocusedStack();
  });

  it("generates a new key ", () => {
    const id1 = FocusedKeyHandlerStack.getGroupId();
    const id2 = FocusedKeyHandlerStack.getGroupId();

    expect(id1).not.toBe(id2);
  });
  it("fires correct event", () => {
    const mockHandler = jest.fn();
    const anotherHandler = jest.fn();
    const unusedHandler = jest.fn();
    const id1 = FocusedKeyHandlerStack.getGroupId();
    const id2 = FocusedKeyHandlerStack.getGroupId();

    // useEffect fires "bottom-up", so deeper groups are added first
    FocusedKeyHandlerStack.pushGroup(id2);
    FocusedKeyHandlerStack.pushHandler(id2, mockHandler, { key: "Escape" });
    FocusedKeyHandlerStack.pushHandler(id2, anotherHandler, { key: "Escape" });

    FocusedKeyHandlerStack.pushGroup(id1);
    FocusedKeyHandlerStack.pushHandler(id1, unusedHandler, { key: "Escape" });

    FocusedKeyHandlerStack.fireEvent({ code: "Escape" } as any);

    expect(mockHandler).toHaveBeenCalled();
    expect(anotherHandler).toHaveBeenCalled();
    expect(unusedHandler).not.toHaveBeenCalled();
  });

  it("fires correct event with modifiers", () => {
    const mockHandler = jest.fn();
    const unusedHandler = jest.fn();
    const id = FocusedKeyHandlerStack.getGroupId();
    FocusedKeyHandlerStack.pushGroup(id);

    FocusedKeyHandlerStack.pushHandler(id, unusedHandler, {
      key: "Escape",
      modifiers: [Modifier.Shift],
    });
    FocusedKeyHandlerStack.pushHandler(id, mockHandler, {
      key: "Escape",
      modifiers: [Modifier.Shift, Modifier.Control],
    });

    FocusedKeyHandlerStack.fireEvent({
      code: "Escape",
      ctrlKey: true,
      shiftKey: true,
    } as any);

    expect(unusedHandler).not.toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalled();
  });
  it("fires correct event after removing a group", () => {
    const group1Handler = jest.fn();
    const group2Handler = jest.fn();
    const id1 = FocusedKeyHandlerStack.getGroupId();
    const id2 = FocusedKeyHandlerStack.getGroupId();

    FocusedKeyHandlerStack.pushGroup(id2);
    FocusedKeyHandlerStack.pushHandler(id2, group2Handler, { key: "Escape" });

    FocusedKeyHandlerStack.pushGroup(id1);
    FocusedKeyHandlerStack.pushHandler(id1, group1Handler, { key: "Escape" });

    FocusedKeyHandlerStack.removeGroup(id2);

    FocusedKeyHandlerStack.fireEvent({ code: "Escape" } as any);

    expect(group1Handler).toHaveBeenCalled();
    expect(group2Handler).not.toHaveBeenCalled();
  });
  it("doesn't fire event after removing event", () => {
    const group2Handler = jest.fn();
    const id1 = FocusedKeyHandlerStack.getGroupId();
    const id2 = FocusedKeyHandlerStack.getGroupId();

    FocusedKeyHandlerStack.pushGroup(id2);
    FocusedKeyHandlerStack.pushHandler(id2, group2Handler, { key: "Escape" });

    FocusedKeyHandlerStack.pushGroup(id1);

    FocusedKeyHandlerStack.removeGroup(id2);

    FocusedKeyHandlerStack.fireEvent({ code: "Escape" } as any);

    expect(group2Handler).not.toHaveBeenCalled();
  });
  it("fires event when set to trigger from input ", () => {
    const mockHandler = jest.fn();
    const id = FocusedKeyHandlerStack.getGroupId();

    FocusedKeyHandlerStack.pushGroup(id);

    FocusedKeyHandlerStack.pushHandler(id, mockHandler, {
      key: "Escape",
      shouldTriggerInInputs: true,
    });

    FocusedKeyHandlerStack.fireEvent({
      code: "Escape",
      target: { nodeName: "INPUT", isContentEditable: false },
    } as any);

    expect(mockHandler).toHaveBeenCalled();
  });
  it("doesn't fire event when set not to trigger from input", () => {
    const mockHandler = jest.fn();
    const id = FocusedKeyHandlerStack.getGroupId();

    FocusedKeyHandlerStack.pushGroup(id);

    FocusedKeyHandlerStack.pushHandler(id, mockHandler, {
      key: "Escape",
    });

    FocusedKeyHandlerStack.fireEvent({
      code: "Escape",
      target: { nodeName: "INPUT", isContentEditable: false },
    } as any);

    expect(mockHandler).not.toHaveBeenCalled();
  });
  it("doesn't fire events from any group besides the top", () => {
    const unusedHandler = jest.fn();
    const id1 = FocusedKeyHandlerStack.getGroupId();
    const id2 = FocusedKeyHandlerStack.getGroupId();

    FocusedKeyHandlerStack.pushGroup(id2);

    FocusedKeyHandlerStack.pushGroup(id1);
    FocusedKeyHandlerStack.pushHandler(id1, unusedHandler, { key: "Escape" });

    FocusedKeyHandlerStack.fireEvent({ code: "Escape" } as any);

    expect(unusedHandler).not.toHaveBeenCalled();
  });
  it("removes only the removed event from the group", () => {
    const mockHandler = jest.fn();
    const anotherHandler = jest.fn();
    const unusedHandler = jest.fn();
    const id1 = FocusedKeyHandlerStack.getGroupId();
    const id2 = FocusedKeyHandlerStack.getGroupId();

    FocusedKeyHandlerStack.pushGroup(id2);
    FocusedKeyHandlerStack.pushHandler(id2, mockHandler, { key: "Escape" });
    FocusedKeyHandlerStack.pushHandler(id2, anotherHandler, { key: "Escape" });

    FocusedKeyHandlerStack.pushGroup(id1);
    FocusedKeyHandlerStack.pushHandler(id1, unusedHandler, { key: "Escape" });

    FocusedKeyHandlerStack.removeAtIdAndTrigger(
      id2,
      { key: "Escape" },
      anotherHandler
    );

    FocusedKeyHandlerStack.fireEvent({ code: "Escape" } as any);

    expect(mockHandler).toHaveBeenCalled();
    expect(anotherHandler).not.toHaveBeenCalled();
    expect(unusedHandler).not.toHaveBeenCalled();
  });
});
