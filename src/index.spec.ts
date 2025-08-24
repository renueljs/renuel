import "global-jsdom/register";

import { render } from "@testing-library/react";
import { describe, it } from "node:test";

import { div$ } from "./index.ts";

describe("Hello", () => {
  it("should say hello", () => {
    const screen = render(div$("Hello world"));
    screen.getByText("Hello world");
  });
});
