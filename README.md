<p align="center" id="logos">
  <img alt="Renuel" src=".github/logo-light.png#gh-light-mode-only" height="384" style="max-width: 100%;">
  <img alt="Renuel" src=".github/logo-dark.png#gh-dark-mode-only" height="384" style="max-width: 100%;">
</p>

<p align="center" id="badges">
  <a href="https://github.com/renueljs/renuel/tree/v0.0.21-next.5"><img src="https://img.shields.io/badge/tag-v0.0.21--next.5-orange" alt="tag v0.0.21-next.5"></a>
  <a href="https://www.npmjs.com/package/renuel/v/0.0.21-next.5"><img src="https://img.shields.io/badge/npm-v0.0.21--next.5-orange" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/renuel@v0.0.21-next.5"><img src="https://img.shields.io/bundlephobia/minzip/renuel@v0.0.21-next.5?label=bundle%20size&color=orange" alt="npm v0.0.21-next.5 version bundle size"></a>
  <a href="https://github.com/renueljs/renuel/blob/v0.0.21-next.5/LICENSE"><img src="https://img.shields.io/badge/license-MIT-orange" alt="license"></a>
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
import { button, factories, strong$ } from "renuel";

const { App$ } = factories({
  App() {
    const [count, onClick] = useReducer((x) => x + 1, 0);
    return button({ onClick }, "Count: ", strong$(count));
  }
});

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(App$());
}
```

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/api/v1/sandboxes/define?parameters=N4IgZglgNgpgziAXKAhgBzQOgBYBcC2USoAxgPYB2uMVSIAPAIQAmZJuAnmjAAR6EA%2BADoV6%2FKMIo8eYmCmaTp0%2Bvhi4UPEthQAnOGoC8QkAFUAKgDEAtAA5jPAPSKlKtRoopVRkADcIMAHc0Mh1ce3IqGlxvAIhmXGwDZhg%2FEhgrWPjsABoeCAoIXAgUKCs4EhKYAwBGTAAGeycRJRki3FgBACUaAFcYKB4AERh8MnoHNo7mmQdsOQVp%2BgAjMmYOZ2VmCB885m8dMjIwkAFxrZ8NmXKdCDRcHk5ub1HmHth7OB0Sb0wHfBR8phcHBjKcHNdbrhnOMVmtJONxJIQABfbIgNAoEgAaxQAHMYJgAFZwSjEEARai0RAgYDTYweVTGRA8Yw6Xr9KzJUbGbJ03wwPQQShMlkgWp1eo8vnJCF3IUUEXGboUPoDLlkHhoA6EmDsKVSUX%2FfKKkDoLDifXSYyy4Ei2kGq0gODqUImjFffo8M04AhQYzTVHSmDcCjJCgkfwgpA8e0tYwAAUe8AcbMxx2ZxmqAE5MAAmPOWpQJpNwFNydicsj4E3ZvMFkC8h2i1N66OZnP5hoN6aOlu4SvVttijuS7tN4zutJ%2Bof56oANlHjbjIDZKv6JolEtz1SsFBgAA9cJgAKyFx0lkg3O4m4%2BYHMAZn9BuRImRKLRwIikFxRJJFDJFJRHQsaiuQ%2BBoNAAoAPJypQUbMiB566Pi6aigAogAyrmdTYWeoo9PowyQHuFghAAwlAKBwHAFj%2BFAzDwQ8Oh9EuRYgC8bwwCamEAHIHscrGOlAEBLCKADaPZsZh2G4WOLSOoMUEALJ4QpymYAAktQOgoEs7wgJJAC6gminAWK3AAMiJZFzNiIq4MxMAmcYHGwN0JJQD0RTCkOSw9KGsA6HhxglFAZABBp4EhEUFC4mYcBoYeNBwPKjEOSxkmsvAZBQD4MAAFJ%2FkpqycfZjnOSAEAeSg1DMMVrywGl5WZSAFBkGh%2BCFGVGXjk6DkQK2zLpU5LVtSYKr6MwFlsCUTU9cuY0TTAzAAAq6J4agCnNI29W1FihQkBw9Li2BkVR8AaRQGGxLgWjdVxz6scY%2BQkJ5yTiS1RoUECUbTIZr7vuxALfcCAGUJSuB0BAUWhDGPAETA3SvGkOg8MiPBgAc%2BDNuWxwANwiNDwSw8AmiptQnSHPc6OY1WONpgODivf4VDGATBQw%2FcpN%2BbguCULkYBpiEka5M6ByxQAJGjGNYzja7TuzIgRM6cMAIIYFL6MGBjQs3PAAAUIHq2g%2BsAJQxpJyv3GJ5D%2BbguSUBRA1YoZPDawjSM9Cj%2Bv6%2Fu5sGAIPD7jwADUPDVLkdSm%2BzLRsrgPQ6FIPN8xQhs8I7wnYmjuTGGRZB2xmDY8GLlC4hL%2Bu21QpvRwGr41wq4ZwfcBxHGhAza6wJA9KoVCYChbcjFEABCHAacw%2BuslTxj1xAYA8PrLe4G35sgVbPCL27ZNyBTVML1Ty8x%2BvVOYKuyQ6Prxvl9X7Nvsid9AA%3D)
<!--demo-end-->
<!--prettier-ignore-end-->

## Custom components

### Basic

Here's a simple `Button` component with a `variant` prop and children as the label:

<!--prettier-ignore-start-->
```typescript
import { factories, button$ } from "renuel";

const { Button, Button$ } = factories({
  Button({
    variant = "secondary",
    children,
  }: {
    variant?: "primary" | "secondary";
    children?: React.ReactNode;
  }) {
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
      children
    );
  }
});

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
import { factories, button$, _a, _button$ } from "renuel";

const { Button, Button$ } = factories({
  Button({
    variant = "secondary",
    children
  }: {
    variant?: "primary" | "secondary";
    children: (props: { style: React.CSSProperties }) => React.ReactNode;
  }) {
    return children({
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
  }
});

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
