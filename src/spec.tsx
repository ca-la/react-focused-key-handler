import * as React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import KeyHandler, { Provider, FocusGroup } from "./index";

describe("<KeyHandler />", () => {
  afterEach(cleanup);

  test("no group: matching key is triggered on the body", () => {
    const handlerSpy = jest.fn();
    render(<KeyHandler triggers={[{ key: "KeyA" }]} handler={handlerSpy} />);

    fireEvent.keyDown(document.body, { code: "KeyA" });
    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });

  test("with group: matching key is triggered", () => {
    const handlerSpy = jest.fn();
    const anotherSpy = jest.fn();
    const unusedHandlerSpy = jest.fn();
    render(
      <div>
        <Provider />
        <div>
          <FocusGroup>
            <KeyHandler
              triggers={[{ key: "KeyA" }]}
              handler={unusedHandlerSpy}
            />
            <div>
              <FocusGroup>
                <KeyHandler triggers={[{ key: "KeyA" }]} handler={handlerSpy} />
                <KeyHandler triggers={[{ key: "KeyA" }]} handler={anotherSpy} />
              </FocusGroup>
            </div>
          </FocusGroup>
        </div>
      </div>
    );

    fireEvent.keyDown(document.body, { code: "KeyA" });
    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(anotherSpy).toHaveBeenCalledTimes(1);
    expect(unusedHandlerSpy).toHaveBeenCalledTimes(0);
  });
});
