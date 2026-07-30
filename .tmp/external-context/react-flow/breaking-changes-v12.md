---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: Breaking Changes, Deprecations, and Migration from v11
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/learn/migrating-from-v11
---

# Breaking Changes & Deprecations in v12

## 1. Package Rename

**v11:** `reactflow`
**v12:** `@xyflow/react`

```sh
npm uninstall reactflow
npm install @xyflow/react
```

## 2. `project()` Removed → Use `screenToFlowPosition()`

The `project()` method from `useReactFlow()` has been removed.

```tsx
// ❌ v11 (removed)
reactFlow.project(clientX, clientY);

// ✅ v12
reactFlow.screenToFlowPosition({ x: clientX, y: clientY });

// With snap-to-grid:
reactFlow.screenToFlowPosition({ x: clientX, y: clientY }, {
  snapToGrid: true,
  snapGrid: [20, 20],
});

// Inverse (same in both versions):
reactFlow.flowToScreenPosition(flowX, flowY);
```

## 3. `onMove` → `onViewportChange` (new preferred API)

Both `onMove` and `onViewportChange` fire simultaneously in v12, but `onMove` is legacy.

```tsx
// ✅ v12 preferred:
<ReactFlow onViewportChange={(viewport: Viewport) => {
  console.log(viewport.x, viewport.y, viewport.zoom);
}} />

// Legacy (still works but deprecated):
<ReactFlow onMove={(event, viewport) => {
  console.log(viewport);
}} />
```

Difference: `onViewportChange` receives only `(viewport: Viewport)`, while `onMove` receives `(event, viewport)`.

## 4. New `colorMode` Prop

New in v12 — controls the color scheme:

```tsx
<ReactFlow colorMode="light" />   // default
<ReactFlow colorMode="dark" />
<ReactFlow colorMode="system" />  // auto-detect via prefers-color-scheme
```

## 5. Error 002: nodeTypes/edgeTypes Must Be Stable

v12 strictly warns when `nodeTypes` or `edgeTypes` objects are recreated on every render:

```tsx
// ❌ CAUSES WARNING — inline object
function Flow() {
  return <ReactFlow nodeTypes={{ custom: CustomNode }} />;
}

// ✅ CORRECT — outside component or memoized
const nodeTypes = { custom: CustomNode };

function Flow() {
  return <ReactFlow nodeTypes={nodeTypes} />;
}
```

Warning message: *"It looks like you've created a new nodeTypes or edgeTypes object..."*

## 6. Removed/Deprecated APIs

| v11 (Removed/Deprecated) | v12 Replacement |
|--------------------------|-----------------|
| `reactflow` package | `@xyflow/react` |
| `project()` | `screenToFlowPosition()` |
| `onMove` (preferred) | `onViewportChange` |
| `ReactFlowProvider` (still works) | Still `ReactFlowProvider` |

## 7. Type Changes

- `Node` and `Edge` types now support generics more strictly: `Node<DataType, TypeString>`
- `addEdge`, `applyNodeChanges`, `applyEdgeChanges` import from `@xyflow/react`

## 8. Migration Checklist

1. Replace `import ... from 'reactflow'` → `from '@xyflow/react'`
2. Replace `import 'reactflow/dist/style.css'` → `import '@xyflow/react/dist/style.css'`
3. Replace all `project()` calls with `screenToFlowPosition()`
4. Consider migrating `onMove` to `onViewportChange`
5. Move `nodeTypes`/`edgeTypes` definitions outside component or wrap in `useMemo`
6. Namespace everything under `@xyflow/react`: all types and utilities are re-exported

## Quick Migration Example

```diff
- import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'reactflow';
- import 'reactflow/dist/style.css';
+ import { ReactFlow, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
+ import '@xyflow/react/dist/style.css';
```
