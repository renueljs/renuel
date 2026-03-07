<p align="center" id="logos">
  <img alt="Renuel" src=".github/logo-light.png#gh-light-mode-only" height="384" style="max-width: 100%;">
  <img alt="Renuel" src=".github/logo-dark.png#gh-dark-mode-only" height="384" style="max-width: 100%;">
</p>

<p align="center" id="badges">
  <a href="https://github.com/renueljs/renuel/tree/v0.1.0-next.0"><img src="https://img.shields.io/badge/tag-v0.1.0--next.0-orange" alt="tag v0.1.0-next.0"></a>
  <a href="https://www.npmjs.com/package/renuel/v/0.1.0-next.0"><img src="https://img.shields.io/badge/npm-v0.1.0--next.0-orange" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/renuel@v0.1.0-next.0"><img src="https://img.shields.io/bundlephobia/minzip/renuel@v0.1.0-next.0?label=bundle%20size&color=orange" alt="npm v0.1.0-next.0 version bundle size"></a>
  <a href="https://github.com/renueljs/renuel/blob/v0.1.0-next.0/LICENSE"><img src="https://img.shields.io/badge/license-MIT-orange" alt="license"></a>
</p>

<hr>

Renuel provides a flexible, type-safe system for building React UIs with plain
functions—harnessing the full expressive power of JavaScript while avoiding the
context-switching syntax of JSX.

<!--prettier-ignore-start-->
```typescript
div({ className: "greeting" }, "Hello ", em$("world"))
```
<!--prettier-ignore-end-->

## Features

- **Just functions**: Build React components without JSX.
- **Flexible and concise**: Factory variants allow props and children to be passed with minimal syntax, reducing boilerplate without compromising type safety.
- **Precision composition**: A polymorphic component approach that delivers convenience and correctness
- **Type safety by default**: Excess props are disallowed, and prop conflicts must be resolved explicitly.
- **Expressive JavaScript**: Take full advantage of JavaScript and TypeScript features with no extra syntax or context-switching.

## Installation

```bash
npm install renuel # or yarn, pnpm, etc.
```

## Quick start

Here's an example of using Renuel to create a simple counter app:

