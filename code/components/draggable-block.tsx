"use client"

import { X } from "lucide-react"
import { useState } from "react"

const BLOCK_LABELS = {
  "recycling-rate": "Tasa de Reciclaje",
  imports: "Importaciones",
  exports: "Exportaciones",
  "recoverable-value": "Valor Recuperable",
  "emissions-avoided": "Emisiones Evitadas",
}

const BLOCK_COLORS = {
  "recycling-rate": "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
  imports: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  exports: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950 dark:border-cyan-800",
  "recoverable-value": "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800",
  "emissions-avoided": "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
}

export function DraggableBlock({ block, isSelected, onDragStart, onSelect, onRemove, onConnectStart }) {
  const [hoveredPort, setHoveredPort] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handlePortDragStart = (e, portPosition) => {
    e.stopPropagation()
    setIsConnecting(true)
    if (onConnectStart) {
      onConnectStart(block.id, portPosition)
    }
  }

  const handlePortDragEnd = () => {
    setIsConnecting(false)
  }

  return (
    <div
      className={`absolute ${BLOCK_COLORS[block.type]} block-container cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isSelected ? "selected ring-2 ring-primary shadow-lg" : "hover:shadow-md"
      } ${isConnecting ? "opacity-75" : ""}`}
      style={{
        left: `${block.x}px`,
        top: `${block.y}px`,
        width: "200px",
      }}
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm text-foreground">{BLOCK_LABELS[block.type] || block.type}</h3>
          <p className="text-xs text-muted-foreground mt-1">{block.id.substring(0, 12)}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
        >
          <X className="w-4 h-4 text-destructive" />
        </button>
      </div>

      <div className="flex justify-between items-center gap-2">
        <div
          draggable
          onDragStart={(e) => handlePortDragStart(e, "left")}
          onDragEnd={handlePortDragEnd}
          onMouseEnter={() => setHoveredPort("left")}
          onMouseLeave={() => setHoveredPort(null)}
          className={`rounded-full cursor-grab active:cursor-grabbing transition-all ${
            hoveredPort === "left" ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-primary"
          }`}
          title="Arrastra para conectar a otro bloque"
        />
        <span className="text-xs text-muted-foreground font-medium">Conectar</span>
        <div
          draggable
          onDragStart={(e) => handlePortDragStart(e, "right")}
          onDragEnd={handlePortDragEnd}
          onMouseEnter={() => setHoveredPort("right")}
          onMouseLeave={() => setHoveredPort(null)}
          className={`rounded-full cursor-grab active:cursor-grabbing transition-all ${
            hoveredPort === "right" ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-primary"
          }`}
          title="Arrastra para conectar a otro bloque"
        />
      </div>
    </div>
  )
}
