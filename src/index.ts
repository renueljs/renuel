import * as React from "react";

type SafeOmit<O, K extends keyof O> = O extends unknown ? Omit<O, K> : never;

type KeysWithUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type OptionalKeys<T> = KeysWithUndefined<T>;
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;

type AnyRequired<T> = RequiredKeys<T> extends never ? false : true;

type RemoveNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

type AttributeProps<ElementType extends React.ElementType> = SafeOmit<
  React.ComponentProps<ElementType>,
  "children"
> &
  React.Attributes;

// Helper to determine the *final* type of children, whether it's an array or a single value
type FinalChildrenType<T> =
  T extends Iterable<infer Item>
    ? T extends string // Special case for string: treat as single value
      ? T
      : Item[] // For other iterables (arrays), return an array of the item type
    : T; // For single, non-iterable values

type ChildrenArgs<
  ElementType extends React.ElementType,
  Props = React.ComponentProps<ElementType>,
> = "children" extends keyof Props
  ? FinalChildrenType<Props["children"]> extends infer Children
    ? // If children are an array type (like `string[]` or `number[]`), return that type directly
      Children extends unknown[]
      ? Children
      : // Otherwise, children are a single value (string, number, etc.)
        "children" extends RequiredKeys<Props>
        ? [Children] // Required single child becomes a tuple with one element
        : [Children?] // Optional single child becomes a tuple with an optional element
    : []
  : [];

export type ReactElement<ElementType extends React.ElementType> =
  React.ReactElement<
    React.ComponentProps<ElementType> & React.Attributes,
    ElementType
  >;

/** Combines ExpectedProps with a generic P, ensuring no excess properties. */
type NoExcessProps<ExpectedProps, ActualProps> = ExpectedProps & {
  [P in keyof ActualProps]: P extends keyof ExpectedProps
    ? ExpectedProps[P]
    : never;
};

/** A function that accepts props and children, and returns a React element. */
type FactoryFunction<Props, ElementType extends React.ElementType> = <const P>(
  props: NoExcessProps<Props, P>,
  ...children: P extends { children: unknown } ? [] : ChildrenArgs<ElementType>
) => ReactElement<ElementType>;

/** A curried function that returns a new function taking final props. */
type CurriedFinalFunction<
  Props,
  ElementType extends React.ElementType,
  HasRequiredProps extends boolean,
> = HasRequiredProps extends true
  ? <const P>(props: NoExcessProps<Props, P>) => ReactElement<ElementType>
  : <const P>(props?: NoExcessProps<Props, P>) => ReactElement<ElementType>;

export type StandardFactory<ElementType extends React.ElementType> =
  FactoryFunction<
    React.ComponentProps<ElementType> & React.Attributes,
    ElementType
  >;

export type SkipPropsFactory<ElementType extends React.ElementType> =
  AnyRequired<AttributeProps<ElementType>> extends false
    ? (...children: ChildrenArgs<ElementType>) => ReactElement<ElementType>
    : never;

export type PartialFactory<ElementType extends React.ElementType> = <const P0>(
  props: NoExcessProps<Partial<AttributeProps<ElementType>>, P0>,
  ...children: ChildrenArgs<ElementType>
) => CurriedFinalFunction<
  SafeOmit<AttributeProps<ElementType>, keyof P0>,
  ElementType,
  AnyRequired<SafeOmit<AttributeProps<ElementType>, keyof P0>>
>;

export type PartialSkipPropsFactory<ElementType extends React.ElementType> = (
  ...children: ChildrenArgs<ElementType>
) => CurriedFinalFunction<
  AttributeProps<ElementType>,
  ElementType,
  AnyRequired<AttributeProps<ElementType>>
>;

const createStandardFactory = <
  const Name extends string,
  ElementType extends React.ElementType,
>(
  name: Name,
  elementType: ElementType,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const factory: any = (
    props: Parameters<typeof React.createElement>[1],
    ...children: Parameters<typeof React.createElement>[2][]
  ) =>
    React.createElement(
      elementType,
      props,
      ...(props && "children" in props ? [] : children),
    );

  return { [name]: factory } as Record<Name, StandardFactory<ElementType>>;
};

