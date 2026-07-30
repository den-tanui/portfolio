---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: Save/Restore State, Serialization
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/api-reference/hooks#usereactflow
---

# Save & Restore Graph State

## Using toObject()

The recommended way to serialize the entire flow state (nodes, edges, viewport):

```tsx
import { useReactFlow } from '@xyflow/react';

function SaveButton() {
  const reactFlow = useReactFlow();

  const handleSave = () => {
    // toObject() returns { nodes, edges, viewport }
    const flowData = reactFlow.toObject();
    localStorage.setItem('myflow', JSON.stringify(flowData));
    // or send to API:
    // await fetch('/api/flows', { method: 'POST', body: JSON.stringify(flowData) });
  };

  return <button onClick={handleSave}>Save Flow</button>;
}
```

## Restoring State

```tsx
function LoadButton() {
  const reactFlow = useReactFlow();
  const [setNodes, setEdges] = [reactFlow.setNodes, reactFlow.setEdges];
  // or use the state setters from useNodesState/useEdgesState

  const handleLoad = () => {
    const saved = JSON.parse(localStorage.getItem('myflow'));

    if (saved) {
      // Restore using state setters
      reactFlow.setNodes(saved.nodes);
      reactFlow.setEdges(saved.edges);

      // Restore viewport position/zoom
      if (saved.viewport) {
        reactFlow.setViewport(saved.viewport);
      }
    }
  };

  return <button onClick={handleLoad}>Load Flow</button>;
}
```

## Alternative: Save with setNodes/setEdges directly

```tsx
// Save
const nodes = reactFlow.getNodes();
const edges = reactFlow.getEdges();
const viewport = reactFlow.getViewport();

const flow = { nodes, edges, viewport };
await fetch('/api/flows', { method: 'POST', body: JSON.stringify(flow) });

// Load
const response = await fetch('/api/flows/123');
const { nodes, edges, viewport } = await response.json();

setNodes(nodes);
setEdges(edges);
reactFlow.setViewport(viewport);
```

## Restore in Initial State

Load saved data and pass it as initial nodes/edges:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';

export default function FlowWithLoad() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const saved = localStorage.getItem('myflow');
    if (saved) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  }, [setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      {/* MiniMap, Controls, Background */}
    </ReactFlow>
  );
}
```

## Full Serialization Schema

```typescript
// Shape of toObject() output:
interface FlowExportObject {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}
```
