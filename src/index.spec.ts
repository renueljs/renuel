import "global-jsdom/register";

import { render } from "@testing-library/react";
import assert from "node:assert";
import { after, afterEach, test } from "node:test";
import { forwardRef } from "react";

import { _div, _div$, component, div, div$ } from "./index.ts";

function spyOn<
  O,
  K extends keyof O,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Fn extends Extract<O[K], (...args: any[]) => any>,
>(obj: O, k: K) {
  const backup = obj[k];

  const calls: Parameters<Fn>[] = [];

  const fn = ((...args: Parameters<Fn>): ReturnType<Fn> => {
    calls.push(args);
    return undefined as ReturnType<Fn>;
  }) as Fn;

  obj[k] = fn as O[K];

  return {
    calls,
    reset: () => {
      calls.length = 0;
    },
    restore: () => {
      obj[k] = backup;
    },
  };
}

const mocks = {
  warn: spyOn(console, "warn"),
  error: spyOn(console, "error"),
};

const allowedConsole = (type: "warn" | "error", message: string) =>
  type === "error" && /deprecated/.test(message);

afterEach(() => {
  document.body.innerHTML = "";

  for (const [name, mock] of Object.entries(mocks)) {
    assert.strictEqual(
      mock.calls.filter(
        args =>
          !(name === "error" || name === "warn") ||
          !allowedConsole(name, args.join(" ")),
      ).length,
      0,
      `Unexpected console.${name} call(s):\n` +
        mock.calls.map(args => `  ${args.join(" ")}`).join("\n"),
    );
    mock.reset();
  }

  Object.values(mocks).forEach(mock => mock.reset());
});

after(() => {
  Object.values(mocks).forEach(mock => mock.restore());
});

test("div standard factory", () => {
  const screen = render(div({ role: "alert" }));
  screen.getByRole("alert");
});

test("div skip props factory", () => {
  const screen = render(div$("Hello"));
  screen.getByText("Hello");
});

test("div partial factory", async () => {
  const screen = render(_div({ role: "alert" })({ "data-testid": "el" }));
  const el = await screen.findByTestId("el");
  assert.strictEqual("alert", el.role);
});

test("div partial skip props factory", async () => {
  const screen = render(_div$("Hello")({ role: "alert" }));
  const el = await screen.findByRole("alert");
  assert.strictEqual("Hello", el.textContent);
});

{
  const { TestComponent } = component(
    "TestComponent",
    forwardRef<HTMLDivElement>((_props, ref) => div({ ref })),
  );

  test("ref forwarding", () => {
    let element: HTMLDivElement | null = null;
    render(
      TestComponent({
        ref: el => {
          element = el;
        },
      }),
    );
    assert.ok(element, "Unable to get ref element");
  });
}