<!--prettier-ignore-start-->
<!--demo-start-->
```typescript
import { useReducer } from "react";
import { createRoot } from "react-dom/client";
import { button, component, strong$ } from "renuel";
import type { ComponentChildren, Exact } from "renuel";

const App = component(<Props>(props: Exact<React.Attributes, Props>) => {
  const [count, onClick] = useReducer((x) => x + 1, 0);
  return button({ onClick }, "Count: ", strong$(count));
});

const App$ = (...children: ComponentChildren<typeof App>) => App({}, ...children);

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(App$());
}
```

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAhgBzQOgBYBcC2USoAxgPYB2uMVSIAPAIQAmZJuAnmjAAR6EA%2BADoV6%2FKMIo8eYmCmaTp0%2Bvhi4UPEthQAnOGoC8QkAFUAKgDEAtAA5jPAPSKlKtRoopVRkADcIMAHc0Mh1ce3IqGlxvAIhmXGwDZhg%2FEhgrWPjsABoeCAoIXAgUKCs4EhKYAwBGTAAGeycRJRki3FgBACUaAFcYKB4AERh8MnoHNo7mmQdsOQVp%2BgAjMmYOZ2VmCB885m8dMjIwkAFxrZ8NmXKdCDRcHk5ub1HmHth7OB0Sb0wHfBR8phcHBjKcHNdbrhnOMVmtJONxJIQABfbIgNAoEgAaxQAHMYJgAFZwSjEEARai0RAgYDTYweVTGRA8Yw6Xr9KzJUbGbJ03wwPQQShMlkgWp1eo8vnJCF3IUUEXGboUPoDLlkHhoA6EmDsKVSUX%2FfKKkDoLDifXSYyy4Ei2kGq0gODqUImjFffo8M04AhQYzTVHSmDcCjJCgkfwgpA8e0tYwAAUe8AcbMxx2ZxmqAE5MAAmPOWpQJpNwFNydicsj4E3ZvMFkC8h2i1N66OZnP5hoN6aOlu4SvVttijuS7tN4zutJ%2Bof56oANlHjbjIDZKv6Jol4qsFBgAA9cIue6KSyQbncTQBWTA5gDM%2FoNyJEyJRaOBEUguKJJIoZIpUTosaiuQ%2BBoNAAoAPJypQUbMoBjouvi6aigAogAyrmdQYYWjo9PowyQDuFghAAwlAKBwHAFj%2BFAzAwQ8Oh9EuRYgC8bwwCaaEAHJ7scTGOlAEBLCKADaR6OmhGFYWOLSOoM4EALLYcxcnyZgACS1A6CgSzvCAR4ALp8aKcBYrcAAygnEXM2IirgDEwEZxisbA3QklAPRFMKQ5LD0oawDoSnGCUUBkAEakgSERQULiZhwMh%2B40HA8p0XZjFHqy8BkFAPgwAAUt%2B8mrGxtn2Y5IAQG5KDUMwhWvLAKWlelIAUGQyH4IUJVpeOTp2RArbMqlDlNS1JgqvozBmWwJQNV1y4jWNMDMAACronhqAKM1Dd1LUWMFCQHD0uLYMR5HwGpFCobEuBaJ17EPkxxj5CQ7nJCJTVGhQQJRtM%2BlPi%2BLEAp9wK%2FpQlK4HQEARaEMY8LhMDdK8aQ6DwyI8GABz4M25bHAA3CIkPBNDwCaKm1CdIc9yo%2BjVZY2mA4OM9%2FhUMYeMFFD9zEz5uC4JQuTAcEO5ULkzoHNFAAkKNoxjWNrtOrME5FDxcLwxPEVWAtRFZ0DMKuuTxWmkvU5jGWyyzIgiBEzowwAghgksGJo6uUFEAAU9BLQcaBwAILtamQXvMvr7D0N0aaYNb3M3Fz8C5B7%2FvewAlDwBgCDG0yW%2FcwnkL5uC5JQpF9Vi%2BnJ7D%2BgIz0SMuy7u5JynPC7jwADUPDVLkdQJ6z0hsrgPQ6FIXM8xQLvE%2FnAnYijuTGGrOcZg2PAi5QuJiy72dUAnHdPhvCrhtB9y22gEsOy7mAn1o2ursyasRYLuBazRq70EmZBgDw%2B8CLXqf78PqI8CfmBn%2FfGgW8La7x4AcI4yEBgO1YCQHoqgqCYEQpAkYUQABCHA1LMBdqyCmxgt4QBfi7cBuBIFJ0AhnMBFMS6njkGTCmRCKakM7pQo4mBVzJB0C7fey916s2fMiARQA%3D%3D)
<!--demo-end-->
<!--prettier-ignore-end-->

## Factories

Each intrinsic HTML element comes with four factory variants:

1. `tag` (`Component`): standard factory; accepts props + children.
2. `tag$` (`Component$`): skip-props factory; accepts children only.
3. `_tag` (`_Component`): partial factory; returns a new factory after fixing some props.
4. `_tag$` (`_Component$`): partial skip-props factory; like `_tag`, but starts with children.

> [!TIP]
> A way to remember the naming convention is:
>
> - `$` means "skip props", i.e. first argument is a child
> - `_` means "partial", i.e. returns another factory

Example with `div`:

<!--prettier-ignore-start-->
```typescript
div({ className: "foo" }, "Hello")                 // standard
div$("Hello")                                      // skip-props
_div({ id: "foo" }, "Hello")({ className: "foo" }) // partial
_div$("Hello")({ className: "foo" })               // partial skip-props
```
<!--prettier-ignore-end-->

> [!NOTE]
> In the example above, invoking the curried factories with additional props is
> for demonstration purposes only. In practice, you’d typically pass the curried
> factory as a child to a polymorphic component, which is then responsible for
> supplying the remaining props.

This pattern applies to both native tags and custom components, making
composition predictable and type-safe with minimal syntax.

## Custom components

### Basic

Here's a simple `Button` component with a `variant` prop and children as the label:

<!--prettier-ignore-start-->
```typescript
import { component, button$ } from "renuel";
import type { ComponentChildren, Exact } from "renuel";

const Button = component(<Props>(
  { variant = "secondary" }: Exact<{
    variant?: "primary" | "secondary";
  }, Props>,
  ...children: React.ReactNode[]
) => {
  return button$(
    {
      style:
        variant === "primary"
          ? {
              background: "blue",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: 4,
            }
          : {
              background: "lightgray",
              padding: "0.5rem 1rem",
              borderRadius: 4,
            }
    },
    ...children
  );
});

const Button$ = (...children: ComponentChildren<typeof Button>) => Button({}, ...children);

// Usage — props + children
Button({ variant: "primary" }, "Click me")

// Usage — skip props (defaults to "secondary" variant)
Button$("Cancel")
```
<!--prettier-ignore-end-->

