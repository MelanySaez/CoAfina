"use client"

import { useMemo } from "react"

export function ConnectionVisualizer({ blocks, connections }) {
  const connectionPaths = useMemo(() => {
    return connections.map((conn) => {
      const fromBlock = blocks.find((b) => b.id === conn.from)
      const toBlock = blocks.find((b) => b.id === conn.to)

      if (!fromBlock || !toBlock) return null

      const x1 = fromBlock.x + 200
      const y1 = fromBlock.y + 40
      const x2 = toBlock.x
      const y2 = toBlock.y + 40

      const controlX = (x1 + x2) / 2
      const controlY = (y1 + y2) / 2

      const pathData = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`

      return {
        id: conn.id,
        pathData,
        x1,
        y1,
        x2,
        y2,
      }
    })
  }, [blocks, connections])

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="var(--color-primary)" />
        </marker>
      </defs>

      {connectionPaths.map((path) =>
        path ? (
          <g key={path.id}>
            {/* Main connection line */}
            <path
              d={path.pathData}
              className="connection-line"
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            {/* Animated stroke effect */}
            <path
              d={path.pathData}
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="1"
              opacity="0.3"
              strokeDasharray="5,5"
              strokeLinecap="round"
              style={{
                animation: "dash 15s linear infinite",
              }}
            />
            {/* Connection point indicator */}
            <circle cx={path.x2 - 5} cy={path.y2} r="3" className="fill-primary" />
          </g>
        ) : null,
      )}

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </svg>
  )
}
