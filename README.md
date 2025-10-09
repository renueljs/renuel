<p align="center">
  <img alt="Renuel" src=".github/logo-dark.png#gh-dark-mode-only" height="384" style="max-width: 100%;">
  <img alt="Renuel" src=".github/logo-light.png#gh-light-mode-only" height="384" style="max-width: 100%;">
</p>

<p align="center">
  <!-- omit from next -->
  <a href="https://github.com/renueljs/renuel/tree/master"><img src="https://img.shields.io/badge/branch-master-blue" alt="master branch"></a>
  <a href="https://github.com/renueljs/renuel/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/renueljs/renuel/ci.yml?branch=master&color=blue" alt="master build status"></a>
  <a href="https://www.npmjs.com/package/renuel"><img src="https://img.shields.io/npm/v/renuel/latest.svg?label=npm&color=blue" alt="npm latest version"></a>
  <a href="https://bundlephobia.com/package/renuel@latest"><img src="https://img.shields.io/bundlephobia/minzip/renuel@latest?label=bundle%20size&color=blue" alt="npm bundle size latest"></a>
  <!-- omit from master -->
  <br>
  <!-- /omit from next -->
  <a href="https://github.com/renueljs/renuel/tree/next"><img src="https://img.shields.io/badge/branch-next-orange" alt="next branch"></a>
  <a href="https://github.com/renueljs/renuel/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/renueljs/renuel/ci.yml?branch=next&color=orange" alt="next build status"></a>
  <a href="https://www.npmjs.com/package/renuel"><img src="https://img.shields.io/npm/v/renuel/next.svg?label=npm&color=orange" alt="npm next version"></a>
  <a href="https://bundlephobia.com/package/renuel@next"><img src="https://img.shields.io/bundlephobia/minzip/renuel@next?label=bundle%20size&color=orange" alt="npm bundle size next"></a>
  <!-- /omit from master -->
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

Here's a simple example of using Renuel to render a greeting:

<!--prettier-ignore-start-->
```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { div, em$ } from "renuel";

const App = () =>
  div({ className: "greeting" }, "Hello ", em$("world"));

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(App());
}
```
<!--prettier-ignore-end-->

This renders:

<!--prettier-ignore-start-->
```html
<div class="greeting">
  Hello <em>world</em>
</div>
```
<!--prettier-ignore-end-->

## Custom components

### Basic

Here's a simple `Button` component with a `variant` prop and children as the label:

<!--prettier-ignore-start-->
```typescript
import { component, button$ } from "renuel";

const { Button, Button$ } = component(
  "Button",
  ({
    variant = "secondary",
    children,
  }: {
    variant?: "primary" | "secondary";
    children?: React.ReactNode;
  }) =>
    button$(
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
      children
    )
);

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

To make the `Button` polymorphic, you can change `children` to a render prop (aka [Function as Child Component](https://reactpatterns.js.org/docs/function-as-child-component/)):

<!--prettier-ignore-start-->
```typescript
import { component, button$, _a, _button$ } from "renuel";

const { Button, Button$ } = component(
  "Button",
  ({
    variant = "secondary",
    children
  }: {
    variant?: "primary" | "secondary";
    children: (props: { style: React.CSSProperties }) => React.ReactNode;
  }) =>
    children({
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
    })
);

// Usage — render as a link
Button({ variant: "primary" }, _a({ href: "/docs" }, "Get started"));

// Usage — render as a plain button
Button$(_button$("Default button"));
```
<!--prettier-ignore-end-->

## Factories

Each tag (or custom component) comes with four factory variants:

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

This pattern applies to both native tags and custom components, making composition predictable and type-safe with minimal syntax.

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
