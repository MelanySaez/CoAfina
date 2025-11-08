"use client"

import { SankeyVisualization } from "@/components/sankey-visualization"
import { useState } from "react"

export function SankeyTab() {
  const [variable, setVariable] = useState("volume")

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Variable:</label>
        <select
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="volume">Volumen</option>
          <option value="value">Valor</option>
          <option value="emissions">Emisiones</option>
        </select>
      </div>
      <div className="flex-1 overflow-auto rounded-lg border border-border bg-card p-4">
        <SankeyVisualization variable={variable} countries={["Colombia", "México", "Perú"]} />
      </div>
    </div>
  )
}
