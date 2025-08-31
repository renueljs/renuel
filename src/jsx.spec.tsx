import type { ReactNode } from "react";

import { component, div$ } from "./index.ts";

const { Block } = component(
  "Block",
  ({ children }: { children?: ReactNode }) => <div>{children}</div>,
);

<Block>
  <div />
</Block>;

// @ts-expect-error excess children
Block({ children: div$() }, div$());
