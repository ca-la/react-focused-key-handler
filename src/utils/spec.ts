import { Modifier, Trigger } from "../key-handler/index";
import { matchTrigger } from ".";

describe("matchTrigger", () => {
  describe("with single key", () => {
    const trigger: Trigger = {
      key: "ArrowUp",
    };

    describe("with a matching key, no modifiers", () => {
      it("returns true", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
        });
        expect(matchTrigger(event, trigger)).toBe(true);
      });
    });

    describe("with a matching key, and a modifier", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
          metaKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });

    describe("with a non-matching key", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "KeyC",
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });
  });

  describe("with an event triggered from an input field", () => {
    const selectTrigger: Trigger = {
      key: "KeyV",
      modifiers: [],
    };

    describe("does not trigger if the event originates from an input", () => {
      const event = new KeyboardEvent("keydown", {
        code: "KeyV",
      });
      Object.defineProperty(event, "target", {
        get: () => {
          return {
            isContentEditable: true,
            nodeName: "INPUT",
          };
        },
      });
      expect(matchTrigger(event, selectTrigger)).toBe(false);
    });

    describe("does not trigger if the event originates from a content editable node", () => {
      const event = new KeyboardEvent("keydown", {
        code: "KeyV",
      });
      Object.defineProperty(event, "target", {
        get: () => {
          return {
            isContentEditable: true,
            nodeName: "DIV",
          };
        },
      });
      expect(matchTrigger(event, selectTrigger)).toBe(false);
    });
  });

  describe("with an event triggered from an input field on an always active trigger", () => {
    const escapeTrigger: Trigger = {
      key: "Escape",
      modifiers: [],
      shouldTriggerInInputs: true,
    };

    describe("does trigger if the event originates from an input", () => {
      const event = new KeyboardEvent("keydown", {
        code: "Escape",
      });
      Object.defineProperty(event, "target", {
        get: () => {
          return {
            isContentEditable: true,
            nodeName: "INPUT",
          };
        },
      });
      expect(matchTrigger(event, escapeTrigger)).toBe(true);
    });

    describe("does trigger if the event originates from a content editable node", () => {
      const event = new KeyboardEvent("keydown", {
        code: "Escape",
      }) as any;
      Object.defineProperty(event, "target", {
        get: () => {
          return {
            isContentEditable: true,
            nodeName: "DIV",
          };
        },
      });
      expect(matchTrigger(event, escapeTrigger)).toBe(true);
    });

    describe("does not trigger the event if it does not match the code", () => {
      const event = new KeyboardEvent("keydown", {
        code: "KeyV",
      }) as any;
      Object.defineProperty(event, "target", {
        get: () => {
          return {
            isContentEditable: true,
            nodeName: "INPUT",
          };
        },
      });
      expect(matchTrigger(event, escapeTrigger)).toBe(false);
    });
  });

  describe("with a key and an empty modifier array", () => {
    const trigger: Trigger = {
      key: "ArrowUp",
      modifiers: [],
    };

    describe("with a matching key, no modifiers", () => {
      it("returns true", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
        });
        expect(matchTrigger(event, trigger)).toBe(true);
      });
    });

    describe("with a matching key, and a modifier", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
          metaKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });
  });

  describe("with a key and a single modifier", () => {
    const trigger: Trigger = {
      key: "ArrowUp",
      modifiers: [Modifier.Meta],
    };

    describe("with a matching key, no modifiers", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });

    describe("with a matching key, and a modifier", () => {
      it("returns true", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
          metaKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(true);
      });
    });
  });

  describe("with a key and two modifiers", () => {
    const trigger: Trigger = {
      key: "ArrowUp",
      modifiers: [Modifier.Meta, Modifier.Shift],
    };

    describe("with a matching key, no modifiers", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });

    describe("with a matching key, and a single matching modifier", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
          metaKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });

    describe("with a matching key, and a single non-matching modifier", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
          ctrlKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });

    describe("with a matching key, and matching modifiers", () => {
      it("returns true", () => {
        const event = new KeyboardEvent("keydown", {
          code: "ArrowUp",
          metaKey: true,
          shiftKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(true);
      });
    });

    describe("with a matching key, and matching modifiers and one non-matching modifier", () => {
      it("returns false", () => {
        const event = new KeyboardEvent("keydown", {
          altKey: true,
          code: "ArrowUp",
          metaKey: true,
          shiftKey: true,
        });
        expect(matchTrigger(event, trigger)).toBe(false);
      });
    });
  });
});
