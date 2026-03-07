import * as React from "react";

/**
 * A distributive version of the standard `Omit` utility
 *
 * @remarks
 * Unlike the built-in `Omit`, this type distributes over unions. This ensures
 * that when operating on a union type (e.g., `A | B`), the omission is applied
 * to each member individually rather than collapsing the union into only its
 * shared keys.
 *
 * @typeParam T - The source type (often a union) to omit keys from
 * @typeParam K - The keys to remove from the type
 */
export type SafeOmit<O, K> = O extends unknown
  ? K extends keyof O
    ? Omit<O, K>
    : never
  : never;

/**
 * A utility type that enforces strict object shapes by mapping excess
 * properties to `never`
 *
 * @remarks
 * TypeScript's structural typing is "open" by default, meaning objects can have
 * more properties than their interface requires. This utility forces an "exact"
 * match.
 *
 * The conditional `T extends unknown` ensures that the type is distributive,
 * allowing it to work correctly with unions.
 *
 * @typeParam Expected - The expected type
 * @typeParam Actual - The actual type to validate against `Expected`
 */
export type Exact<Expected, Actual> = Actual extends unknown
  ? Expected & {
      [K in keyof Actual]: K extends keyof Expected ? Actual[K] : never;
    }
  : never;

/**
 * Infers the variadic children arguments for intrinsic HTML element factories.
 *
 * @remarks
 * This corrects for React's internal `children` prop representation (e.g.
 * converting Iterables to Arrays).
 *
 * @typeParam Tag - A valid key of React's intrinsic elements (e.g., "div")
 */
type ChildrenArgs<Tag extends keyof React.JSX.IntrinsicElements> =
  React.ComponentProps<Tag> extends { children?: infer Children }
    ? (
        Children extends string
          ? string
          : Children extends Iterable<infer Item>
            ? Item[]
            : Children
      ) extends infer C
      ? C extends unknown[]
        ? C
        : [C?]
      : []
    : [];

/**
 * Merges standard intrinsic element props with support for arbitrary `data-*`
 * attributes.
 *
 * @typeParam ElementType - The React element type (intrinsic or custom)
 */
type ElementTypeProps<ElementType extends React.ElementType> =
  React.ComponentProps<ElementType> & { [K in `data-${string}`]?: string };

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extracts the type of props from a Renuel component implementation.
 *
 * @example
 * ```typescript
 * const { MyComp } = component((props: { label: string }) => ...);
 * type Props = ComponentProps<typeof MyComp>; // { label: string }
 * ```
 *
 * @typeParam C - The component implementation function
 */
export type ComponentProps<C> = C extends (props: infer P, ...args: any) => any
  ? P
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extracts the type of children arguments from a Renuel component
 * implementation.
 *
 * @typeParam C - The component implementation function.
 */
export type ComponentChildren<C> = C extends (
  props: any,
  ...children: infer K
) => any
  ? K
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Creates a component.
 *
 * @remarks
 * To define a component's name, destructure it from the returned object.  The
 * name you use for the variable becomes the component's display name.
 *
 * * @example
 * ```typescript
 * // Using destructuring to name the component 'Card'
 * export const { Card } = component((props: CardProps, ...[render]: CardChildren) => {
 *   return render({ className: "card-container" });
 * });
 * ```
 */
export const component = <
  T extends (...args: any) => unknown, // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  implementation: T,
): T & { displayName?: string } => {
  const Component = React.forwardRef(
    (props, ref) =>
      implementation(
        {
          ...props,
          children: undefined,
          ref,
        },
        ...("children" in props
          ? Array.isArray(props.children)
            ? props.children
            : [props.children]
          : []),
      ) as React.ReactNode,
  );

  return new Proxy(
    (props: React.Attributes, ...children: React.ReactNode[]) =>
      React.createElement(Component, props, ...children),
    {
      get(Component, property) {
        return Component[property as keyof typeof Component];
      },
      set(Component, property, value) {
        Object.assign(Component, { [property]: value });
        return true;
      },
    },
  ) as ReturnType<typeof component<T>>;
};

