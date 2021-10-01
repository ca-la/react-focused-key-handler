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
      <Provider>
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
            {clickCounts.parent > 0 && (
              <div>
                <span>Showing!</span>
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
      </Provider>
    </div>
  );
}

describe("<KeyHandler />", () => {
  afterEach(cleanup);

  test("matching key is triggered", () => {
    const component = render(<TestComponent />);

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
  });
});
