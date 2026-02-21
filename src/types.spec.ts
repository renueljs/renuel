import type { CSSProperties, ReactNode } from "react";

import type { Exact } from "./index.ts";
import { _a, _html, body$, component, head$, html, p$ } from "./index.ts";

const { Message } = component((_: React.Attributes, children: string) =>
  p$(children),
);

// @ts-expect-error children defined in props object instead of positionally
Message({ children: "Hello world" });

const { SizableMessage } = component(
  <Props>(
    _props: Exact<{ size: "sm" | "lg"; emphasis?: boolean }, Props>,
    _children?: ReactNode,
  ) => p$(),
);

// @ts-expect-error missing required prop
SizableMessage({}, "Hello world");

const excessProps = { foo: 1 };
// @ts-expect-error excess prop
SizableMessage({ size: "sm", emphasis: true, ...excessProps }, "Hello world");

type ButtonProps = Record<string, unknown>;

type ButtonChildren = (_: { style: CSSProperties }) => ReactNode;

const { Button } = component((_props: ButtonProps, children: ButtonChildren) =>
  children({ style: {} }),
);

const Button$ = (children: ButtonChildren) => Button({}, children);

// @ts-expect-error excess prop
Button$(_a({ href: "#", asdf: 1 }));

// @ts-expect-error conflicting prop
Button$(_a({ href: "#", style: { textDecoration: "none" } }));

html({ "data-theme": "dark" });
_html({ "data-theme": "dark" });

html({ lang: "en" }, head$(), body$("Hello world"));
