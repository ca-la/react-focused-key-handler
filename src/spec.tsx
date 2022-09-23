import React, { useState } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import { KeyHandler, Provider, FocusGroup } from "./index";

function TestComponent() {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({
    parent: 0,
    child: 0,
    sibling: 0,
    unused: 0,
  });
  return (
    <div>
      <div>
        <span>Parent: {clickCounts.parent}</span>
        <span>Child: {clickCounts.child}</span>
        <span>Sibling: {clickCounts.sibling}</span>
        <span>Unused: {clickCounts.unused}</span>
      </div>
      <FocusGroup>
        <KeyHandler
          triggers={[{ key: "KeyA" }]}
          handler={() =>
            setClickCounts((prev) => ({
              ...prev,
              parent: prev.parent + 1,
            }))
          }
        />
        <KeyHandler triggers={[{ key: "KeyC" }]}>
          <KeyHandler triggers={[{ key: "KeyK" }]}>
            <KeyHandler
              triggers={[{ key: "KeyV" }]}
              handler={() =>
                setClickCounts((prev) => ({
                  ...prev,
                  unused: prev.unused + 1,
                }))
              }
            />
          </KeyHandler>
        </KeyHandler>
        {clickCounts.parent > 0 && clickCounts.child === 0 && (
          <div>
            <FocusGroup>
              <KeyHandler
                triggers={[{ key: "KeyA" }]}
                handler={() =>
                  setClickCounts((prev) => ({
                    ...prev,
                    child: prev.child + 1,
                  }))
                }
              />
              <KeyHandler
                triggers={[{ key: "KeyA" }]}
                handler={() =>
                  setClickCounts((prev) => ({
                    ...prev,
                    sibling: prev.sibling + 1,
                  }))
                }
              />
              <KeyHandler
                triggers={[{ key: "KeyV" }]}
                handler={() =>
                  setClickCounts((prev) => ({
                    ...prev,
                    unused: prev.unused + 1,
                  }))
                }
              />
            </FocusGroup>
          </div>
        )}
      </FocusGroup>
    </div>
  );
}
function MelodyTestComponent() {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({
    level1: 0,
    level2: 0,
  });
  return (
    <div>
      <div>
        <span>level1: {clickCounts.level1}</span>
        <span>level2: {clickCounts.level2}</span>
      </div>
      <FocusGroup>
        <KeyHandler triggers={[{ key: "KeyA" }]}>
          <KeyHandler triggers={[{ key: "KeyB" }]}>
            <KeyHandler
              triggers={[{ key: "KeyC" }]}
              handler={() =>
                setClickCounts((prev) => ({
                  ...prev,
                  level2: prev.level2 + 1,
                }))
              }
            />
          </KeyHandler>
          <KeyHandler
            triggers={[{ key: "KeyD" }]}
            handler={() =>
              setClickCounts((prev) => ({
                ...prev,
                level1: prev.level1 + 1,
              }))
            }
          />
        </KeyHandler>
      </FocusGroup>
    </div>
  );
}

describe("<KeyHandler />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(cleanup);

  test("matching key is triggered", () => {
    const component = render(
      <Provider>
        <TestComponent />
      </Provider>
    );

    fireEvent.keyDown(document.body, { code: "KeyA" });
    expect(component.queryByText("Parent: 1")).toBeTruthy();
    expect(component.queryByText("Child: 0")).toBeTruthy();
    expect(component.queryByText("Sibling: 0")).toBeTruthy();
    expect(component.queryByText("Unused: 0")).toBeTruthy();

    fireEvent.keyDown(document.body, { code: "KeyA" });
    expect(component.queryByText("Parent: 1")).toBeTruthy();
    expect(component.queryByText("Child: 1")).toBeTruthy();
    expect(component.queryByText("Sibling: 1")).toBeTruthy();
    expect(component.queryByText("Unused: 0")).toBeTruthy();

    fireEvent.keyDown(document.body, { code: "KeyA" });
    expect(component.queryByText("Parent: 2")).toBeTruthy();
    expect(component.queryByText("Child: 1")).toBeTruthy();
    expect(component.queryByText("Sibling: 1")).toBeTruthy();
    expect(component.queryByText("Unused: 0")).toBeTruthy();
  });

  test("matching melodies are triggered", async () => {
    const component = render(
      <Provider>
        <MelodyTestComponent />
      </Provider>
    );
    fireEvent.keyDown(document.body, { code: "KeyA" });
    fireEvent.keyDown(document.body, { code: "KeyB" });
    fireEvent.keyDown(document.body, { code: "KeyC" });
    fireEvent.keyDown(document.body, { code: "KeyA" });
    fireEvent.keyDown(document.body, { code: "KeyD" });
    fireEvent.keyDown(document.body, { code: "KeyA" });
    jest.advanceTimersByTime(2001);
    fireEvent.keyDown(document.body, { code: "KeyB" });
    fireEvent.keyDown(document.body, { code: "KeyC" });
    component.debug();
    expect(component.queryByText("level1: 1")).toBeTruthy();
    expect(component.queryByText("level2: 1")).toBeTruthy();
  });
  test("Custom Timeout functions correctly", async () => {
    const component = render(
      <Provider timeout={3000}>
        <MelodyTestComponent />
      </Provider>
    );
    fireEvent.keyDown(document.body, { code: "KeyA" });
    jest.advanceTimersByTime(2001);
    fireEvent.keyDown(document.body, { code: "KeyB" });
    fireEvent.keyDown(document.body, { code: "KeyC" });
    expect(component.queryByText("level2: 1")).toBeTruthy();
  });
});
