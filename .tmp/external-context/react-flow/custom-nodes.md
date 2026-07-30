---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: Custom Node Types
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/api-reference/custom-nodes
---

# Custom Node Types

## Defining a Custom Node Component

Use `NodeProps` and `Handle` from `@xyflow/react`:

```tsx
import { useState } from 'react';
import { NodeProps, Handle, Position, Node } from '@xyflow/react';

type CounterNodeData = {
  label: string;
  count: number;
};

export type CounterNode = Node<CounterNodeData, 'counter'>;

export function CounterNodeComponent({ data }: NodeProps<CounterNode>) {
  const [count, setCount] = useState(data.count);

  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #555',
        borderRadius: '5px',
        background: '#fff',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <button onClick={() => setCount((c) => c + 1)}>
        Count: {count}
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

## Custom Node with Handles (Pattern Template)

```tsx
import { NodeProps, Handle, Position, Node } from '@xyflow/react';

export type MyNodeData = {
  label: string;
  value?: number;
};

export type MyNode = Node<MyNodeData, 'mynode'>;

export function MyNodeComponent({
  data,
  selected,
  isConnecting,
}: NodeProps<MyNode>) {
  return (
    <div
      style={{
        padding: '10px',
        border: selected ? '2px solid blue' : '1px solid #222',
        borderRadius: '5px',
        background: '#fff',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <div>{data.value}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

## Registering Custom Nodes

**IMPORTANT: Define `nodeTypes` OUTSIDE the component or memoize it** to avoid performance issues:

```tsx
// ✅ CORRECT: Outside the component (stable reference)
const nodeTypes = {
  counter: CounterNodeComponent,
  process: ProcessNode,
  decision: DecisionNode,
};

function Flow() {
  return <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />;
}
```

```tsx
// ✅ ALSO CORRECT: Memoized
function Flow() {
  const nodeTypes = useMemo(
    () => ({
      counter: CounterNodeComponent,
      process: ProcessNode,
      decision: DecisionNode,
    }),
    []
  );

  return <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />;
}
```

```tsx
// ❌ WRONG: Inline object creates a new reference every render
function Flow() {
  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={{ counter: CounterNodeComponent }} // BAD!
    />
  );
}
```

React Flow v12 will warn in development: *"It looks like you've created a new nodeTypes or edgeTypes object..."* (Error 002).

## Using Typed Nodes

```tsx
const nodes = [
  {
    id: '1',
    type: 'counter',
    position: { x: 0, y: 0 },
    data: { label: 'Counter 1', count: 0 },
  },
];
```
