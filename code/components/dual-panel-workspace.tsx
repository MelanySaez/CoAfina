"use client"

import type React from "react"

import { useState } from "react"
import { MetricsPanel } from "@/components/metrics-panel"

const COUNTRIES = ["Colombia", "México", "Perú", "Chile", "Argentina", "Brasil"]

const BLOCK_TYPES = [
  { id: "imports", label: "Importaciones", unit: "tons", icon: "📥" },
  { id: "exports", label: "Exportaciones", unit: "tons", icon: "📤" },
  { id: "recycling", label: "Reciclaje", unit: "%", icon: "♻️" },
  { id: "value", label: "Valor", unit: "USD", icon: "💰" },
  { id: "emissions", label: "Emisiones", unit: "CO2", icon: "💨" },
]

interface Block {
  id: string
  type: string
  side: "left" | "right" | null
  value: number
}

export function DualPanelWorkspace() {
  const [selectedCountry, setSelectedCountry] = useState("Colombia")
  const [blocksLeft, setBlocksLeft] = useState<Block[]>([])
  const [blocksRight, setBlocksRight] = useState<Block[]>([])
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)

  const handleDragStart = (blockType: string) => {
    setDraggedBlock(blockType)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropLeft = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedBlock) {
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: draggedBlock,
        side: "left",
        value: Math.random() * 100,
      }
      setBlocksLeft([...blocksLeft, newBlock])
      setDraggedBlock(null)
    }
  }

  const handleDropRight = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedBlock) {
      const newBlock: Block = {
        id: `block-${Date.now()}`,
        type: draggedBlock,
        side: "right",
        value: Math.random() * 100,
      }
      setBlocksRight([...blocksRight, newBlock])
      setDraggedBlock(null)
    }
  }

  const removeBlockLeft = (id: string) => {
    setBlocksLeft(blocksLeft.filter((b) => b.id !== id))
  }

  const removeBlockRight = (id: string) => {
    setBlocksRight(blocksRight.filter((b) => b.id !== id))
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">País:</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left panel */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropLeft}
          className="flex flex-1 flex-col rounded-lg border-2 border-dashed border-border bg-muted/30 p-4"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">Lado Izquierdo</h2>
          <div className="flex-1 space-y-2">
            {blocksLeft.map((block) => {
              const blockType = BLOCK_TYPES.find((bt) => bt.id === block.type)
              return (
                <div key={block.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{blockType?.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{blockType?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {block.value.toFixed(2)} {blockType?.unit}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBlockLeft(block.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropRight}
          className="flex flex-1 flex-col rounded-lg border-2 border-dashed border-border bg-muted/30 p-4"
        >
          <h2 className="mb-4 text-sm font-semibold text-foreground">Lado Derecho</h2>
          <div className="flex-1 space-y-2">
            {blocksRight.map((block) => {
              const blockType = BLOCK_TYPES.find((bt) => bt.id === block.type)
              return (
                <div key={block.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{blockType?.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{blockType?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {block.value.toFixed(2)} {blockType?.unit}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBlockRight(block.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">Arrastra bloques aquí ↓</p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((blockType) => (
            <div
              key={blockType.id}
              draggable
              onDragStart={() => handleDragStart(blockType.id)}
              className="cursor-grab rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 active:cursor-grabbing"
            >
              {blockType.icon} {blockType.label}
            </div>
          ))}
        </div>
      </div>

      <MetricsPanel blocksLeft={blocksLeft} blocksRight={blocksRight} country={selectedCountry} />
    </div>
  )
}