const createSkipPropsFactory = <
  const Name extends string,
  ElementType extends React.ElementType,
>(
  name: Name,
  elementType: ElementType,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const factory: any = (
    ...children: Parameters<typeof React.createElement>[2][]
  ) => React.createElement(elementType, null, ...children);

  return { [`${name}$`]: factory } as RemoveNever<
    Record<`${Name}$`, SkipPropsFactory<ElementType>>
  >;
};

const createPartialFactory = <
  const Name extends string,
  ElementType extends React.ElementType,
>(
  name: Name,
  elementType: ElementType,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const factory: any =
    (
      props0: Parameters<typeof React.createElement>[1],
      ...children: Parameters<typeof React.createElement>[2][]
    ) =>
    (props1: Parameters<typeof React.createElement>[1]) =>
      React.createElement(elementType, { ...props0, ...props1 }, ...children);

  return { [`_${name}`]: factory } as Record<
    `_${Name}`,
    PartialFactory<ElementType>
  >;
};

const createPartialSkipPropsFactory = <
  const Name extends string,
  ElementType extends React.ElementType,
>(
  name: Name,
  elementType: ElementType,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const factory: any =
    (...children: Parameters<typeof React.createElement>[2][]) =>
    (props: Parameters<typeof React.createElement>[1]) =>
      React.createElement(elementType, props, ...children);

  return { [`_${name}$`]: factory } as Record<
    `_${Name}$`,
    PartialSkipPropsFactory<ElementType>
  >;
};

type Factories<
  Name extends string,
  ElementType extends React.ElementType,
> = ReturnType<typeof createStandardFactory<Name, ElementType>> &
  ReturnType<typeof createSkipPropsFactory<Name, ElementType>> &
  ReturnType<typeof createPartialFactory<Name, ElementType>> &
  ReturnType<typeof createPartialSkipPropsFactory<Name, ElementType>>;

export const component = <
  const Name extends string,
  ElementType extends React.ElementType,
>(
  name: Name,
  elementType: ElementType,
) => {
  if (typeof elementType === "function" && !elementType.displayName) {
    elementType.displayName = name;
  }
  return {
    ...createStandardFactory(name, elementType),
    ...createSkipPropsFactory(name, elementType),
    ...createPartialFactory(name, elementType),
    ...createPartialSkipPropsFactory(name, elementType),
  } as Factories<Name, ElementType>;
};

export const { Fragment, Fragment$ } = component("Fragment", React.Fragment);

const tag = <TagName extends keyof React.JSX.IntrinsicElements>(
  tagName: TagName,
) => component(tagName, tagName);

// HTML Elements
export const { a, a$, _a, _a$ } = tag("a");
export const { abbr, abbr$, _abbr, _abbr$ } = tag("abbr");
export const { address, address$, _address, _address$ } = tag("address");
export const { area, area$, _area, _area$ } = tag("area");
export const { article, article$, _article, _article$ } = tag("article");
export const { aside, aside$, _aside, _aside$ } = tag("aside");
export const { audio, audio$, _audio, _audio$ } = tag("audio");
export const { b, b$, _b, _b$ } = tag("b");
export const { base, base$, _base, _base$ } = tag("base");
export const { bdi, bdi$, _bdi, _bdi$ } = tag("bdi");
export const { bdo, bdo$, _bdo, _bdo$ } = tag("bdo");
export const { big, big$, _big, _big$ } = tag("big");
export const { blockquote, blockquote$, _blockquote, _blockquote$ } =
  tag("blockquote");
