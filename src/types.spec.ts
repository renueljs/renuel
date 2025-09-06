import type { CSSProperties, ReactNode } from "react";

import { _a, _html, body$, component, head$, html, p$ } from "./index.ts";

const { Message, Message$ } = component(
  "Message",
  ({ children }: { children: string }) => p$(children),
);

// @ts-expect-error children defined in props object instead of positionally
Message({ children: "Hello world" });

// @ts-expect-error required children missing
Message({});

// @ts-expect-error required children missing
Message$();

const sizableMessage = component(
  "SizableMessage",
  (_: { size: "sm" | "lg"; emphasis?: boolean; children?: ReactNode }) => p$(),
);

// @ts-expect-error skip props factory when props are required
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
sizableMessage.SizableMessage$;

const { SizableMessage } = sizableMessage;

// @ts-expect-error missing required prop
SizableMessage({}, "Hello world");

// @ts-expect-error excess prop
SizableMessage({ size: "sm", emphasis: true, foo: 1 }, "Hello world");

const { Button$ } = component(
  "Button",
  ({ children }: { children: (_: { style: CSSProperties }) => ReactNode }) =>
    children({ style: {} }),
);

// @ts-expect-error excess prop
Button$(_a({ href: "#", asdf: 1 }));

// @ts-expect-error conflicting prop
Button$(_a({ href: "#", style: { textDecoration: "none" } }));

html({ "data-theme": "dark" });
_html({ "data-theme": "dark" });

html({ lang: "en" }, head$(), body$("Hello world"));
