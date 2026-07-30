---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: Data Model - Node, Edge, Connection TypeScript Types
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/api-reference/types
---

# Data Model & TypeScript Types (v12)

## Node Type

```typescript
type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined
> = {
  id: string;
  position: { x: number; y: number };
  data: NodeData;
  type?: NodeType;
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  resizing?: boolean;
  parentId?: string;
  extent?: 'parent' | Rect;
  expandParent?: boolean;
  origin?: [number, number];
  zIndex?: number;
  ariaRole?: AriaRole;
  domAttributes?: SVGAttributes<SVGGElement>;
};
```

## Edge Type

```typescript
type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: EdgeType;
  data?: EdgeData;
  animated?: boolean;
  hidden?: boolean;
  selected?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  markerStart?: EdgeMarker;
  markerEnd?: EdgeMarker;
  style?: CSSProperties;
  className?: string;
  label?: ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  reconnectable?: boolean | HandleType;
  ariaRole?: AriaRole;
  domAttributes?: SVGAttributes<SVGGElement>;
};
```

## Connection Type

```typescript
type Connection = {
  source: string;
  sourceHandle: string | null;
  target: string;
  targetHandle: string | null;
};
```

## Viewport Type

```typescript
type Viewport = {
  x: number;
  y: number;
  zoom: number;
};
```

## Rect Type (bounds)

```typescript
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

## Typed Custom Nodes

Define typed nodes with generics for full type safety:

```tsx
type CounterNodeData = {
  label: string;
  count: number;
};

type CounterNode = Node<CounterNodeData, 'counter'>;

// Generic hook usage
function useTypedFlow() {
  const reactFlow = useReactFlow<CounterNode, Edge>();
  // reactFlow.getNode() returns CounterNode | undefined
}
```