export const { body, body$, _body, _body$ } = tag("body");
export const { br, br$, _br, _br$ } = tag("br");
export const { button, button$, _button, _button$ } = tag("button");
export const { canvas, canvas$, _canvas, _canvas$ } = tag("canvas");
export const { caption, caption$, _caption, _caption$ } = tag("caption");
export const { cite, cite$, _cite, _cite$ } = tag("cite");
export const { code, code$, _code, _code$ } = tag("code");
export const { col, col$, _col, _col$ } = tag("col");
export const { colgroup, colgroup$, _colgroup, _colgroup$ } = tag("colgroup");
export const { data, data$, _data, _data$ } = tag("data");
export const { datalist, datalist$, _datalist, _datalist$ } = tag("datalist");
export const { dd, dd$, _dd, _dd$ } = tag("dd");
export const { del, del$, _del, _del$ } = tag("del");
export const { details, details$, _details, _details$ } = tag("details");
export const { dfn, dfn$, _dfn, _dfn$ } = tag("dfn");
export const { dialog, dialog$, _dialog, _dialog$ } = tag("dialog");
export const { div, div$, _div, _div$ } = tag("div");
export const { dl, dl$, _dl, _dl$ } = tag("dl");
export const { dt, dt$, _dt, _dt$ } = tag("dt");
export const { em, em$, _em, _em$ } = tag("em");
export const { embed, embed$, _embed, _embed$ } = tag("embed");
export const { fieldset, fieldset$, _fieldset, _fieldset$ } = tag("fieldset");
export const { figcaption, figcaption$, _figcaption, _figcaption$ } =
  tag("figcaption");
export const { figure, figure$, _figure, _figure$ } = tag("figure");
export const { footer, footer$, _footer, _footer$ } = tag("footer");
export const { form, form$, _form, _form$ } = tag("form");
export const { h1, h1$, _h1, _h1$ } = tag("h1");
export const { h2, h2$, _h2, _h2$ } = tag("h2");
export const { h3, h3$, _h3, _h3$ } = tag("h3");
export const { h4, h4$, _h4, _h4$ } = tag("h4");
export const { h5, h5$, _h5, _h5$ } = tag("h5");
export const { h6, h6$, _h6, _h6$ } = tag("h6");
export const { head, head$, _head, _head$ } = tag("head");
export const { header, header$, _header, _header$ } = tag("header");
export const { hgroup, hgroup$, _hgroup, _hgroup$ } = tag("hgroup");
export const { hr, hr$, _hr, _hr$ } = tag("hr");
export const { html, html$, _html, _html$ } = tag("html");
export const { i, i$, _i, _i$ } = tag("i");
export const { iframe, iframe$, _iframe, _iframe$ } = tag("iframe");
export const { img, img$, _img, _img$ } = tag("img");
export const { input, input$, _input, _input$ } = tag("input");
export const { ins, ins$, _ins, _ins$ } = tag("ins");
export const { kbd, kbd$, _kbd, _kbd$ } = tag("kbd");
export const { keygen, keygen$, _keygen, _keygen$ } = tag("keygen");
export const { label, label$, _label, _label$ } = tag("label");
export const { legend, legend$, _legend, _legend$ } = tag("legend");
export const { li, li$, _li, _li$ } = tag("li");
export const { link, link$, _link, _link$ } = tag("link");
export const { main, main$, _main, _main$ } = tag("main");
export const { map, map$, _map, _map$ } = tag("map");
export const { mark, mark$, _mark, _mark$ } = tag("mark");
export const { menu, menu$, _menu, _menu$ } = tag("menu");
export const { menuitem, menuitem$, _menuitem, _menuitem$ } = tag("menuitem");
export const { meta, meta$, _meta, _meta$ } = tag("meta");
export const { meter, meter$, _meter, _meter$ } = tag("meter");
export const { nav, nav$, _nav, _nav$ } = tag("nav");
export const { noindex, noindex$, _noindex, _noindex$ } = tag("noindex");
export const { noscript, noscript$, _noscript, _noscript$ } = tag("noscript");
export const { object, object$, _object, _object$ } = tag("object");
export const { ol, ol$, _ol, _ol$ } = tag("ol");
export const { optgroup, optgroup$, _optgroup, _optgroup$ } = tag("optgroup");
export const { option, option$, _option, _option$ } = tag("option");
export const { output, output$, _output, _output$ } = tag("output");
export const { p, p$, _p, _p$ } = tag("p");
export const { param, param$, _param, _param$ } = tag("param");
export const { picture, picture$, _picture, _picture$ } = tag("picture");
export const { pre, pre$, _pre, _pre$ } = tag("pre");
export const { progress, progress$, _progress, _progress$ } = tag("progress");
export const { q, q$, _q, _q$ } = tag("q");
export const { rp, rp$, _rp, _rp$ } = tag("rp");
export const { rt, rt$, _rt, _rt$ } = tag("rt");
export const { ruby, ruby$, _ruby, _ruby$ } = tag("ruby");
export const { s, s$, _s, _s$ } = tag("s");
export const { samp, samp$, _samp, _samp$ } = tag("samp");
export const { script, script$, _script, _script$ } = tag("script");
export const { section, section$, _section, _section$ } = tag("section");
export const { select, select$, _select, _select$ } = tag("select");
export const { small, small$, _small, _small$ } = tag("small");
export const { source, source$, _source, _source$ } = tag("source");
export const { span, span$, _span, _span$ } = tag("span");
export const { strong, strong$, _strong, _strong$ } = tag("strong");
export const { sub, sub$, _sub, _sub$ } = tag("sub");
export const { summary, summary$, _summary, _summary$ } = tag("summary");
export const { sup, sup$, _sup, _sup$ } = tag("sup");
export const { table, table$, _table, _table$ } = tag("table");
export const { tbody, tbody$, _tbody, _tbody$ } = tag("tbody");
export const { td, td$, _td, _td$ } = tag("td");
export const { textarea, textarea$, _textarea, _textarea$ } = tag("textarea");
export const { tfoot, tfoot$, _tfoot, _tfoot$ } = tag("tfoot");
export const { th, th$, _th, _th$ } = tag("th");
export const { thead, thead$, _thead, _thead$ } = tag("thead");
export const { time, time$, _time, _time$ } = tag("time");
export const { title, title$, _title, _title$ } = tag("title");
export const { tr, tr$, _tr, _tr$ } = tag("tr");
export const { track, track$, _track, _track$ } = tag("track");
export const { u, u$, _u, _u$ } = tag("u");
export const { ul, ul$, _ul, _ul$ } = tag("ul");
export const {
  var: var_,
  var$: var_$,
  _var: _var_,
  _var$: _var_$,
} = tag("var");
export const { video, video$, _video, _video$ } = tag("video");
export const { wbr, wbr$, _wbr, _wbr$ } = tag("wbr");

