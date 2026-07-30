---
source: Context7 API (library: /xyflow/xyflow)
library: React Flow (xyflow/react)
package: @xyflow/react
topic: MiniMap, Controls, Background Components
fetched: 2026-07-31T12:00:00Z
official_docs: https://reactflow.dev/api-reference/components
---

# Built-in UI Components

## MiniMap

Provides a miniature overview of the graph.

```tsx
import { MiniMap } from '@xyflow/react';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| position | `PanelPosition` | `'bottom-right'` | Panel position |
| width | `number` | `200` | MiniMap width |
| height | `number` | `150` | MiniMap height |
| nodeColor | `string \| ((node: Node) => string)` | `'#e2e2e2'` | Node fill color |
| nodeStrokeColor | `string \| ((node: Node) => string)` | — | Node border color |
| nodeClassName | `string \| ((node: Node) => string)` | — | Node CSS class |
| nodeBorderRadius | `number` | `5` | Node border radius |
| maskColor | `string` | `rgba(240,240,240,0.5)` | Viewport mask color |
| maskStrokeColor | `string` | `'#222'` | Viewport mask stroke |
| maskStrokeWidth | `number` | `1` | Viewport mask stroke width |
| pannable | `boolean` | `true` | Allow panning via MiniMap |
| zoomable | `boolean` | `true` | Allow zooming via MiniMap |
| onClick | `(event: MouseEvent) => void` | — | Click handler |
| ariaLabel | `string` | — | Accessibility label |
| className | `string` | — | CSS class |
| style | `CSSProperties` | — | Inline styles |

### Usage
```tsx
<MiniMap
  nodeColor={(node) => (node.type === 'input' ? '#6ede87' : '#ff0072')}
  maskColor="rgba(0,0,0,0.1)"
  pannable
  zoomable
/>
```

## Controls

Zoom/pan/fit-view buttons overlay.

```tsx
import { Controls } from '@xyflow/react';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| position | `PanelPosition` | `'bottom-left'` | Panel position |
| showZoom | `boolean` | `true` | Show zoom buttons |
| showFitView | `boolean` | `true` | Show fit view button |
| showInteractive | `boolean` | `true` | Show lock/unlock toggle |
| onZoomIn | `() => void` | — | Zoom-in click handler |
| onZoomOut | `() => void` | — | Zoom-out click handler |
| onFitView | `() => void` | — | Fit-view click handler |
| onInteractiveChange | `(interactive: boolean) => void` | — | Lock toggle handler |
| className | `string` | — | CSS class |
| style | `CSSProperties` | — | Inline styles |

## Background

Renders a pattern background for the flow area.

```tsx
import { Background, BackgroundVariant } from '@xyflow/react';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | `string` | — | Unique ID (for multiple backgrounds) |
| variant | `BackgroundVariant` | `'dots'` | Pattern: `'dots'`, `'lines'`, or `'cross'` |
| color | `string` | — | Pattern color |
| bgColor | `string` | — | Background color |
| gap | `number \| [number, number]` | — | Gap between patterns |
| size | `number` | — | Dot/cross size |
| offset | `number \| [number, number]` | — | Pattern offset |
| lineWidth | `number` | — | Stroke width |
| className | `string` | — | Container CSS class |
| patternClassName | `string` | — | Pattern CSS class |
| style | `CSSProperties` | — | Container styles |

### Usage
```tsx
<Background
  variant={BackgroundVariant.Dots}
  color="#aaa"
  gap={16}
  size={1}
/>
```

## Combined Example

```tsx
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';

function Flow() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <MiniMap
        nodeColor={(n) => (n.type === 'input' ? '#6ede87' : '#ff0072')}
        pannable
        zoomable
      />
      <Controls showZoom showFitView showInteractive />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  );
}
```
