"use client"

import { Blocks } from "lucide-react"

const AVAILABLE_BLOCKS = [
  { id: "recycling-rate", label: "Tasa de Reciclaje", icon: "♻️" },
  { id: "imports", label: "Importaciones", icon: "📥" },
  { id: "exports", label: "Exportaciones", icon: "📤" },
  { id: "recoverable-value", label: "Valor Recuperable", icon: "💰" },
  { id: "emissions-avoided", label: "Emisiones Evitadas", icon: "🌍" },
]

export function BlocksPanel({ onAddBlock }) {
  return (
    <div className="w-64 border-r border-border bg-card p-6 overflow-y-auto shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Blocks className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Bloques Disponibles</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Arrastra los bloques al área central para comenzar tu análisis
        </p>
      </div>

      <div className="space-y-3">
        {AVAILABLE_BLOCKS.map((block) => (
          <button
            key={block.id}
            onClick={() => onAddBlock(block.id)}
            className="block-container w-full text-left hover:shadow-md hover:border-primary cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copy"
              e.dataTransfer.setData("blockType", block.id)
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{block.icon}</span>
              <div>
                <p className="font-medium text-sm text-foreground">{block.label}</p>
                <p className="text-xs text-muted-foreground">ID: {block.id}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-muted">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Consejo:</strong> Conecta bloques para visualizar relaciones entre variables de e-waste
        </p>
      </div>
    </div>
  )
}
