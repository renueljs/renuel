import * as React from "react";

/**
 * Omits keys `K` from `O` distributively to preserve unions.
 * @typeParam O - Source object type
 * @typeParam K - Keys to remove from `O`
 */
type SafeOmit<O, K> = O extends unknown ? Omit<O, Extract<K, keyof O>> : never;

/**
 * Extracts the keys of `T` that are required (not possibly undefined).
 * @typeParam T - Object type from which to extract required keys
 */
type RequiredKeys<T> = Exclude<
  keyof T,
  {
    [K in keyof T]: undefined extends T[K] ? K : never;
  }[keyof T]
>;

/**
 * Evaluates to `true` if `T` has any required keys, otherwise `false`.
 * @typeParam T - Object type to check for required fields
 */
type AnyRequired<T> = RequiredKeys<T> extends never ? false : true;

/**
 * Removes keys from `T` whose type is `never`.
 * @typeParam T - Object type from which to filter fields whose type is `never`.
 */
type RemoveNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Props representing arbitrary `data-*` attributes for elements
 *
 * @typeParam ElementType - The type of element, used to determine whether data
 * props can be defined
 */
type DataProps<ElementType> = ElementType extends string
  ? { [K in `data-${string}`]?: string }
  : unknown;

/**
 * Props excluding children and including global React attributes
 * @typeParam Props - The set of props from which to extract attribute props
 */
type AttributeProps<Props> = SafeOmit<Props, "children"> & React.Attributes;

/**
 * Infers variadic children arguments for element factories.
 * @typeParam Props - The set of props from which to derive children arguments
 */
type ChildrenArgs<Props> = Props extends { children?: infer Children }
  ? (
      Children extends string
        ? string
        : Children extends Iterable<infer Item>
          ? Item[]
          : Children
    ) extends infer C
    ? C extends unknown[]
      ? C
      : "children" extends RequiredKeys<Props>
        ? [C]
        : [C?]
    : []
  : [];

/**
 * Ensures that `ActualProps` contains no props in addition to `ExpectedProps`.
 * @typeParam ExpectedProps - The expected props
 * @typeParam ActualProps - The provided props
 */
type NoExcessProps<ExpectedProps, ActualProps> = ExpectedProps & {
  [P in keyof ActualProps]: P extends keyof ExpectedProps
    ? ExpectedProps[P]
    : never;
};

/**
 * A standard element factory that accepts props and children
 * @typeParam Props - The type of props `ElementType` accepts
 * @typeParam ElementType - The type of element the factory produces
 */
type StandardFactory<Props, ElementType extends React.ElementType> = <const P>(
  props: NoExcessProps<AttributeProps<Props>, P>,
  ...children: P extends { children: unknown } ? [] : ChildrenArgs<Props>
) => React.ReactElement<Props, ElementType>;

/**
 * An element factory that accepts children
 * @typeParam Props - The type of props `ElementType` accepts
 * @typeParam ElementType - The type of element the factory produces
 */
type SkipPropsFactory<Props, ElementType extends React.ElementType> =
  AnyRequired<AttributeProps<Props>> extends false
    ? (
        ...children: ChildrenArgs<Props>
      ) => React.ReactElement<Props, ElementType>
    : never;

/**
 * A curried function that accepts remaining props and returns a React element
 * @typeParam Props - The remaining props that the function accepts
 * @typeParam ElementType - The type of element the function returns
 */
type CurriedFinalFunction<Props, ElementType extends React.ElementType> =
  AnyRequired<Props> extends true
    ? <const P>(
        props: NoExcessProps<Props, P>,
      ) => React.ReactElement<Props, ElementType>
    : <const P>(
        props?: NoExcessProps<Props, P>,
      ) => React.ReactElement<Props, ElementType>;

/**
 * A partial element factory that accepts props and children and returns a
 * curried function that accepts remaining props
 * @typeParam Props - The type of props `ElementType` accepts
 * @typeParam ElementType - The type of element the factory produces
 */
type PartialFactory<Props, ElementType extends React.ElementType> = <const P0>(
  props: NoExcessProps<Partial<AttributeProps<Props>>, P0>,
  ...children: ChildrenArgs<Props>
) => SafeOmit<AttributeProps<Props>, keyof P0> extends infer P1
  ? CurriedFinalFunction<P1, ElementType>
  : never;

/**
 * A partial element factory that accepts children and returns a curried
 * function that accepts props
 * @typeParam Props - The type of props `ElementType` accepts
 * @typeParam ElementType - The type of element the factory produces
 */
type PartialSkipPropsFactory<Props, ElementType extends React.ElementType> = (
  ...children: ChildrenArgs<Props>
) => CurriedFinalFunction<AttributeProps<Props>, ElementType>;

/**
 * Generates a set of element factories for a given `elementType`.
 * @param name - The name of the component or element type
 * @param elementType - The element type for which to produce factories
 * @returns An object containing standard, skip-props, partial, and
 * partial-skip-props factories
 */
export const component = <
  const Name extends string,
  ElementType extends React.ElementType,
  Props = React.ComponentProps<ElementType> & DataProps<ElementType>,
>(
  name: Name,
  elementType: ElementType,
): RemoveNever<
  Record<Name, StandardFactory<Props, ElementType>> &
    Record<`${Name}$`, SkipPropsFactory<Props, ElementType>> &
    Record<`_${Name}`, PartialFactory<Props, ElementType>> &
    Record<`_${Name}$`, PartialSkipPropsFactory<Props, ElementType>>
> => {
  const standard = (
    props: Parameters<typeof React.createElement>[1],
    ...children: Parameters<typeof React.createElement>[2][]
  ) => React.createElement(elementType, props, ...children);

  const skipProps = (...children: Parameters<typeof standard>[1][]) =>
    standard(null, ...children);

  const partial =
    (
      p0: Parameters<typeof standard>[0],
      ...children: Parameters<typeof standard>[1][]
    ) =>
    (p1: Parameters<typeof standard>[0]) =>
      standard({ ...p0, ...p1 }, ...children);

  const partialSkipProps =
    (...children: Parameters<typeof standard>[1][]) =>
    (props: Parameters<typeof standard>[0]) =>
      standard(props, ...children);

  return {
    [name]: standard,
    [`${name}$`]: skipProps,
    [`_${name}`]: partial,
    [`_${name}$`]: partialSkipProps,
  } as ReturnType<typeof component<Name, ElementType, Props>>;
};

/** Fragment factories */
export const { Fragment, Fragment$ } = component("Fragment", React.Fragment);
