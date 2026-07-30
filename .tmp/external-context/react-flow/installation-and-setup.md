---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: Installation and Basic Setup
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/
---

# Installation & Basic Setup

## Package
```sh
npm install @xyflow/react
```

Package name: `@xyflow/react` (React Flow v12, formerly `reactflow`)

## CSS
```tsx
import '@xyflow/react/dist/style.css';
```

## Basic Component

```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
```

## Next.js Client Component

In Next.js, the React Flow component MUST be a client component. Add `'use client'` at the top:

```tsx
'use client';

import { ReactFlow, /* ... */ } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function FlowCanvas() {
  // ... component logic
}
```

If you need to use it inside a Server Component, wrap it in a dynamic import with `ssr: false`:

```tsx
// In a server component:
import dynamic from 'next/dynamic';

const FlowCanvas = dynamic(() => import('./FlowCanvas'), { ssr: false });
```