// SVG Elements
export const { svg, svg$, _svg, _svg$ } = tag("svg");
export const { animate, animate$, _animate, _animate$ } = tag("animate");
export const { circle, circle$, _circle, _circle$ } = tag("circle");
export const { clipPath, clipPath$, _clipPath, _clipPath$ } = tag("clipPath");
export const { defs, defs$, _defs, _defs$ } = tag("defs");
export const { desc, desc$, _desc, _desc$ } = tag("desc");
export const { ellipse, ellipse$, _ellipse, _ellipse$ } = tag("ellipse");
export const { feBlend, feBlend$, _feBlend, _feBlend$ } = tag("feBlend");
export const {
  feColorMatrix,
  feColorMatrix$,
  _feColorMatrix,
  _feColorMatrix$,
} = tag("feColorMatrix");
export const {
  feComponentTransfer,
  feComponentTransfer$,
  _feComponentTransfer,
  _feComponentTransfer$,
} = tag("feComponentTransfer");
export const { feComposite, feComposite$, _feComposite, _feComposite$ } =
  tag("feComposite");
export const {
  feConvolveMatrix,
  feConvolveMatrix$,
  _feConvolveMatrix,
  _feConvolveMatrix$,
} = tag("feConvolveMatrix");
export const {
  feDiffuseLighting,
  feDiffuseLighting$,
  _feDiffuseLighting,
  _feDiffuseLighting$,
} = tag("feDiffuseLighting");
export const {
  feDisplacementMap,
  feDisplacementMap$,
  _feDisplacementMap,
  _feDisplacementMap$,
} = tag("feDisplacementMap");
export const {
  feDistantLight,
  feDistantLight$,
  _feDistantLight,
  _feDistantLight$,
} = tag("feDistantLight");
export const { feDropShadow, feDropShadow$, _feDropShadow, _feDropShadow$ } =
  tag("feDropShadow");
