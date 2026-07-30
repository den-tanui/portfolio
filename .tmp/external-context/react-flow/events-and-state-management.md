---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: Events, State Management, and Handlers
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/api-reference/hooks
---

# Events & State Management

## Built-in State Hooks

```tsx
import {
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
```

### useNodesState
```tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
```

Manages node state. Returns:
- `nodes` - Current array of nodes
- `setNodes` - Setter to replace nodes
- `onNodesChange` - Pre-bound handler for `onNodesChange` prop

### useEdgesState
```tsx
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

Manages edge state. Returns same pattern as `useNodesState`.

## Connection Handling (onConnect)

```tsx
import { addEdge, Connection } from '@xyflow/react';

const onConnect = useCallback(
  (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  },
  [setEdges]
);

<ReactFlow onConnect={onConnect} />
```

### OnConnect type
```
type OnConnect = (connection: Connection) => void;
```

## Node Change Handlers

### onNodesChange
```tsx
// Using built-in handler (from useNodesState)
<ReactFlow onNodesChange={onNodesChange} />

// Or manually:
import { applyNodeChanges, NodeChange } from '@xyflow/react';

const onNodesChange = useCallback(
  (changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  },
  [setNodes]
);
```

Handles: position changes (drag), selection, dimension changes, removal.

### onEdgesChange
```tsx
// Using built-in handler (from useEdgesState)
<ReactFlow onEdgesChange={onEdgesChange} />

// Or manually:
import { applyEdgeChanges, EdgeChange } from '@xyflow/react';

const onEdgesChange = useCallback(
  (changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  },
  [setEdges]
);
```

## Node Drag Events

```tsx
// Type
type OnNodeDrag<NodeType extends Node = Node> = (
  event: MouseEvent | TouchEvent,
  node: NodeType,
  nodes: NodeType[]
) => void;
```

Three dedicated events:
- `onNodeDragStart` - Drag started
- `onNodeDrag` - Dragging in progress
- `onNodeDragStop` - Drag ended

```tsx
<ReactFlow
  onNodeDragStart={(event, node) => console.log('Started dragging', node.id)}
  onNodeDrag={(event, node, nodes) => console.log('Dragging', node.id)}
  onNodeDragStop={(event, node) => console.log('Stopped dragging', node.id)}
/>
```

## useReactFlow Hook

```tsx
import { useReactFlow } from '@xyflow/react';

function FlowActions() {
  const reactFlow = useReactFlow();

  // Access nodes/edges
  const nodes = reactFlow.getNodes();
  const edges = reactFlow.getEdges();
  const node = reactFlow.getNode('node-1');

  // Mutations
  reactFlow.setNodes(newNodes);
  reactFlow.addNodes(newNode);
  reactFlow.setEdges(newEdges);
  reactFlow.addEdges(newEdge);
  reactFlow.updateNode('node-1', { data: { label: 'Updated' } });
  reactFlow.updateNodeData('node-1', { label: 'Updated' });
  reactFlow.deleteElements({ nodes: [node], edges: [edge] });

  // Viewport
  reactFlow.fitView();
  reactFlow.setViewport({ x: 0, y: 0, zoom: 1 });
  const vp = reactFlow.getViewport();

  return <button onClick={() => reactFlow.fitView()}>Fit View</button>;
}
```

Typed version:
```tsx
const reactFlow = useReactFlow<CustomNodeType, CustomEdgeType>();
```

## Full Controlled Example

```tsx
'use client';

import { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

const initialNodes = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: 'b', position: { x: 200, y: 100 }, data: { label: 'Process' } },
  { id: 'c', type: 'output', position: { x: 0, y: 200 }, data: { label: 'End' } },
];

const initialEdges = [
  { id: 'a-b', source: 'a', target: 'b' },
  { id: 'b-c', source: 'b', target: 'c' },
];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}
```
