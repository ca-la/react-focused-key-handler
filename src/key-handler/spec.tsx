import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-dom/test-utils";

import KeyHandler from "./index";

describe("<KeyHandler />", () => {
  let container: HTMLDivElement | null = null;
  let handlerSpy: jest.Mock;

  beforeEach(() => {
    container = document.createElement("div");

    if (!container) {
      throw new Error("Could not create container element for DOM testing");
    }

    handlerSpy = jest.fn();

    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
    }

    container = null;
  });

  describe("when attaching to the body", () => {
    beforeEach(() => {
      TestUtils.act(() => {
        ReactDOM.render(
          <KeyHandler triggers={[{ key: "KeyA" }]} handler={handlerSpy} />,
          container
        );
      });
    });

    describe("when the matching key is triggered on the body", () => {
      beforeEach(() => {
        TestUtils.act(() => {
          document.body.dispatchEvent(
            new KeyboardEvent("keydown", { code: "KeyA" })
          );
        });
      });

      it("triggers the spy", () => {
        expect(handlerSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the matching key is triggered on the container", () => {
      beforeEach(() => {
        TestUtils.act(() => {
          if (!container) {
            throw new Error("Could not find the container element");
          }

          container.dispatchEvent(
            new KeyboardEvent("keydown", { code: "KeyA" })
          );
        });
      });

      it("does not trigger the spy", () => {
        expect(handlerSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
