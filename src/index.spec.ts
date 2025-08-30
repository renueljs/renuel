import "global-jsdom/register";

import { render } from "@testing-library/react";
import assert from "node:assert";
import { after, afterEach, test } from "node:test";
import { createElement, type ReactNode } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

import { component, ul$ } from "./index.ts";

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

afterEach(() => {
  document.body.innerHTML = "";

  for (const [name, mock] of Object.entries(mocks)) {
    assert.strictEqual(
      mock.calls.length,
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

{
  const description = ({
    children,
    transform,
  }: {
    children: 0 | 1 | 2;
    transform: "classic" | "automatic";
  }) =>
    `standard factory using ${transform} jsx transform with ${children === 2 ? "multiple children" : children ? "single child" : "no children"}`;

  const { TestComponent } = component(
    "TestComponent",
    ({ children }: { children: ReactNode }) => ul$(...[children].flat()),
  );

  test(description({ transform: "automatic", children: 2 }), async () => {
    const screen = render(
      jsxs(TestComponent, {
        children: [jsx("li", { children: "A" }), jsx("li", { children: "B" })],
      }),
    );
    assert.strictEqual((await screen.findAllByRole("listitem")).length, 2);
  });

  test(description({ transform: "automatic", children: 1 }), async () => {
    const screen = render(
      jsx(TestComponent, {
        children: jsx("li", { children: "A" }),
      }),
    );
    assert.strictEqual((await screen.findAllByRole("listitem")).length, 1);
  });

  test(description({ transform: "automatic", children: 0 }), () => {
    const screen = render(
      jsxs(TestComponent, {
        children: [],
      }),
    );
    assert.strictEqual(screen.getByRole("list").innerHTML, "");
  });

  test(description({ transform: "classic", children: 2 }), async () => {
    const screen = render(
      createElement(
        TestComponent,
        null,
        createElement("li", null, "A"),
        createElement("li", null, "B"),
      ),
    );
    assert.strictEqual((await screen.findAllByRole("listitem")).length, 2);
  });

  test(description({ transform: "classic", children: 1 }), async () => {
    const screen = render(
      createElement(TestComponent, null, createElement("li", null, "A")),
    );
    assert.strictEqual((await screen.findAllByRole("listitem")).length, 1);
  });

  test(description({ transform: "classic", children: 0 }), () => {
    const screen = render(createElement(TestComponent));
    assert.strictEqual(screen.getByRole("list").innerHTML, "");
  });
}