### Polymorphic

Polymorphic components let you reuse styling while rendering different
underlying elements. The canonical example is a `Button` component that can be
rendered as an HTML `button` element or as an `a` element, but looks the same
either way.

Renuel makes this type of composition explicit through a render prop, ensuring
both flexibility and type safety.

To make the `Button` polymorphic, you can change `children` to a render callback
(aka [Function as Child
Component](https://reactpatterns.js.org/docs/function-as-child-component/)):

<!--prettier-ignore-start-->
```typescript
import { component, button$, _a, _button$ } from "renuel";
import type { ComponentChildren, Exact } from "renuel";

const Button = component<Props>((
  { variant = "secondary" }: Exact<{
    variant?: "primary" | "secondary";
  }, Props>,
  render: (props: { style: React.CSSProperties }) => React.ReactNode
) => {
  return render({
    style:
      variant === "primary"
        ? {
            background: "blue",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: 4,
          }
        : {
            background: "lightgray",
            padding: "0.5rem 1rem",
            borderRadius: 4,
          }
  });
});

const Button$ = (...children: ComponentChildren<typeof Button>) => Button({}, ...children);

// Usage — render as a link
Button({ variant: "primary" }, _a({ href: "/docs" }, "Get started"));

// Usage — render as a plain button
Button$(_button$("Default button"));
```
<!--prettier-ignore-end-->

### Authoring

Custom component development begins by defining a standard factory (the "base
component") via the component function. This utility acts as a higher-order
wrapper that transforms a functional implementation into a render-safe factory
compatible with React Hooks.

The component function performs two primary internal tasks:

1. **Component identity**: It assigns a `displayName` to the function, ensuring
   the component is correctly identified within React DevTools and error
   boundaries.
2. **Hook & lifecycle support**: It ensures that factory invocations are
   processed through React's internal rendering engine. By wrapping the
   execution, it allows the component to support React Hooks and lifecycle
   management, which would otherwise be unavailable through standard function
   calls.

Once the base component is established, the three additional factory
variants—skip-props, partial, and partial skip-props—are manually defined as plain
functions to extend the component's API.

#### Streamlining with VSCode Snippets

To accelerate development and maintain architectural consistency, pre-configured
snippets are available [here](.vscode/renuel.code-snippets). These snippets
automate the generation of the standard factory along with its associated
variants.

The following snippets are provided:

- **rc**: Standard component implementation, suitable for the majority of use
  cases.
- **rgc**: Generic component implementation, intended for components requiring
  polymorphic or generic type parameters.

## Versus JSX

If you already use JSX, Renuel will feel familiar — but with less syntax
overhead and stronger type guarantees. Here are a few common patterns compared
directly:

### Mapping over data

<!--prettier-ignore-start-->
```tsx
// JSX
<ul>{items.map(i => (<li key={i.id}>{i.name}</li>))}</ul>

// Renuel
ul$(items.map(i => li({ key: i.id }, i.name)))
```
<!--prettier-ignore-end-->

### Conditional rendering

<!--prettier-ignore-start-->
```tsx
// JSX
<div>{isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>}</div>

// Renuel
div$(isLoggedIn ? p$("Welcome back!") : p$("Please log in"))
```
<!--prettier-ignore-end-->

### Function as Child Component

<!--prettier-ignore-start-->
```tsx
// JSX
<Button>{({ style }) => <a href="/docs" style={style}>Docs</a>}</Button>

// Renuel
Button(_a({ href: "/docs" }, "Docs"))
```
<!--prettier-ignore-end-->

### Object props

<!--prettier-ignore-start-->
```tsx
// JSX
<div style={{ background: "blue", color: "white" }}>Hello world</div>

// Renuel
div({ style: { background: "blue", color: "white" } }, "Hello world")
```
<!--prettier-ignore-end-->

### Special characters

<!--prettier-ignore-start-->
```tsx
// JSX
<footer>&copy; 2025 MyCompany. All rights reserved.</footer>

// Renuel
footer$("© 2025 MyCompany. All rights reserved.")
```
<!--prettier-ignore-end-->