export const { feFlood, feFlood$, _feFlood, _feFlood$ } = tag("feFlood");
export const { feFuncA, feFuncA$, _feFuncA, _feFuncA$ } = tag("feFuncA");
export const { feFuncB, feFuncB$, _feFuncB, _feFuncB$ } = tag("feFuncB");
export const { feFuncG, feFuncG$, _feFuncG, _feFuncG$ } = tag("feFuncG");
export const { feFuncR, feFuncR$, _feFuncR, _feFuncR$ } = tag("feFuncR");
export const {
  feGaussianBlur,
  feGaussianBlur$,
  _feGaussianBlur,
  _feGaussianBlur$,
} = tag("feGaussianBlur");
export const { feImage, feImage$, _feImage, _feImage$ } = tag("feImage");
export const { feMerge, feMerge$, _feMerge, _feMerge$ } = tag("feMerge");
export const { feMergeNode, feMergeNode$, _feMergeNode, _feMergeNode$ } =
  tag("feMergeNode");
export const { feMorphology, feMorphology$, _feMorphology, _feMorphology$ } =
  tag("feMorphology");
export const { feOffset, feOffset$, _feOffset, _feOffset$ } = tag("feOffset");
export const { fePointLight, fePointLight$, _fePointLight, _fePointLight$ } =
  tag("fePointLight");
export const {
  feSpecularLighting,
  feSpecularLighting$,
  _feSpecularLighting,
  _feSpecularLighting$,
} = tag("feSpecularLighting");
export const { feSpotLight, feSpotLight$, _feSpotLight, _feSpotLight$ } =
  tag("feSpotLight");
export const { feTile, feTile$, _feTile, _feTile$ } = tag("feTile");
export const { feTurbulence, feTurbulence$, _feTurbulence, _feTurbulence$ } =
  tag("feTurbulence");
export const { filter, filter$, _filter, _filter$ } = tag("filter");
export const {
  foreignObject,
  foreignObject$,
  _foreignObject,
  _foreignObject$,
} = tag("foreignObject");
export const { g, g$, _g, _g$ } = tag("g");
export const { image, image$, _image, _image$ } = tag("image");
export const { line, line$, _line, _line$ } = tag("line");
export const {
  linearGradient,
  linearGradient$,
  _linearGradient,
  _linearGradient$,
} = tag("linearGradient");
export const { marker, marker$, _marker, _marker$ } = tag("marker");
export const { mask, mask$, _mask, _mask$ } = tag("mask");
export const { metadata, metadata$, _metadata, _metadata$ } = tag("metadata");
export const { path, path$, _path, _path$ } = tag("path");
export const { pattern, pattern$, _pattern, _pattern$ } = tag("pattern");
export const { polygon, polygon$, _polygon, _polygon$ } = tag("polygon");
export const { polyline, polyline$, _polyline, _polyline$ } = tag("polyline");
export const {
  radialGradient,
  radialGradient$,
  _radialGradient,
  _radialGradient$,
} = tag("radialGradient");
export const { rect, rect$, _rect, _rect$ } = tag("rect");
export const { stop, stop$, _stop, _stop$ } = tag("stop");
export const { style, style$, _style, _style$ } = tag("style");
export const {
  switch: switch_,
  switch$: switch_$,
  _switch: _switch_,
  _switch$: _switch_$,
} = tag("switch");
export const { symbol, symbol$, _symbol, _symbol$ } = tag("symbol");
export const { text, text$, _text, _text$ } = tag("text");
export const { textPath, textPath$, _textPath, _textPath$ } = tag("textPath");
export const { tspan, tspan$, _tspan, _tspan$ } = tag("tspan");
export const { use, use$, _use, _use$ } = tag("use");
export const { view, view$, _view, _view$ } = tag("view");
