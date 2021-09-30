import * as React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";

import { KeyHandler, Provider, FocusGroup } from "./index";

describe("<KeyHandler />", () => {
  afterEach(cleanup);

  test("matching key is triggered", () => {
    const handlerSpy = jest.fn();
    const anotherSpy = jest.fn();
    const shadowedGroupSpy = jest.fn();
    const unusedHandlerSpy = jest.fn();
    render(
      <div>
        <Provider>
          <div>
            <FocusGroup>
              <KeyHandler
                triggers={[{ key: "KeyA" }]}
                handler={shadowedGroupSpy}
              />
              <div>
                <FocusGroup>
                  <KeyHandler
                    triggers={[{ key: "KeyA" }]}
                    handler={handlerSpy}
                  />
                  <KeyHandler
                    triggers={[{ key: "KeyA" }]}
                    handler={anotherSpy}
                  />
                  <KeyHandler
                    triggers={[{ key: "KeyV" }]}
                    handler={unusedHandlerSpy}
                  />
                </FocusGroup>
              </div>
            </FocusGroup>
          </div>
        </Provider>
      </div>
    );

    fireEvent.keyDown(document.body, { code: "KeyA" });
    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(anotherSpy).toHaveBeenCalledTimes(1);
    expect(shadowedGroupSpy).toHaveBeenCalledTimes(0);
    expect(unusedHandlerSpy).toHaveBeenCalledTimes(0);
  });
});