export const {
  a,
  a$,
  _a,
  _a$,
  abbr,
  abbr$,
  _abbr,
  _abbr$,
  address,
  address$,
  _address,
  _address$,
  area,
  area$,
  _area,
  _area$,
  article,
  article$,
  _article,
  _article$,
  aside,
  aside$,
  _aside,
  _aside$,
  audio,
  audio$,
  _audio,
  _audio$,
  b,
  b$,
  _b,
  _b$,
  base,
  base$,
  _base,
  _base$,
  bdi,
  bdi$,
  _bdi,
  _bdi$,
  bdo,
  bdo$,
  _bdo,
  _bdo$,
  big,
  big$,
  _big,
  _big$,
  blockquote,
  blockquote$,
  _blockquote,
  _blockquote$,
  body,
  body$,
  _body,
  _body$,
  br,
  br$,
  _br,
  _br$,
  button,
  button$,
  _button,
  _button$,
  canvas,
  canvas$,
  _canvas,
  _canvas$,
  caption,
  caption$,
  _caption,
  _caption$,
  center,
  center$,
  _center,
  _center$,
  cite,
  cite$,
  _cite,
  _cite$,
  code,
  code$,
  _code,
  _code$,
  col,
  col$,
  _col,
  _col$,
  colgroup,
  colgroup$,
  _colgroup,
  _colgroup$,
  data,
  data$,
  _data,
  _data$,
  datalist,
  datalist$,
  _datalist,
  _datalist$,
  dd,
  dd$,
  _dd,
  _dd$,
  del,
  del$,
  _del,
  _del$,
  details,
  details$,
  _details,
  _details$,
  dfn,
  dfn$,
  _dfn,
  _dfn$,
  dialog,
  dialog$,
  _dialog,
  _dialog$,
  div,
  div$,
  _div,
  _div$,
  dl,
  dl$,
  _dl,
  _dl$,
  dt,
  dt$,
  _dt,
  _dt$,
  em,
  em$,
  _em,
  _em$,
  embed,
  embed$,
  _embed,
  _embed$,
  fieldset,
  fieldset$,
  _fieldset,
  _fieldset$,
  figcaption,
  figcaption$,
  _figcaption,
  _figcaption$,
  figure,
  figure$,
  _figure,
  _figure$,
  footer,
  footer$,
  _footer,
  _footer$,
  form,
  form$,
  _form,
  _form$,
  h1,
  h1$,
  _h1,
  _h1$,
  h2,
  h2$,
  _h2,
  _h2$,
  h3,
  h3$,
  _h3,
  _h3$,
  h4,
  h4$,
  _h4,
  _h4$,
  h5,
  h5$,
  _h5,
  _h5$,
  h6,
  h6$,
  _h6,
  _h6$,
  head,
  head$,
  _head,
  _head$,
  header,
  header$,
  _header,
  _header$,
  hgroup,
  hgroup$,
  _hgroup,
  _hgroup$,
  hr,
  hr$,
  _hr,
  _hr$,
  html,
  html$,
  _html,
  _html$,
  i,
  i$,
  _i,
  _i$,
  iframe,
  iframe$,
  _iframe,
  _iframe$,
  img,
  img$,
  _img,
  _img$,
  input,
  input$,
  _input,
  _input$,
  ins,
  ins$,
  _ins,
  _ins$,
  kbd,
  kbd$,
  _kbd,
  _kbd$,
  keygen,
  keygen$,
  _keygen,
  _keygen$,
  label,
  label$,
  _label,
  _label$,
  legend,
  legend$,
  _legend,
  _legend$,
  li,
  li$,
  _li,
  _li$,
  link,
  link$,
  _link,
  _link$,
  main,
  main$,
  _main,
  _main$,
  map,
  map$,
  _map,
  _map$,
  mark,
  mark$,
  _mark,
  _mark$,
  menu,
  menu$,
  _menu,
  _menu$,
  menuitem,
  menuitem$,
  _menuitem,
  _menuitem$,
  meta,
  meta$,
  _meta,
  _meta$,
  meter,
  meter$,
  _meter,
  _meter$,
  nav,
  nav$,
  _nav,
  _nav$,
  noindex,
  noindex$,
  _noindex,
  _noindex$,
  noscript,
  noscript$,
  _noscript,
  _noscript$,
  object,
  object$,
  _object,
  _object$,
  ol,
  ol$,
  _ol,
  _ol$,
  optgroup,
  optgroup$,
  _optgroup,
  _optgroup$,
  option,
  option$,
  _option,
  _option$,
  output,
  output$,
  _output,
  _output$,
  p,
  p$,
  _p,
  _p$,
  param,
  param$,
  _param,
  _param$,
  picture,
  picture$,
  _picture,
  _picture$,
  pre,
  pre$,
  _pre,
  _pre$,
  progress,
  progress$,
  _progress,
  _progress$,
  q,
  q$,
  _q,
  _q$,
  rp,
  rp$,
  _rp,
  _rp$,
  rt,
  rt$,
  _rt,
  _rt$,
  ruby,
  ruby$,
  _ruby,
  _ruby$,
  s,
  s$,
  _s,
  _s$,
  samp,
  samp$,
  _samp,
  _samp$,
  slot,
  slot$,
  _slot,
  _slot$,
  script,
  script$,
  _script,
  _script$,
  search,
  search$,
  _search,
  _search$,
  section,
  section$,
  _section,
  _section$,
  select,
  select$,
  _select,
  _select$,
  small,
  small$,
  _small,
  _small$,
  source,
  source$,
  _source,
  _source$,
  span,
  span$,
  _span,
  _span$,
  strong,
  strong$,
  _strong,
  _strong$,
  style,
  style$,
  _style,
  _style$,
  sub,
  sub$,
  _sub,
  _sub$,
  summary,
  summary$,
  _summary,
  _summary$,
  sup,
  sup$,
  _sup,
  _sup$,
  table,
  table$,
  _table,
  _table$,
  template,
  template$,
  _template,
  _template$,
  tbody,
  tbody$,
  _tbody,
  _tbody$,
  td,
  td$,
  _td,
  _td$,
  textarea,
  textarea$,
  _textarea,
  _textarea$,
  tfoot,
  tfoot$,
  _tfoot,
  _tfoot$,
  th,
  th$,
  _th,
  _th$,
  thead,
  thead$,
  _thead,
  _thead$,
  time,
  time$,
  _time,
  _time$,
  title,
  title$,
  _title,
  _title$,
  tr,
  tr$,
  _tr,
  _tr$,
  track,
  track$,
  _track,
  _track$,
  u,
  u$,
  _u,
  _u$,
  ul,
  ul$,
  _ul,
  _ul$,
  var_,
  var$,
  _var,
  _var$,
  video,
  video$,
  _video,
  _video$,
  wbr,
  wbr$,
  _wbr,
  _wbr$,
  webview,
  webview$,
  _webview,
  _webview$,
  svg,
  svg$,
  _svg,
  _svg$,
  animate,
  animate$,
  _animate,
  _animate$,
  animateMotion,
  animateMotion$,
  _animateMotion,
  _animateMotion$,
  animateTransform,
  animateTransform$,
  _animateTransform,
  _animateTransform$,
  circle,
  circle$,
  _circle,
  _circle$,
  clipPath,
  clipPath$,
  _clipPath,
  _clipPath$,
  defs,
  defs$,
  _defs,
  _defs$,
  desc,
  desc$,
  _desc,
  _desc$,
  ellipse,
  ellipse$,
  _ellipse,
  _ellipse$,
  feBlend,
  feBlend$,
  _feBlend,
  _feBlend$,
  feColorMatrix,
  feColorMatrix$,
  _feColorMatrix,
  _feColorMatrix$,
  feComponentTransfer,
  feComponentTransfer$,
  _feComponentTransfer,
  _feComponentTransfer$,
  feComposite,
  feComposite$,
  _feComposite,
  _feComposite$,
  feConvolveMatrix,
  feConvolveMatrix$,
  _feConvolveMatrix,
  _feConvolveMatrix$,
  feDiffuseLighting,
  feDiffuseLighting$,
  _feDiffuseLighting,
  _feDiffuseLighting$,
  feDisplacementMap,
  feDisplacementMap$,
  _feDisplacementMap,
  _feDisplacementMap$,
  feDistantLight,
  feDistantLight$,
  _feDistantLight,
  _feDistantLight$,
  feDropShadow,
  feDropShadow$,
  _feDropShadow,
  _feDropShadow$,
  feFlood,
  feFlood$,
  _feFlood,
  _feFlood$,
  feFuncA,
  feFuncA$,
  _feFuncA,
  _feFuncA$,
  feFuncB,
  feFuncB$,
  _feFuncB,
  _feFuncB$,
  feFuncG,
  feFuncG$,
  _feFuncG,
  _feFuncG$,
  feFuncR,
  feFuncR$,
  _feFuncR,
  _feFuncR$,
  feGaussianBlur,
  feGaussianBlur$,
  _feGaussianBlur,
  _feGaussianBlur$,
  feImage,
  feImage$,
  _feImage,
  _feImage$,
  feMerge,
  feMerge$,
  _feMerge,
  _feMerge$,
  feMergeNode,
  feMergeNode$,
  _feMergeNode,
  _feMergeNode$,
  feMorphology,
  feMorphology$,
  _feMorphology,
  _feMorphology$,
  feOffset,
  feOffset$,
  _feOffset,
  _feOffset$,
  fePointLight,
  fePointLight$,
  _fePointLight,
  _fePointLight$,
  feSpecularLighting,
  feSpecularLighting$,
  _feSpecularLighting,
  _feSpecularLighting$,
  feSpotLight,
  feSpotLight$,
  _feSpotLight,
  _feSpotLight$,
  feTile,
  feTile$,
  _feTile,
  _feTile$,
  feTurbulence,
  feTurbulence$,
  _feTurbulence,
  _feTurbulence$,
  filter,
  filter$,
  _filter,
  _filter$,
  foreignObject,
  foreignObject$,
  _foreignObject,
  _foreignObject$,
  g,
  g$,
  _g,
  _g$,
  image,
  image$,
  _image,
  _image$,
  line,
  line$,
  _line,
  _line$,
  linearGradient,
  linearGradient$,
  _linearGradient,
  _linearGradient$,
  marker,
  marker$,
  _marker,
  _marker$,
  mask,
  mask$,
  _mask,
  _mask$,
  metadata,
  metadata$,
  _metadata,
  _metadata$,
  mpath,
  mpath$,
  _mpath,
  _mpath$,
  path,
  path$,
  _path,
  _path$,
  pattern,
  pattern$,
  _pattern,
  _pattern$,
  polygon,
  polygon$,
  _polygon,
  _polygon$,
  polyline,
  polyline$,
  _polyline,
  _polyline$,
  radialGradient,
  radialGradient$,
  _radialGradient,
  _radialGradient$,
  rect,
  rect$,
  _rect,
  _rect$,
  set,
  set$,
  _set,
  _set$,
  stop,
  stop$,
  _stop,
  _stop$,
  switch_,
  switch$,
  _switch,
  _switch$,
  symbol,
  symbol$,
  _symbol,
  _symbol$,
  text,
  text$,
  _text,
  _text$,
  textPath,
  textPath$,
  _textPath,
  _textPath$,
  tspan,
  tspan$,
  _tspan,
  _tspan$,
  use,
  use$,
  _use,
  _use$,
  view,
  view$,
  _view,
  _view$,
  /** @internal */
  ...restTags
} = new Proxy(
  {} as {
    [K in keyof React.JSX.IntrinsicElements extends infer Tag
      ? Tag extends "var" | "switch"
        ? `${Tag}_`
        : Tag
      : never]: K extends `${infer Tag extends keyof React.JSX.IntrinsicElements}${"_" | ""}`
      ? <A>(
          props: Exact<Omit<ElementTypeProps<Tag>, "children">, A>,
          ...children: ChildrenArgs<Tag>
        ) => React.ReactElement<ElementTypeProps<Tag>, Tag>
      : never;
  } & {
    [K in `${keyof React.JSX.IntrinsicElements}$`]: K extends `${infer Tag extends keyof React.JSX.IntrinsicElements}$`
      ? (
          ...children: ChildrenArgs<Tag>
        ) => React.ReactElement<ElementTypeProps<Tag>, Tag>
      : never;
  } & {
    [K in `_${keyof React.JSX.IntrinsicElements}`]: K extends `_${infer Tag extends keyof React.JSX.IntrinsicElements}`
      ? <A>(
          props: Exact<Omit<ElementTypeProps<Tag>, "children">, A>,
          ...children: ChildrenArgs<Tag>
        ) => <B>(
          props: Exact<Omit<ElementTypeProps<Tag>, "children" | keyof A>, B>,
        ) => React.ReactElement<ElementTypeProps<Tag>, Tag>
      : never;
  } & {
    [K in `_${keyof React.JSX.IntrinsicElements}$`]: K extends `_${infer Tag extends keyof React.JSX.IntrinsicElements}$`
      ? (
          ...children: ChildrenArgs<Tag>
        ) => <B>(
          props: Exact<Omit<ElementTypeProps<Tag>, "children">, B>,
        ) => React.ReactElement<ElementTypeProps<Tag>, Tag>
      : never;
  },
  {
    get: (_, name) => {
      if (typeof name === "string") {
        const tag = name.replace(/(^_|\$$)/g, "");
        if (name.startsWith("_")) {
          if (name.endsWith("$")) {
            return (...children: React.ReactNode[]) =>
              (b: React.Attributes) =>
                React.createElement(tag, b, ...children);
          }
          return (a: React.Attributes, ...children: React.ReactNode[]) =>
            (b: React.Attributes) =>
              React.createElement(tag, { ...b, ...a }, ...children);
        }
        if (name.endsWith("$")) {
          return (...children: React.ReactNode[]) =>
            React.createElement(tag, null, ...children);
        }
        return (props: React.Attributes, ...children: React.ReactNode[]) =>
          React.createElement(tag, props, ...children);
      }
      throw new Error("Invalid property name: not a string");
    },
  },
);

restTags satisfies Record<string, never>;

/**
 * A Renuel-wrapped version of `React.Fragment`
 *
 * @remarks
 * Useful for grouping multiple elements without adding an extra node to the
 * DOM, while maintaining the standard Renuel `(props, ...children)` signature.
 */
export const Fragment = component(
    (props: React.Attributes, ...children: React.ReactNode[]) =>
      React.createElement(React.Fragment, props, ...children),
  ),
  /**
   * A propless version of `Fragment`
   *
   * @remarks
   * Allows you to group elements by passing them directly as arguments without
   * providing an empty props object.
   *
   * * @example
   * ```typescript
   * Fragment$(
   *   div$("- First item"),
   *   div$("- Second item")
   * )
   * ```
   */
  Fragment$ = (...children: React.ReactNode[]) => Fragment({}, ...children);

Fragment.displayName = "Fragment";
