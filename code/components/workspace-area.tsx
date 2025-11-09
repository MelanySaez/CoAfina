"use client"

import { useState, useRef } from "react"
import { DraggableBlock } from "./draggable-block"
import { ConnectionVisualizer } from "./connection-visualizer"

export function WorkspaceArea({
  blocks,
  connections,
  selectedBlocks,
  onUpdatePosition,
  onSelectBlock,
  onRemoveBlock,
  onConnect,
}) {
  const workspaceRef = useRef(null)
  const [draggingBlock, setDraggingBlock] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const blockType = e.dataTransfer.getData("blockType")
    if (!blockType || !workspaceRef.current) return

    const rect = workspaceRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 100
    const y = e.clientY - rect.top - 40

    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      x: Math.max(0, Math.min(x, rect.width - 200)),
      y: Math.max(0, Math.min(y, rect.height - 80)),
      data: {},
    }

    const event = new CustomEvent("addBlock", { detail: newBlock })
    workspaceRef.current.dispatchEvent(event)
  }

  const handleBlockDragStart = (id, e) => {
    const block = blocks.find((b) => b.id === id)
    if (!block) return

    setDraggingBlock(id)
    setOffset({
      x: e.clientX - block.x,
      y: e.clientY - block.y,
    })
  }

  const handleConnectStart = (fromId, portPosition) => {
    setIsConnecting(true)
    setConnectionStart({ fromId, port: portPosition })
  }

  const handleMouseMove = (e) => {
    if (!draggingBlock || !workspaceRef.current) return

    const rect = workspaceRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - offset.x
    const y = e.clientY - rect.top - offset.y

    onUpdatePosition(
      draggingBlock,
      Math.max(0, Math.min(x, rect.width - 200)),
      Math.max(0, Math.min(y, rect.height - 80)),
    )
  }

  const handleMouseUp = (e) => {
    if (isConnecting && connectionStart) {
      const target = e.target
      if (target && target.closest && target.closest(".block-container")) {
        const blockElement = target.closest(".block-container")
        const blockId = blocks.find(
          (b) =>
            Math.abs(b.x - Number.parseInt(blockElement.style.left)) < 10 &&
            Math.abs(b.y - Number.parseInt(blockElement.style.top)) < 10,
        )?.id

        if (blockId && blockId !== connectionStart.fromId) {
          onConnect(connectionStart.fromId, blockId)
        }
      }
      setIsConnecting(false)
      setConnectionStart(null)
    }
    setDraggingBlock(null)
  }

  return (
    <div
      ref={workspaceRef}
      className={`relative flex-1 bg-gradient-to-br from-background to-muted border-r border-border overflow-hidden transition-colors ${
        isConnecting ? "bg-primary/5" : ""
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Connection visualization */}
      <ConnectionVisualizer blocks={blocks} connections={connections} />

      {/* Bloques arrastrables */}
      <div className="relative w-full h-full">
        {blocks.map((block) => (
          <DraggableBlock
            key={block.id}
            block={block}
            isSelected={selectedBlocks.includes(block.id)}
            onDragStart={(e) => handleBlockDragStart(block.id, e)}
            onSelect={() => onSelectBlock([block.id])}
            onRemove={() => onRemoveBlock(block.id)}
            onConnectStart={handleConnectStart}
          />
        ))}
      </div>

      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="text-6xl mb-4 opacity-30">📊</div>
          <p className="text-muted-foreground font-medium text-lg">Arrastra bloques aquí para comenzar</p>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs">
            Selecciona bloques del panel izquierdo para explorar datos de e-waste en Latinoamérica
          </p>
        </div>
      )}

      {/* Connection mode indicator */}
      {isConnecting && (
        <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-primary/20 border border-primary/50 text-xs text-primary font-medium">
          Suelta sobre un bloque para conectar
        </div>
      )}
    </div>
  )
}
